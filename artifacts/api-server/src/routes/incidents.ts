import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  AddIncidentCommentBody,
  AddIncidentCommentParams,
  AddIncidentCommentResponse,
  CreateIncidentBody,
  CreateIncidentResponse,
  GetDashboardResponse,
  GetIncidentParams,
  GetIncidentResponse,
  ListIncidentsQueryParams,
  ListIncidentsResponse,
  UpdateIncidentBody,
  UpdateIncidentParams,
  UpdateIncidentResponse,
} from "@workspace/api-zod";
import {
  db,
  incidentChecklistTable,
  incidentCommentsTable,
  incidentEvidenceTable,
  incidentIocsTable,
  incidentsTable,
  incidentTimelineTable,
} from "@workspace/db";

const router: IRouter = Router();
const OPEN_STATUSES = new Set([
  "REPORTED",
  "UNDER REVIEW",
  "TRIAGED",
  "ASSIGNED",
  "INVESTIGATING",
  "CONTAINED",
  "ERADICATED",
  "RECOVERING",
  "ESCALATED",
  "REOPENED",
]);
const transitions: Record<string, string[]> = {
  REPORTED: ["UNDER REVIEW", "TRIAGED", "REJECTED", "DUPLICATE"],
  "UNDER REVIEW": ["TRIAGED", "ASSIGNED", "FALSE POSITIVE", "REJECTED"],
  TRIAGED: ["ASSIGNED", "INVESTIGATING", "ESCALATED"],
  ASSIGNED: ["INVESTIGATING", "ESCALATED"],
  INVESTIGATING: ["CONTAINED", "RESOLVED", "ESCALATED"],
  CONTAINED: ["ERADICATED", "INVESTIGATING", "ESCALATED"],
  ERADICATED: ["RECOVERING"],
  RECOVERING: ["RESOLVED", "INVESTIGATING"],
  RESOLVED: ["CLOSED", "REOPENED"],
  CLOSED: ["REOPENED"],
  REOPENED: ["ASSIGNED", "INVESTIGATING"],
  ESCALATED: ["ASSIGNED", "INVESTIGATING", "CONTAINED"],
  DUPLICATE: [],
  REJECTED: [],
  "FALSE POSITIVE": ["REOPENED"],
};

function toIncident(row: typeof incidentsTable.$inferSelect) {
  return {
    id: row.id,
    incidentNumber: row.incidentNumber,
    title: row.title,
    description: row.description,
    category: row.category,
    severity: row.severity,
    priority: row.priority,
    riskScore: row.riskScore,
    status: row.status,
    reporter: row.reporter,
    department: row.department,
    assignedTo: row.assignedTo,
    affectedSystem: row.affectedSystem,
    affectedUsers: row.affectedUsers,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    slaDueAt: row.slaDueAt,
  };
}

function riskFor(severity: string, affectedUsers: number, category: string) {
  const severityScore: Record<string, number> = {
    LOW: 18,
    MEDIUM: 38,
    HIGH: 62,
    CRITICAL: 82,
  };
  const userImpact = Math.min(14, Math.floor(Math.log2(affectedUsers + 1) * 3));
  const sensitiveCategory =
    /ransomware|data breach|credential|account compromise/i.test(category)
      ? 8
      : 0;
  return Math.min(100, (severityScore[severity.toUpperCase()] ?? 38) + userImpact + sensitiveCategory);
}

