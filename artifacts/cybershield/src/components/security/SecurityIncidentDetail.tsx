import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import {
  ArrowLeft,
  Shield,
  Activity,
  Layers,
  Terminal,
  AlertOctagon,
  Clock,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Building,
  Radio,
  Send,
  Lock,
  Flame,
  ShieldAlert,
  Sliders,
  CheckSquare,
  Square,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { IncidentSeverity, IncidentStatus, UserProfile } from '@/types';

export const SecurityIncidentDetail: React.FC<{ incidentIdProp?: number; customUser?: UserProfile }> = ({ incidentIdProp, customUser }) => {
  const { id } = useParams<{ id: string }>();
  const incidentId = incidentIdProp !== undefined ? incidentIdProp : Number(id);
  const { currentUser: authUser } = useAuth();
  const currentUser = customUser || (authUser?.portal_type === 'security' ? authUser : dataService.getUsers().find((u) => u.portal_type === 'security') || authUser);

  const [activeTab, setActiveTab] = useState<'workspace' | 'impact' | 'technical' | 'evidence'>('workspace');
  const [commChannel, setCommChannel] = useState<'internal' | 'client'>('internal');

  // Input states
  const [internalNote, setInternalNote] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [toast, setToast] = useState('');

  // Triage state
  const [newStatus, setNewStatus] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<string>('');
  const [newAnalyst, setNewAnalyst] = useState<string>('');
  const [attackVectorInput, setAttackVectorInput] = useState('');
  const [rootCauseInput, setRootCauseInput] = useState('');

  // Add IOC Modal
  const [iocModalOpen, setIocModalOpen] = useState(false);
  const [newIocValue, setNewIocValue] = useState('');
  const [newIocType, setNewIocType] = useState<'IP' | 'Domain' | 'URL' | 'Hash' | 'Email' | 'Account'>('IP');
  const [newIocThreat, setNewIocThreat] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const incident = dataService.getIncidentById(incidentId, currentUser);
  const users = dataService.getUsers();
  const analysts = users.filter((u) => u.portal_type === 'security');

  if (!incident) {
    return (
      <div className="p-12 text-center text-xs font-mono text-[#64748b] bg-[#091226] border border-[#14234b] rounded-xl space-y-4">
        <AlertOctagon size={28} className="mx-auto text-[#ef4444]" />
        <div>INCIDENT RECORD NOT FOUND</div>
        <Link href="/security/incidents" className="text-[#00f2fe] hover:underline block">
          ← Return to Incident Queue
        </Link>
      </div>
    );
  }

  // Load associated items
  const comments = dataService.getComments(incident.id, currentUser);
  const timeline = dataService.getTimeline(incident.id, currentUser);
  const evidenceList = dataService.getEvidence(incident.id, currentUser);
  const checklist = dataService.getChecklist(incident.id);
  const iocs = dataService.getIocs(incident.id);

  // Section 10: 10-Stage Incident Lifecycle
  const LIFECYCLE_STAGES: IncidentStatus[] = [
    'NEW',
    'TRIAGED',
    'ASSIGNED',
    'INVESTIGATING',
    'CONTAINED',
    'ERADICATED',
    'RECOVERING',
    'RESOLVED',
    'CLOSED',
  ];

  const currentStageIndex = LIFECYCLE_STAGES.indexOf(incident.status);

  const handleAdvanceStage = (stage: IncidentStatus) => {
    if (!currentUser) return;
    dataService.updateIncident(
      incident.id,
      { status: stage },
      currentUser,
      `Lifecycle transitioned to ${stage}`
    );
    showToast(`Lifecycle advanced to ${stage}`);
  };

  const handleUpdateControls = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updates: Partial<any> = {};
    if (newStatus && newStatus !== incident.status) updates.status = newStatus;
    if (newSeverity && newSeverity !== incident.severity) updates.severity = newSeverity;
    if (newAnalyst !== undefined && newAnalyst !== incident.assignedTo) updates.assignedTo = newAnalyst || null;
    if (attackVectorInput) updates.attackVector = attackVectorInput;
    if (rootCauseInput) updates.rootCause = rootCauseInput;

    if (Object.keys(updates).length > 0) {
      dataService.updateIncident(incident.id, updates, currentUser);
      showToast('Incident response controls updated.');
    }
  };

  const handlePostInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim() || !currentUser) return;

    dataService.addComment(
      incident.id,
      internalNote.trim(),
      'internal_security',
      currentUser
    );
    setInternalNote('');
    showToast('Confidential internal SOC note recorded.');
  };

  const handlePostClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim() || !currentUser) return;

    dataService.addComment(
      incident.id,
      clientMessage.trim(),
      'client_visible',
      currentUser
    );
    setClientMessage('');
    showToast('Client update dispatched to customer portal.');
  };

  const handleToggleChecklist = (itemId: number) => {
    if (!currentUser) return;
    dataService.toggleChecklistItem(itemId, currentUser);
    showToast('Checklist task updated.');
  };

  const handleCreateIoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIocValue.trim() || !currentUser) return;

    dataService.addIoc(
      {
        incidentId: incident.id,
        relatedIncidentNumber: incident.incidentNumber,
        type: newIocType,
        value: newIocValue.trim(),
        source: `SOC Investigation on ${incident.incidentNumber}`,
        threatLevel: newIocThreat,
        confidence: 90,
        status: 'Active',
      },
      currentUser
    );

    setNewIocValue('');
    setIocModalOpen(false);
    showToast('New IOC associated with incident.');
  };

  const internalComments = comments.filter((c) => c.visibility === 'internal_security');
  const clientComments = comments.filter((c) => c.visibility === 'client_visible');

  return (
    <div className="space-y-6 font-mono">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00f2fe] text-[#070d1e] font-bold text-xs px-4 py-2.5 rounded-lg shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header and Back Link */}
      <div>
        <Link href="/security/incidents" className="text-xs text-[#00f2fe] hover:underline flex items-center gap-1.5 mb-2">
          <ArrowLeft size={13} /> Back to Incident Queue
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#091226] border border-[#14234b] p-5 rounded-xl shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-[#00f2fe] bg-[#00f2fe]/10 border border-[#00f2fe]/30 px-2 py-0.5 rounded">
                {incident.incidentNumber}
              </span>
              <span className="text-white font-bold">{incident.organizationName}</span>
              <span className="text-[#64748b]">·</span>
              <span className="text-[#94a3b8]">{incident.category}</span>
              <span className="text-[#64748b]">·</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                incident.severity === 'CRITICAL' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40' : 'bg-[#f97316]/20 text-[#f97316]'
              }`}>
                {incident.severity}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
              {incident.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2.5 bg-[#0c1836] border border-[#1d3770] rounded-lg text-right">
              <div className="text-[10px] text-[#64748b]">RISK SCORE</div>
              <div className={`text-xl font-bold ${incident.riskScore >= 80 ? 'text-[#ef4444]' : 'text-[#f97316]'}`}>
                {incident.riskScore} <span className="text-xs text-[#64748b]">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 10: 10-STAGE INCIDENT LIFECYCLE TRIAGE WORKFLOW */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#00f2fe] flex items-center gap-2">
            <Activity size={14} />
            <span>INCIDENT LIFECYCLE TRIAGE WORKFLOW</span>
          </div>
          <span className="text-[10px] text-[#64748b]">Click any stage to advance response status</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
          {LIFECYCLE_STAGES.map((st, idx) => {
            const isCompleted = idx < currentStageIndex || incident.status === 'RESOLVED' || incident.status === 'CLOSED';
            const isCurrent = incident.status === st;
            return (
              <button
                key={st}
                onClick={() => handleAdvanceStage(st)}
                className={`p-2 rounded border text-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#00f2fe] bg-[#00f2fe]/15 text-[#00f2fe] font-bold shadow-md shadow-[#00f2fe]/10'
                    : isCompleted
                    ? 'border-[#1b3470] bg-[#0b1735] text-[#94a3b8] hover:border-[#38bdf8]'
                    : 'border-[#111e40] bg-[#070e22] text-[#475569] hover:border-[#1d3772]'
                }`}
              >
                <div className="text-[9px] text-[#64748b]">STG {idx + 1}</div>
                <div className="text-[10px] font-bold truncate mt-0.5">{st}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Investigation Workspace Tabs */}
      <div className="flex border-b border-[#14234b] gap-2 text-xs">
        {[
          { id: 'workspace', label: 'INVESTIGATION WORKSPACE' },
          { id: 'impact', label: 'IMPACT & BUSINESS ASSESSMENT' },
          { id: 'technical', label: 'TECHNICAL DETAILS & IOCS' },
          { id: 'evidence', label: `EVIDENCE VAULT (${evidenceList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#00f2fe] text-[#00f2fe]'
                : 'border-transparent text-[#64748b] hover:text-[#cbd5e1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Checklist, Dual Communications, Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Incident Summary Card */}
            <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <FileText size={14} className="text-[#00f2fe]" />
                <span>INCIDENT SUMMARY & FINDINGS</span>
              </h3>
              <div className="text-xs text-[#cbd5e1] leading-relaxed p-4 rounded-lg bg-[#060c1c] border border-[#14234b] whitespace-pre-wrap">
                {incident.description}
              </div>

              {incident.containment && (
                <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg text-xs text-[#6ee7b7]">
                  <strong>CONTAINMENT STRATEGY ENFORCED:</strong> {incident.containment}
                </div>
              )}
            </div>

            {/* Response Checklist (SECTION 12 SPECIFICATION) */}
            <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <CheckSquare size={14} className="text-[#00f2fe]" />
                  <span>INVESTIGATION & CONTAINMENT CHECKLIST</span>
                </h3>
                <span className="text-[10px] text-[#64748b]">
                  {checklist.filter((c) => c.completed).length} of {checklist.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                      item.completed
                        ? 'bg-[#0a1838] border-[#1b3d80] text-[#94a3b8]'
                        : 'bg-[#060d1f] border-[#152752] text-white hover:border-[#00f2fe]'
                    }`}
                  >
                    <div className="mt-0.5 text-[#00f2fe]">
                      {item.completed ? <CheckSquare size={16} /> : <Square size={16} className="text-[#475569]" />}
                    </div>
                    <div className="flex-1">
                      <div className={item.completed ? 'line-through text-[#64748b]' : 'font-bold'}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[#475569] mt-0.5 flex items-center gap-2">
                        <span>Phase: {item.phase}</span>
                        {item.completedBy && <span>· Completed by: {item.completedBy}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DUAL COMMUNICATION CHANNEL (SECTIONS 13 & 14) */}
            <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#14234b] flex items-center justify-between bg-[#0b1633]">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <button
                    onClick={() => setCommChannel('internal')}
                    className={`flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${
                      commChannel === 'internal'
                        ? 'border-[#ef4444] text-[#f87171]'
                        : 'border-transparent text-[#64748b] hover:text-white'
                    }`}
                  >
                    <Lock size={13} />
                    <span>INTERNAL SECURITY NOTES (CONFIDENTIAL)</span>
                    <span className="px-1.5 py-0.2 text-[9px] rounded bg-[#ef4444]/20 text-[#ef4444]">
                      {internalComments.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCommChannel('client')}
                    className={`flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${
                      commChannel === 'client'
                        ? 'border-[#00f2fe] text-[#00f2fe]'
                        : 'border-transparent text-[#64748b] hover:text-white'
                    }`}
                  >
                    <Send size={13} />
                    <span>CLIENT VISIBLE COMMUNICATIONS</span>
                    <span className="px-1.5 py-0.2 text-[9px] rounded bg-[#00f2fe]/20 text-[#00f2fe]">
                      {clientComments.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto">
                {commChannel === 'internal' ? (
                  internalComments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#64748b]">
                      No internal notes recorded. Record attribution, detection logic, or SOC observations below.
                    </div>
                  ) : (
                    internalComments.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-lg bg-[#140c17] border border-[#3b1526] text-xs">
                        <div className="flex items-center justify-between text-[10px] text-[#f87171] mb-1 font-bold">
                          <span>{c.author} ({c.authorRole}) // INTERNAL SOC NOTE</span>
                          <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[#fecdd3] leading-relaxed">{c.message}</p>
                      </div>
                    ))
                  )
                ) : (
                  clientComments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#64748b]">
                      No client messages yet. Dispatch instructions or status requests to the client organization below.
                    </div>
                  ) : (
                    clientComments.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-lg bg-[#071329] border border-[#173066] text-xs">
                        <div className="flex items-center justify-between text-[10px] text-[#38bdf8] mb-1 font-bold">
                          <span>{c.author} ({c.authorRole})</span>
                          <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[#cbd5e1] leading-relaxed">{c.message}</p>
                      </div>
                    ))
                  )
                )}
              </div>

              {/* Input Box */}
              <div className="p-4 border-t border-[#14234b] bg-[#070e22]">
                {commChannel === 'internal' ? (
                  <form onSubmit={handlePostInternalNote} className="space-y-2">
                    <div className="text-[10px] text-[#f87171] font-bold flex items-center gap-1">
                      <Lock size={11} /> RECORD CONFIDENTIAL ANALYST NOTE (NEVER VISIBLE TO CLIENT):
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        placeholder="Add IOC findings, sandbox telemetry, reverse engineering notes..."
                        className="flex-1 px-3 py-2 text-xs bg-[#0b1428] border border-[#381628] rounded-lg text-white placeholder-[#64748b] outline-none focus:border-[#ef4444]"
                      />
                      <button
                        type="submit"
                        disabled={!internalNote.trim()}
                        className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        Record Note
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePostClientMessage} className="space-y-2">
                    <div className="text-[10px] text-[#00f2fe] font-bold flex items-center gap-1">
                      <Send size={11} /> DISPATCH TO CLIENT PORTAL:
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                        placeholder="e.g. Please confirm if employee disconnected workstation from corporate VPN..."
                        className="flex-1 px-3 py-2 text-xs bg-[#0b1428] border border-[#1b3470] rounded-lg text-white placeholder-[#64748b] outline-none focus:border-[#00f2fe]"
                      />
                      <button
                        type="submit"
                        disabled={!clientMessage.trim()}
                        className="px-4 py-2 bg-[#00f2fe] hover:bg-[#38bdf8] text-[#070d1e] text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        Send to Client
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Clock size={14} className="text-[#00f2fe]" />
                <span>INVESTIGATION TIMELINE ({timeline.length})</span>
              </h3>
              <div className="space-y-3">
                {timeline.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 text-xs">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                      event.isInternal ? 'bg-[#ef4444] ring-4 ring-[#ef4444]/20' : 'bg-[#00f2fe] ring-4 ring-[#00f2fe]/20'
                    }`} />
                    <div className="flex-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{event.label}</span>
                        {event.isInternal && (
                          <span className="text-[9px] px-1 bg-[#ef4444]/20 text-[#ef4444] rounded">INTERNAL</span>
                        )}
                      </div>
                      <div className="text-[#94a3b8] text-[11px] mt-0.5">{event.detail}</div>
                      <div className="text-[10px] text-[#475569] mt-0.5">
                        {event.actor} · {new Date(event.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Response Controls & Playbooks */}
          <div className="space-y-6">
            
            {/* Incident Controls Panel */}
            <form onSubmit={handleUpdateControls} className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Sliders size={14} className="text-[#00f2fe]" />
                <span>RESPONSE CONTROLS</span>
              </h3>

              <div>
                <label className="block text-[11px] text-[#64748b] mb-1">Assigned Analyst</label>
                <select
                  defaultValue={incident.assignedTo || ''}
                  onChange={(e) => setNewAnalyst(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                >
                  <option value="">Unassigned</option>
                  {analysts.map((a) => (
                    <option key={a.id} value={a.full_name}>{a.full_name} ({a.clearance_level})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#64748b] mb-1">Status Override</label>
                <select
                  defaultValue={incident.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                >
                  {LIFECYCLE_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#64748b] mb-1">Severity Assessment</label>
                <select
                  defaultValue={incident.severity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                >
                  <option value="CRITICAL">CRITICAL (15m SLA)</option>
                  <option value="HIGH">HIGH (1h SLA)</option>
                  <option value="MEDIUM">MEDIUM (4h SLA)</option>
                  <option value="LOW">LOW (24h SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#64748b] mb-1">Attack Vector</label>
                <input
                  type="text"
                  defaultValue={incident.attackVector || ''}
                  onChange={(e) => setAttackVectorInput(e.target.value)}
                  placeholder="e.g. Compromised VPN Credential"
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00f2fe] hover:bg-[#38bdf8] text-[#070d1e] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Save Response Controls
              </button>
            </form>

            {/* Quick Defensive Playbook Actions */}
            <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#ef4444]" />
                <span>RESPONSE PLAYBOOK ACTIONS</span>
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    dataService.addTimelineEvent({
                      incidentId: incident.id,
                      label: 'Endpoint Isolated (Playbook Action)',
                      detail: `Host ${incident.affectedSystem || 'targeted endpoint'} quarantined from internal subnet.`,
                      actor: currentUser?.full_name || 'SOC Analyst',
                      kind: 'containment',
                      isInternal: true,
                    });
                    showToast('Endpoint containment signal dispatched to EDR sensor.');
                  }}
                  className="w-full p-2.5 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#fca5a5] text-left text-xs font-bold flex items-center justify-between"
                >
                  <span>Isolate Endpoint Network</span>
                  <span>⚡ ENFORCE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    dataService.addTimelineEvent({
                      incidentId: incident.id,
                      label: 'SSO Session Invalidation (Playbook Action)',
                      detail: 'Revoked active OAuth tokens and killed Okta / Azure AD refresh cookies.',
                      actor: currentUser?.full_name || 'SOC Analyst',
                      kind: 'containment',
                      isInternal: true,
                    });
                    showToast('Global session revocation pushed to identity provider.');
                  }}
                  className="w-full p-2.5 rounded-lg bg-[#f97316]/10 hover:bg-[#f97316]/20 border border-[#f97316]/30 text-[#fdba74] text-left text-xs font-bold flex items-center justify-between"
                >
                  <span>Revoke Active SSO Credentials</span>
                  <span>⚡ REVOKE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    dataService.updateIncident(
                      incident.id,
                      { status: 'ESCALATED' },
                      currentUser!,
                      'Incident escalated to Tier 3 Command.'
                    );
                    showToast('Escalated to SecOps Command.');
                  }}
                  className="w-full p-2.5 rounded-lg bg-[#a855f7]/10 hover:bg-[#a855f7]/20 border border-[#a855f7]/30 text-[#d8b4fe] text-left text-xs font-bold flex items-center justify-between"
                >
                  <span>Escalate to Tier 3 / IR Lead</span>
                  <span>▲ ESCALATE</span>
                </button>
              </div>
            </div>

            {/* Incident IOC Quick Snippet */}
            <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Fingerprint size={14} className="text-[#00f2fe]" />
                  <span>ASSOCIATED IOCS ({iocs.length})</span>
                </h3>
                <button
                  onClick={() => setIocModalOpen(true)}
                  className="text-[11px] text-[#00f2fe] hover:underline"
                >
                  + Add IOC
                </button>
              </div>

              {iocs.length === 0 ? (
                <div className="text-xs text-[#64748b]">No IOCs recorded yet.</div>
              ) : (
                <div className="space-y-1.5">
                  {iocs.map((ioc) => (
                    <div key={ioc.id} className="p-2 rounded bg-[#050b1a] border border-[#172d5c] text-xs">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#38bdf8]">{ioc.type}</span>
                        <span className="text-[#ef4444]">{ioc.threatLevel}</span>
                      </div>
                      <div className="text-white font-bold truncate mt-0.5">{ioc.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Tab: Impact Assessment (SECTION 11 SPECIFICATION) */}
      {activeTab === 'impact' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <Flame size={16} className="text-[#f97316]" />
            <span>ORGANIZATIONAL & INFRASTRUCTURE IMPACT ASSESSMENT</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[11px] text-[#64748b] uppercase font-bold">BUSINESS IMPACT</div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {incident.impactBusiness || incident.impact || 'Under assessment by SOC triage.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[11px] text-[#64748b] uppercase font-bold">DATA EXPOSURE IMPACT</div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {incident.impactData || 'No unauthorized customer or regulatory data access confirmed.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[11px] text-[#64748b] uppercase font-bold">AVAILABILITY & SERVICE DISRUPTION</div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {incident.impactAvailability || 'Affected host isolated; core customer transactions remain online.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[11px] text-[#64748b] uppercase font-bold">ROOT CAUSE HYPOTHESIS</div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {incident.rootCause || 'Root cause analysis in progress.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Technical Details & IOCs (SECTION 11 SPECIFICATION) */}
      {activeTab === 'technical' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Fingerprint size={16} className="text-[#00f2fe]" />
              <span>TECHNICAL TELEMETRY & INDICATORS OF COMPROMISE (IOCS)</span>
            </h2>
            <button
              onClick={() => setIocModalOpen(true)}
              className="px-3 py-1.5 bg-[#00f2fe] text-[#070d1e] font-bold text-xs rounded-lg"
            >
              + Record Indicator
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2 text-xs">
            <div className="text-[11px] text-[#64748b] uppercase font-bold">TECHNICAL DETAILS SUMMARY</div>
            <p className="text-[#cbd5e1] leading-relaxed">
              {incident.technicalDetails || 'No auxiliary technical details submitted.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-2.5 px-3">IOC TYPE</th>
                  <th className="py-2.5 px-3">INDICATOR VALUE</th>
                  <th className="py-2.5 px-3">SOURCE</th>
                  <th className="py-2.5 px-3">THREAT LEVEL</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {iocs.map((ioc) => (
                  <tr key={ioc.id}>
                    <td className="py-3 px-3 text-[#38bdf8] font-bold">{ioc.type}</td>
                    <td className="py-3 px-3 text-white font-bold">{ioc.value}</td>
                    <td className="py-3 px-3 text-[#64748b]">{ioc.source}</td>
                    <td className="py-3 px-3 text-[#ef4444] font-bold">{ioc.threatLevel}</td>
                    <td className="py-3 px-3 text-[#10b981]">{ioc.status}</td>
                    <td className="py-3 px-3 text-[#cbd5e1]">{ioc.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Evidence Vault */}
      {activeTab === 'evidence' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <Terminal size={16} className="text-[#00f2fe]" />
            <span>CRYPTOGRAPHIC EVIDENCE CUSTODY VAULT</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-2.5 px-3">FILENAME</th>
                  <th className="py-2.5 px-3">TYPE</th>
                  <th className="py-2.5 px-3">SIZE</th>
                  <th className="py-2.5 px-3">SHA-256 HASH</th>
                  <th className="py-2.5 px-3">UPLOADED BY</th>
                  <th className="py-2.5 px-3">VISIBILITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {evidenceList.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 px-3 text-white font-bold">{e.filename}</td>
                    <td className="py-3 px-3 text-[#94a3b8]">{e.type}</td>
                    <td className="py-3 px-3 text-[#38bdf8]">{e.size}</td>
                    <td className="py-3 px-3 text-[#64748b] font-mono text-[10px]">{e.hash}</td>
                    <td className="py-3 px-3 text-[#cbd5e1]">{e.uploadedBy}</td>
                    <td className="py-3 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        e.isInternal ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#10b981]/20 text-[#10b981]'
                      }`}>
                        {e.isInternal ? 'SOC INTERNAL' : 'CLIENT VISIBLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add IOC Modal */}
      {iocModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040814]/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#091226] border border-[#1b3470] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Record New Indicator of Compromise</h3>
            
            <form onSubmit={handleCreateIoc} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#64748b] mb-1">IOC Value *</label>
                <input
                  type="text"
                  required
                  value={newIocValue}
                  onChange={(e) => setNewIocValue(e.target.value)}
                  placeholder="e.g. 185.220.101.42 or malware.exe"
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#64748b] mb-1">Type</label>
                  <select
                    value={newIocType}
                    onChange={(e) => setNewIocType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none"
                  >
                    <option>IP</option>
                    <option>Domain</option>
                    <option>URL</option>
                    <option>Hash</option>
                    <option>Email</option>
                    <option>Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#64748b] mb-1">Threat Level</label>
                  <select
                    value={newIocThreat}
                    onChange={(e) => setNewIocThreat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIocModalOpen(false)}
                  className="px-4 py-2 border border-[#1b3470] text-[#94a3b8] hover:bg-[#0c1836] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00f2fe] text-[#070d1e] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save IOC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
