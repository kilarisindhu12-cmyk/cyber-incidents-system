import React, { useState, useMemo } from 'react';
import { Radio, Search, Filter, ShieldCheck, AlertTriangle, Fingerprint, Database, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { Ioc } from '@/types';

export const SecurityThreatIntel: React.FC = () => {
  const { currentUser } = useAuth();
  const iocs = dataService.getIocs();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const categories = ['ALL', 'IP', 'Domain', 'URL', 'Hash', 'Email', 'Account'];

  const filtered = useMemo(() => {
    return iocs.filter((ioc) => {
      if (activeCategory !== 'ALL' && ioc.type !== activeCategory) return false;
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
  }, [iocs, activeCategory, search]);

  return (
    <div className="space-y-6 font-mono">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00f2fe] text-[#070d1e] font-bold text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#14234b] pb-4">
        <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
          DEFENSIVE THREAT TELEMETRY & ATTRIBUTION
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          THREAT INTELLIGENCE REPOSITORY
        </h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Curated defensive indicators, C2 infrastructure tracking, and campaign correlation.
        </p>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091226] border border-[#14234b] p-4 rounded-xl shadow-xl">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00f2fe] text-[#070d1e]'
                  : 'bg-[#0c1836] text-[#8ba3bf] hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'ALL INDICATORS' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#475569]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search indicator, source, campaign..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white placeholder-[#475569] outline-none focus:border-[#00f2fe]"
          />
        </div>
      </div>

      {/* Threat Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                {item.type}
              </span>
              <span className={`text-[10px] font-bold ${
                item.threatLevel === 'Critical' ? 'text-[#ef4444]' : item.threatLevel === 'High' ? 'text-[#f97316]' : 'text-[#eab308]'
              }`}>
                {item.threatLevel.toUpperCase()} THREAT
              </span>
            </div>

            <div>
              <div className="text-white font-bold text-sm break-all">{item.value}</div>
              <div className="text-[11px] text-[#64748b] mt-1">Source: {item.source}</div>
            </div>

            <div className="pt-2 border-t border-[#122046] flex items-center justify-between text-[10px] text-[#475569]">
              <span>Confidence: <strong>{item.confidence}%</strong></span>
              <span>Status: <strong className="text-[#10b981]">{item.status}</strong></span>
            </div>

            {item.relatedIncidentNumber && (
              <div className="text-[10px] text-[#00f2fe] pt-1">
                Linked Case: {item.relatedIncidentNumber}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