function parseId(raw: string | string[]) {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number.parseInt(candidate, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

router.get("/dashboard", async (_req, res): Promise<void> => {
  const incidents = await db.select().from(incidentsTable);
  const timeline = await db
    .select()
    .from(incidentTimelineTable)
    .orderBy(desc(incidentTimelineTable.createdAt))
    .limit(8);
  const now = Date.now();
  const categories = new Map<string, number>();
  const severities = new Map<string, number>();
  const weekly = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    return {
      date: day.toISOString().slice(0, 10),
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      reported: 0,
      resolved: 0,
    };
  });

  for (const incident of incidents) {
    categories.set(incident.category, (categories.get(incident.category) ?? 0) + 1);
    severities.set(incident.severity, (severities.get(incident.severity) ?? 0) + 1);
    const created = incident.createdAt.toISOString().slice(0, 10);
    const resolved = incident.status === "RESOLVED" || incident.status === "CLOSED";
    const slot = weekly.find((day) => day.date === created);
    if (slot) {
      slot.reported += 1;
      if (resolved) slot.resolved += 1;
    }
  }

  const active = incidents.filter((incident) => OPEN_STATUSES.has(incident.status));
  const data = {
    total: incidents.length,
    open: active.length,
    critical: active.filter((incident) => incident.severity === "CRITICAL").length,
    highRisk: active.filter((incident) => incident.riskScore >= 76).length,
    slaAtRisk: active.filter((incident) => {
      const remaining = incident.slaDueAt.getTime() - now;
      return remaining > 0 && remaining <= 60 * 60 * 1000;
    }).length,
    slaBreached: active.filter((incident) => incident.slaDueAt.getTime() < now)
      .length,
    resolved: incidents.filter((incident) =>
      ["RESOLVED", "CLOSED"].includes(incident.status),
    ).length,
    categories: [...categories.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    severities: [...severities.entries()].map(([name, count]) => ({
      name,
      count,
    })),
    weeklyTrend: weekly.map(({ day, reported, resolved }) => ({
      day,
      reported,
      resolved,
    })),
    recentActivity: timeline,
  };
  res.json(GetDashboardResponse.parse(data));
});

router.get("/incidents", async (req, res): Promise<void> => {
  const parsed = ListIncidentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, status, severity } = parsed.data;
  const predicates = [];
  if (status) predicates.push(eq(incidentsTable.status, status));
  if (severity) predicates.push(eq(incidentsTable.severity, severity));
  if (search) {
    const pattern = `%${search}%`;
    predicates.push(
      or(
        ilike(incidentsTable.incidentNumber, pattern),
        ilike(incidentsTable.title, pattern),
        ilike(incidentsTable.description, pattern),
        ilike(incidentsTable.category, pattern),
        ilike(incidentsTable.reporter, pattern),
        ilike(incidentsTable.department, pattern),
        ilike(incidentsTable.affectedSystem, pattern),
      )!,
    );
  }

  const rows = await db
    .select()
    .from(incidentsTable)
    .where(predicates.length ? and(...predicates) : undefined)
    .orderBy(desc(incidentsTable.createdAt));
  res.json(ListIncidentsResponse.parse(rows.map(toIncident)));
});

router.post("/incidents", async (req, res): Promise<void> => {
  const parsed = CreateIncidentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = parsed.data;
  const severity = (input.severity ?? "MEDIUM").toUpperCase();
  const created = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(incidentsTable)
      .values({
        incidentNumber: `PENDING-${randomUUID()}`,
        title: input.title,
        description: input.description,
        category: input.category,
        severity,
        priority:
          severity === "CRITICAL"
            ? "URGENT"
            : severity === "HIGH"
              ? "HIGH"
              : "NORMAL",
        riskScore: riskFor(
          severity,
          input.affectedUsers ?? 1,
          input.category,
        ),
        status: "REPORTED",
        reporter: input.reporter,
        department: input.department,
        affectedSystem: input.affectedSystem ?? null,
        affectedUsers: input.affectedUsers ?? 1,
        impact: input.impact ?? "Impact is being assessed.",
        location: input.location ?? null,
        slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      })
      .returning();
    const [numbered] = await tx
      .update(incidentsTable)
      .set({
        incidentNumber: `INC-${new Date().getFullYear()}-${String(inserted.id).padStart(6, "0")}`,
      })
      .where(eq(incidentsTable.id, inserted.id))
      .returning();
    await tx.insert(incidentTimelineTable).values({
      incidentId: numbered.id,
      label: "Incident reported",
      detail: `${numbered.incidentNumber} was submitted by ${numbered.reporter}.`,
      actor: numbered.reporter,
      kind: "reported",
    });
    return numbered;
  });
  const response = CreateIncidentResponse.parse(toIncident(created));
  res.status(201).json(response);
});

