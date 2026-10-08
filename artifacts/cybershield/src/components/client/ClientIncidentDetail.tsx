import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import {
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  MessageSquare,
  FileText,
  User,
  Building,
  Send,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const ClientIncidentDetail: React.FC<{ incidentIdProp?: number }> = ({ incidentIdProp }) => {
  const { id } = useParams<{ id: string }>();
  const incidentId = incidentIdProp !== undefined ? incidentIdProp : Number(id);
  const { currentUser } = useAuth();

  const [newMessage, setNewMessage] = useState('');
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceFilename, setEvidenceFilename] = useState('');
  const [evidenceType, setEvidenceType] = useState('Screenshot');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const incident = dataService.getIncidentById(incidentId, currentUser);

  // If incident not found or tenant violation
  if (!incident) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center bg-white p-8 rounded-xl border border-[#dfe7e9] shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-lg font-bold text-[#1f3740]">Incident Not Accessible</h2>
        <p className="text-xs text-[#6e838b]">
          This incident does not exist or does not belong to your organization&apos;s tenant authorization scope.
        </p>
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#167e68] text-white text-xs font-bold rounded-lg"
        >
          <ArrowLeft size={13} /> Back to My Incidents
        </Link>
      </div>
    );
  }

  // Strictly query comments with currentUser: Emulates RLS and filters out internal notes!
  const comments = dataService.getComments(incident.id, currentUser);
  const timeline = dataService.getTimeline(incident.id, currentUser);
  const evidenceList = dataService.getEvidence(incident.id, currentUser);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    dataService.addComment(incident.id, newMessage.trim(), 'client_visible', currentUser);
    setNewMessage('');
    showToast('Message sent to the security team.');
  };

  const handleUploadEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFilename.trim() || !currentUser) return;

    dataService.addEvidence(
      incident.id,
      {
        filename: evidenceFilename.trim(),
        type: evidenceType,
        size: '2.4 MB',
        isInternal: false,
      },
      currentUser
    );

    setEvidenceFilename('');
    setEvidenceModalOpen(false);
    showToast('Evidence attached to incident record.');
  };

  const statusStages = ['REPORTED', 'UNDER_REVIEW', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED'];
  const currentStageIndex = statusStages.indexOf(
    incident.status === 'NEW' ? 'REPORTED' : incident.status === 'TRIAGED' ? 'UNDER_REVIEW' : incident.status
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#167e68] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div>
        <Link href="/incidents" className="text-xs font-semibold text-[#167e68] hover:underline flex items-center gap-1.5 mb-2">
          <ArrowLeft size={13} /> Back to Organization Incidents
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#14705c] bg-[#e6f4f0] px-2 py-0.5 rounded">
                {incident.incidentNumber}
              </span>
              <span className="text-xs text-[#71878f]">· {incident.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#152e36] tracking-tight mt-1">
              {incident.title}
            </h1>
          </div>

          <button
            onClick={() => setEvidenceModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-[#c9dcd6] hover:bg-[#f2faf7] text-[#14705c] text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <FileUp size={14} />
            <span>Upload Additional Evidence</span>
          </button>
        </div>
      </div>

      {/* Incident Lifecycle Progress Tracker */}
      <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#71878f] mb-3">
          Remediation Progress
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {statusStages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex || incident.status === 'RESOLVED' || incident.status === 'CLOSED';
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={stage}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  isCurrent
                    ? 'border-[#167e68] bg-[#eaf6f2] text-[#14705c] font-bold shadow-xs'
                    : isCompleted
                    ? 'border-[#cbdfe0] bg-[#f8fafb] text-[#556e77]'
                    : 'border-[#edf2f3] text-[#a4b5bc] bg-[#fafcfc]'
                }`}
              >
                <div className="text-[10px] font-mono">{idx + 1}</div>
                <div className="text-xs mt-0.5 font-semibold">
                  {stage.replace(/_/g, ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details, Reporter Timeline & Dual Communication Thread */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Incident Description */}
          <div className="bg-white border border-[#dfe7e9] rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#1a333c]">Incident Details</h2>
            <div className="text-xs text-[#395058] leading-relaxed whitespace-pre-wrap bg-[#f9fbfb] p-4 rounded-lg border border-[#e8eff1]">
              {incident.description}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <span className="text-[#7c9098] block text-[11px]">Affected System</span>
                <strong className="text-[#203a42]">{incident.affectedSystem || 'Under Assessment'}</strong>
              </div>
              <div>
                <span className="text-[#7c9098] block text-[11px]">Users Impacted</span>
                <strong className="text-[#203a42]">{incident.affectedUsers} user(s)</strong>
              </div>
              <div>
                <span className="text-[#7c9098] block text-[11px]">Location</span>
                <strong className="text-[#203a42]">{incident.location || 'Remote'}</strong>
              </div>
            </div>
          </div>

          {/* Communication with Security Team (CLIENT VISIBLE CHANNEL) */}
          <div className="bg-white border border-[#dfe7e9] rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e6edee] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#167e68]" />
                <h2 className="text-sm font-bold text-[#1a333c]">Communication with Security Team</h2>
              </div>
              <span className="text-[10px] font-mono text-[#71878f] bg-[#f0f4f5] px-2 py-0.5 rounded">
                Direct SOC Channel
              </span>
            </div>

            {/* Message Thread */}
            <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7d9098]">
                  No messages yet. You can post updates or answer questions for the SOC team below.
                </div>
              ) : (
                comments.map((c) => {
                  const isSOC = c.authorPortal === 'security';
                  return (
                    <div
                      key={c.id}
                      className={`p-3.5 rounded-xl border text-xs max-w-lg ${
                        isSOC
                          ? 'bg-[#f0f9f6] border-[#cae8df] ml-0 text-[#19453b]'
                          : 'bg-white border-[#dce5e8] ml-auto text-[#2b444d]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#71878f] mb-1.5">
                        <strong className={isSOC ? 'text-[#14705c] font-bold' : 'text-[#203941]'}>
                          {c.author} ({c.authorRole})
                        </strong>
                        <span className="font-mono">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed">{c.message}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e6edee] bg-[#f9fbfb] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message the security analyst investigating this incident..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Client-Visible Timeline */}
          <div className="bg-white border border-[#dfe7e9] rounded-xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#1a333c] mb-4">Response Timeline</h2>
            <div className="space-y-4">
              {timeline.map((event) => (
                <div key={event.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#167e68] mt-1 shrink-0 ring-4 ring-[#e6f4f0]" />
                  <div className="flex-1">
                    <div className="font-bold text-[#1e3841]">{event.label}</div>
                    <div className="text-[#647c84] text-[11px] mt-0.5">{event.detail}</div>
                    <div className="text-[10px] font-mono text-[#8a9ca2] mt-1">
                      {event.actor} · {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Evidence & Metadata Sidebar */}
        <div className="space-y-6">
          
          {/* Key Incident Metadata */}
          <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#1a333c] uppercase font-mono tracking-wider">
              Incident Status
            </h3>

            <div className="space-y-2 text-xs divide-y divide-[#edf2f4]">
              <div className="pt-2 flex justify-between">
                <span className="text-[#71878f]">Current Stage:</span>
                <strong className="text-[#14705c]">{incident.status}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#71878f]">Reported By:</span>
                <strong className="text-[#203a42]">{incident.reporter}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#71878f]">Assigned SOC Analyst:</span>
                <strong className="text-[#203a42]">{incident.assignedTo || 'SOC Triage Queue'}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#71878f]">Reported At:</span>
                <span className="font-mono text-[#576f77]">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Attachments */}
          <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1a333c] uppercase font-mono tracking-wider">
                Evidence Files ({evidenceList.length})
              </h3>
              <button
                onClick={() => setEvidenceModalOpen(true)}
                className="text-[11px] font-bold text-[#167e68] hover:underline"
              >
                + Add
              </button>
            </div>

            {evidenceList.length === 0 ? (
              <div className="text-xs text-[#8a9ca2] py-2">
                No evidence attached yet. You can upload screenshots or headers.
              </div>
            ) : (
              <div className="space-y-2">
                {evidenceList.map((e) => (
                  <div key={e.id} className="p-2.5 rounded-lg border border-[#e8eff1] bg-[#f9fbfb] text-xs">
                    <div className="font-bold text-[#1d3841] truncate">{e.filename}</div>
                    <div className="text-[10px] text-[#71878f] mt-0.5">
                      {e.type} · {e.size}
                    </div>
                    <div className="text-[9px] font-mono text-[#8a9ca2] mt-1 truncate">
                      SHA: {e.hash.slice(0, 24)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Help Desk Info */}
          <div className="bg-[#f0f9f6] border border-[#cbe8df] rounded-xl p-4 text-xs text-[#1e4e42] space-y-2">
            <div className="font-bold text-[#136854]">Need Immediate Emergency Assistance?</div>
            <p className="text-[11px] text-[#2d5f53] leading-relaxed">
              If an attacker is actively demanding ransom or locking critical systems, call the CyberShield SOC 24/7 Crisis Hotline directly:
            </p>
            <div className="font-mono font-bold text-sm text-[#115b49]">+1 (800) 555-CYBER</div>
          </div>

        </div>

      </div>

      {/* Evidence Upload Modal */}
      {evidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c242c]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#dce5e8] space-y-4">
            <h3 className="text-base font-bold text-[#16333c]">Upload Additional Evidence</h3>
            <p className="text-xs text-[#6e838b]">
              Attach forensic metadata or screenshots to assist the security team with the investigation.
            </p>

            <form onSubmit={handleUploadEvidence} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#486069] mb-1">Evidence Filename *</label>
                <input
                  type="text"
                  required
                  value={evidenceFilename}
                  onChange={(e) => setEvidenceFilename(e.target.value)}
                  placeholder="e.g. suspicious_invoice.pdf"
                  className="w-full px-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#486069] mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
                >
                  <option>Screenshot</option>
                  <option>Email Header / File</option>
                  <option>Log File</option>
                  <option>Network Capture</option>
                  <option>Malicious Link / Document</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvidenceModalOpen(false)}
                  className="px-4 py-2 border border-[#d6e0e3] hover:bg-[#f2f6f7] text-[#435d66] text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Attach to Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
