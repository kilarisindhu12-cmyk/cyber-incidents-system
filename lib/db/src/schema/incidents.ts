import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const incidentsTable = pgTable(
  "cybershield_incidents",
  {
    id: serial("id").primaryKey(),
    incidentNumber: text("incident_number").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    severity: text("severity").notNull().default("MEDIUM"),
    priority: text("priority").notNull().default("NORMAL"),
    riskScore: integer("risk_score").notNull().default(35),
    status: text("status").notNull().default("REPORTED"),
    reporter: text("reporter").notNull(),
    department: text("department").notNull(),
    assignedTo: text("assigned_to"),
    affectedSystem: text("affected_system"),
    affectedUsers: integer("affected_users").notNull().default(1),
    impact: text("impact").notNull().default("Impact is being assessed."),
    location: text("location"),
    incidentDate: timestamp("incident_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    discoveryDate: timestamp("discovery_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    slaDueAt: timestamp("sla_due_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    rootCause: text("root_cause"),
    attackVector: text("attack_vector"),
    containment: text("containment"),
    eradication: text("eradication"),
    recovery: text("recovery"),
    resolution: text("resolution"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("cybershield_incident_number_idx").on(table.incidentNumber),
    index("cybershield_incident_status_idx").on(table.status),
    index("cybershield_incident_created_idx").on(table.createdAt),
  ],
);

export const incidentCommentsTable = pgTable(
  "cybershield_incident_comments",
  {
    id: serial("id").primaryKey(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidentsTable.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    message: text("message").notNull(),
    visibility: text("visibility").notNull().default("reporter"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("cybershield_comment_incident_idx").on(table.incidentId)],
);

export const incidentTimelineTable = pgTable(
  "cybershield_incident_timeline",
  {
    id: serial("id").primaryKey(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidentsTable.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    detail: text("detail").notNull(),
    actor: text("actor").notNull(),
    kind: text("kind").notNull().default("activity"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("cybershield_timeline_incident_idx").on(table.incidentId)],
);

export const incidentEvidenceTable = pgTable(
  "cybershield_incident_evidence",
  {
    id: serial("id").primaryKey(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidentsTable.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    type: text("type").notNull(),
    size: text("size").notNull(),
    hash: text("hash").notNull(),
    uploadedBy: text("uploaded_by").notNull(),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("cybershield_evidence_incident_idx").on(table.incidentId)],
);

export const incidentIocsTable = pgTable(
  "cybershield_incident_iocs",
  {
    id: serial("id").primaryKey(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidentsTable.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    value: text("value").notNull(),
    confidence: integer("confidence").notNull().default(75),
  },
  (table) => [index("cybershield_ioc_incident_idx").on(table.incidentId)],
);

export const incidentChecklistTable = pgTable(
  "cybershield_incident_checklist",
  {
    id: serial("id").primaryKey(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidentsTable.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    completed: boolean("completed").notNull().default(false),
  },
  (table) => [
    index("cybershield_checklist_incident_idx").on(table.incidentId),
  ],
);

export const insertIncidentSchema = createInsertSchema(incidentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidentsTable.$inferSelect;