router.get("/incidents/:incidentId", async (req, res): Promise<void> => {
  const params = GetIncidentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(incidentsTable)
    .where(eq(incidentsTable.id, params.data.incidentId));
  if (!row) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }

  const [timeline, comments, evidence, iocs, checklist] = await Promise.all([
    db
      .select()
      .from(incidentTimelineTable)
      .where(eq(incidentTimelineTable.incidentId, row.id))
      .orderBy(desc(incidentTimelineTable.createdAt)),
    db
      .select()
      .from(incidentCommentsTable)
      .where(eq(incidentCommentsTable.incidentId, row.id))
      .orderBy(desc(incidentCommentsTable.createdAt)),
    db
      .select()
      .from(incidentEvidenceTable)
      .where(eq(incidentEvidenceTable.incidentId, row.id))
      .orderBy(desc(incidentEvidenceTable.uploadedAt)),
    db
      .select()
      .from(incidentIocsTable)
      .where(eq(incidentIocsTable.incidentId, row.id)),
    db
      .select()
      .from(incidentChecklistTable)
      .where(eq(incidentChecklistTable.incidentId, row.id)),
  ]);
  const isClient = req.headers["x-portal-type"] === "client";
  const filteredComments = isClient
    ? comments.filter((c) => c.visibility !== "internal")
    : comments;
  const filteredTimeline = isClient
    ? timeline.filter((t) => t.kind !== "internal")
    : timeline;

  const response = {
    ...toIncident(row),
    incidentDate: row.incidentDate,
    discoveryDate: row.discoveryDate,
    location: row.location,
    impact: row.impact,
    rootCause: row.rootCause,
    attackVector: row.attackVector,
    resolution: row.resolution,
    containment: row.containment,
    eradication: row.eradication,
    recovery: row.recovery,
    timeline: filteredTimeline,
    comments: filteredComments,
    evidence,
    iocs,
    checklist,
  };
  res.json(GetIncidentResponse.parse(response));
});

router.patch("/incidents/:incidentId", async (req, res): Promise<void> => {
  const params = UpdateIncidentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateIncidentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [current] = await db
    .select()
    .from(incidentsTable)
    .where(eq(incidentsTable.id, params.data.incidentId));
  if (!current) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }
  const changes = parsed.data;
  if (
    changes.status &&
    changes.status !== current.status &&
    !(transitions[current.status] ?? []).includes(changes.status)
  ) {
    res.status(409).json({
      error: `Cannot move incident from ${current.status} to ${changes.status}.`,
    });
    return;
  }

  const [updated] = await db
    .update(incidentsTable)
    .set(changes)
    .where(eq(incidentsTable.id, current.id))
    .returning();

  const events = [];
  if (changes.status && changes.status !== current.status) {
    events.push({
      incidentId: current.id,
      label: `Status changed to ${changes.status}`,
      detail: `${current.status} → ${changes.status}`,
      actor: "Security Operations",
      kind: "status",
    });
  }
  if (changes.assignedTo !== undefined && changes.assignedTo !== current.assignedTo) {
    events.push({
      incidentId: current.id,
      label: changes.assignedTo ? "Analyst assigned" : "Incident unassigned",
      detail: changes.assignedTo
        ? `Assigned to ${changes.assignedTo}.`
        : "The analyst assignment was cleared.",
      actor: "Security Operations",
      kind: "assignment",
    });
  }
  if (changes.severity && changes.severity !== current.severity) {
    events.push({
      incidentId: current.id,
      label: `Severity set to ${changes.severity}`,
      detail: `${current.severity} → ${changes.severity}`,
      actor: "Security Operations",
      kind: "severity",
    });
  }
  if (changes.riskScore !== undefined && changes.riskScore !== current.riskScore) {
    events.push({
      incidentId: current.id,
      label: "Risk score updated",
      detail: `${current.riskScore} → ${changes.riskScore}`,
      actor: "Security Operations",
      kind: "risk",
    });
  }
  if (events.length) await db.insert(incidentTimelineTable).values(events);
  res.json(UpdateIncidentResponse.parse(toIncident(updated)));
});

router.post(
  "/incidents/:incidentId/comments",
  async (req, res): Promise<void> => {
    const params = AddIncidentCommentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = AddIncidentCommentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [incident] = await db
      .select()
      .from(incidentsTable)
      .where(eq(incidentsTable.id, params.data.incidentId));
    if (!incident) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }
    const [comment] = await db
      .insert(incidentCommentsTable)
      .values({ incidentId: incident.id, ...parsed.data })
      .returning();
    await db.insert(incidentTimelineTable).values({
      incidentId: incident.id,
      label:
        comment.visibility === "internal"
          ? "Internal investigation note added"
          : "Reporter communication added",
      detail: comment.message,
      actor: comment.author,
      kind: "comment",
    });
    res.status(201).json(AddIncidentCommentResponse.parse(comment));
  },
);

export default router;
