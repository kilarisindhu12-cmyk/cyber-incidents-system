import React, { useState, useMemo } from 'react';
import { Fingerprint, Search, Filter, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { Ioc, IocType, ThreatLevel } from '@/types';

export const SecurityIOCs: React.FC = () => {
  const { currentUser } = useAuth();
  const iocs = dataService.getIocs();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [threatFilter, setThreatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add IOC Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newVal, setNewVal] = useState('');
  const [newType, setNewType] = useState<IocType>('IP');
  const [newSource, setNewSource] = useState('Analyst Investigation');
  const [newThreat, setNewThreat] = useState<ThreatLevel>('High');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = useMemo(() => {
    return iocs.filter((ioc) => {
      if (typeFilter && ioc.type !== typeFilter) return false;
      if (threatFilter && ioc.threatLevel !== threatFilter) return false;
      if (statusFilter && ioc.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          ioc.value.toLowerCase().includes(q) ||
          ioc.source.toLowerCase().includes(q) ||
          (ioc.relatedIncidentNumber && ioc.relatedIncidentNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [iocs, typeFilter, threatFilter, statusFilter, search]);

  const handleAddIoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVal.trim() || !currentUser) return;

    dataService.addIoc(
      {
        type: newType,
        value: newVal.trim(),
        source: newSource,
        threatLevel: newThreat,
        confidence: 90,
        status: 'Active',
      },
      currentUser
    );

    setNewVal('');
    setModalOpen(false);
    showToast('Indicator of Compromise recorded.');
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00f2fe] text-[#070d1e] font-bold text-xs px-4 py-2.5 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#14234b] pb-4">
        <div>
          <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
            DEFENSIVE ARTIFACT REGISTRY
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            IOC MANAGEMENT CONSOLE
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Defensive indicators of compromise across customer environments and external feeds.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#00f2fe] hover:bg-[#38bdf8] text-[#070d1e] font-bold text-xs rounded-lg shadow-lg shadow-[#00f2fe]/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New IOC</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-[#091226] border border-[#14234b] p-4 rounded-xl shadow-xl flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#475569]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search indicator, source, incident..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white placeholder-[#475569] outline-none focus:border-[#00f2fe]"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none"
        >
          <option value="">All Types (IP, Domain, URL, Hash, Email, File, Account)</option>
          <option value="IP">IP</option>
          <option value="Domain">Domain</option>
          <option value="URL">URL</option>
          <option value="Hash">Hash</option>
          <option value="Email">Email</option>
          <option value="File">File</option>
          <option value="Account">Account</option>
        </select>

        <select
          value={threatFilter}
          onChange={(e) => setThreatFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none"
        >
          <option value="">All Threat Levels</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Benign">Benign</option>
        </select>
      </div>

      {/* Table (SECTION 19 SPECIFICATION COLUMNS) */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
              <tr>
                <th className="py-3 px-4">IOC</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">SOURCE</th>
                <th className="py-3 px-4">RELATED INCIDENT</th>
                <th className="py-3 px-4">THREAT LEVEL</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">FIRST SEEN</th>
                <th className="py-3 px-4">LAST SEEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#101e40]">
              {filtered.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-[#0d1a3b] transition-colors">
                  <td className="py-3 px-4 font-bold text-white break-all max-w-xs">{ioc.value}</td>
                  <td className="py-3 px-4 text-[#38bdf8] font-bold">{ioc.type}</td>
                  <td className="py-3 px-4 text-[#64748b]">{ioc.source}</td>
                  <td className="py-3 px-4 text-[#00f2fe] font-bold">
                    {ioc.relatedIncidentNumber || 'Global Feed'}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <span className={ioc.threatLevel === 'Critical' ? 'text-[#ef4444]' : ioc.threatLevel === 'High' ? 'text-[#f97316]' : 'text-[#eab308]'}>
                      {ioc.threatLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                      {ioc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748b] text-[11px]">
                    {new Date(ioc.firstSeen).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-[#64748b] text-[11px]">
                    {new Date(ioc.lastSeen).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040814]/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#091226] border border-[#1b3470] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add New Indicator of Compromise</h3>

            <form onSubmit={handleAddIoc} className="space-y-3">
              <div>
                <label className="block text-xs text-[#64748b] mb-1">Indicator Value *</label>
                <input
                  type="text"
                  required
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  placeholder="IP, domain, hash, or suspicious account..."
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#64748b] mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none"
                  >
                    <option>IP</option>
                    <option>Domain</option>
                    <option>URL</option>
                    <option>Hash</option>
                    <option>Email</option>
                    <option>File</option>
                    <option>Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#64748b] mb-1">Threat Level</label>
                  <select
                    value={newThreat}
                    onChange={(e) => setNewThreat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#64748b] mb-1">Source / Attribution</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. AlienVault OTX, Internal Sensor, Mandiant Feed"
                  className="w-full px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white outline-none focus:border-[#00f2fe]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#1b3470] text-[#94a3b8] hover:bg-[#0c1836] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00f2fe] text-[#070d1e] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Register IOC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
