import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileUp,
  AlertTriangle,
  Building,
  User,
  Computer,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { IncidentSeverity } from '@/types';

export const ClientNewIncident: React.FC = () => {
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Phishing');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [description, setDescription] = useState('');
  
  // Step 2
  const [affectedSystem, setAffectedSystem] = useState('');
  const [affectedUsers, setAffectedUsers] = useState(1);
  const [impactSummary, setImpactSummary] = useState('');
  const [locationName, setLocationName] = useState('');
  const [department, setDepartment] = useState(currentUser?.department || 'Finance');

  // Step 3 (Evidence Attachment)
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceType, setEvidenceType] = useState('Email Attachment');

  const [error, setError] = useState('');

  const handleNextStep1 = () => {
    if (!title.trim() || title.length < 5) {
      setError('Please provide a descriptive incident title (at least 5 characters).');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setError('Please describe what happened in detail (at least 15 characters).');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    setError('');
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);

    try {
      const newInc = dataService.createIncident(
        {
          title,
          category,
          severity,
          description,
          affectedSystem: affectedSystem || 'Not Specified',
          affectedUsers: Number(affectedUsers) || 1,
          impact: impactSummary || 'Initial triage in progress.',
          location: locationName || 'Remote',
          department,
        },
        currentUser
      );

      // If evidence metadata provided, attach it immediately
      if (evidenceName.trim()) {
        dataService.addEvidence(
          newInc.id,
          {
            filename: evidenceName,
            type: evidenceType,
            size: '1.2 MB',
            isInternal: false,
          },
          currentUser
        );
      }

      setLoading(false);
      setLocation(`/incidents/${newInc.id}`);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Failed to submit incident report.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[#167e68] hover:underline flex items-center gap-1.5 mb-2">
          <ArrowLeft size={13} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-[#152e36] tracking-tight">Report a Cybersecurity Incident</h1>
        <p className="text-xs text-[#6e838b] mt-1">
          Provide as much information as you can. Our 24/7 Security Operations Team will immediately review and begin containment.
        </p>
      </div>

      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between bg-white border border-[#dfe7e9] rounded-xl p-4 shadow-xs">
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-[#167e68]' : 'text-[#8da0a6]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
            step >= 1 ? 'bg-[#e5f4f0] text-[#167e68]' : 'bg-[#f1f5f7] text-[#8da0a6]'
          }`}>1</span>
          <span>Incident Overview</span>
        </div>
        <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-[#167e68]' : 'bg-[#e2eaec]'}`} />
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-[#167e68]' : 'text-[#8da0a6]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
            step >= 2 ? 'bg-[#e5f4f0] text-[#167e68]' : 'bg-[#f1f5f7] text-[#8da0a6]'
          }`}>2</span>
          <span>Impact & Scope</span>
        </div>
        <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-[#167e68]' : 'bg-[#e2eaec]'}`} />
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-[#167e68]' : 'text-[#8da0a6]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
            step >= 3 ? 'bg-[#e5f4f0] text-[#167e68]' : 'bg-[#f1f5f7] text-[#8da0a6]'
          }`}>3</span>
          <span>Evidence & Review</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Form Cards */}
      <div className="bg-white border border-[#dfe7e9] rounded-2xl p-6 sm:p-8 shadow-xs">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                Incident Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Received suspicious payroll verification email with abnormal domain"
                className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                  Category / Incident Type *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
                >
                  <option>Phishing</option>
                  <option>Malware / Ransomware</option>
                  <option>Unauthorized Access</option>
                  <option>Account Compromise</option>
                  <option>Data Exposure / Leak</option>
                  <option>Lost or Stolen Device</option>
                  <option>DDoS / Service Disruption</option>
                  <option>Social Engineering</option>
                  <option>Other Suspicious Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                  Perceived Severity *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
                >
                  <option value="LOW">Low (Minimal disruption, single user)</option>
                  <option value="MEDIUM">Medium (Suspicious activity, moderate risk)</option>
                  <option value="HIGH">High (Active breach attempt, credentials compromised)</option>
                  <option value="CRITICAL">Critical (Ransomware, massive outage, data leak)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what you observed: When did it happen? Did you click any links or enter credentials? What systems or devices were involved?"
                className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-5 py-2.5 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue to Step 2</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                  Affected System or Application
                </label>
                <input
                  type="text"
                  value={affectedSystem}
                  onChange={(e) => setAffectedSystem(e.target.value)}
                  placeholder="e.g. Microsoft 365, Workday, Laptop Dell-042"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                  Estimated People Affected
                </label>
                <input
                  type="number"
                  min={1}
                  value={affectedUsers}
                  onChange={(e) => setAffectedUsers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                  Location (Office / Remote)
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. New York Office / Remote"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#324b54] mb-1.5">
                Known Business or Data Impact
              </label>
              <textarea
                rows={3}
                value={impactSummary}
                onChange={(e) => setImpactSummary(e.target.value)}
                placeholder="Can you still perform your duties? Has any customer or financial data been altered or downloaded?"
                className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-[#d6e0e3] hover:bg-[#f2f6f7] text-[#435d66] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="px-5 py-2.5 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue to Step 3</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Review Summary */}
            <div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e1e9eb] space-y-2 text-xs">
              <div className="font-bold text-[#14323b] text-sm">{title}</div>
              <div className="text-[#647c84] flex flex-wrap gap-x-4 gap-y-1">
                <span>Category: <strong>{category}</strong></span>
                <span>Severity: <strong>{severity}</strong></span>
                <span>Reporter: <strong>{currentUser?.full_name} ({currentUser?.organization_name})</strong></span>
              </div>
              <p className="text-[#4e6770] pt-1 border-t border-[#e8eff1] line-clamp-2">
                {description}
              </p>
            </div>

            {/* Evidence Attachment Section */}
            <div className="p-4 rounded-xl border border-dashed border-[#b8d5cc] bg-[#f2faf7]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#167e68] mb-2">
                <FileUp size={16} />
                <span>Optional: Attach Evidence or Screenshot Metadata</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#37525a] mb-1">
                    Filename / Evidence Label
                  </label>
                  <input
                    type="text"
                    value={evidenceName}
                    onChange={(e) => setEvidenceName(e.target.value)}
                    placeholder="e.g. Screenshot_Phishing_Email.png"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#cbe0d9] rounded-lg outline-none focus:border-[#167e68]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#37525a] mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#cbe0d9] rounded-lg outline-none focus:border-[#167e68]"
                  >
                    <option>Email Header / File</option>
                    <option>Screenshot</option>
                    <option>Log Export</option>
                    <option>Network Capture</option>
                    <option>Other Evidence</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-[#d6e0e3] hover:bg-[#f2f6f7] text-[#435d66] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? 'Submitting to SOC...' : 'Submit Incident to SOC Team'}
                <CheckCircle2 size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
