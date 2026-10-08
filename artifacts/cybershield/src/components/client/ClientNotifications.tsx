import React from 'react';
import { Link } from 'wouter';
import { Bell, Check, ArrowRight, ShieldAlert, Clock, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const ClientNotifications: React.FC = () => {
  const { currentUser } = useAuth();
  const notifications = dataService.getNotifications(currentUser);

  const handleMarkAllRead = () => {
    notifications.forEach((n) => dataService.markNotificationRead(n.id));
    // Trigger re-render
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#152e36] tracking-tight">Organization Notifications</h1>
          <p className="text-xs text-[#6e838b] mt-1">
            Real-time security updates, analyst notes, and investigation status changes.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[#167e68] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check size={14} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-[#dfe7e9] rounded-2xl shadow-xs overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71878f]">
            No notifications at this time. All systems running normally.
          </div>
        ) : (
          <div className="divide-y divide-[#edf2f3]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 sm:px-6 transition-colors flex items-start justify-between gap-4 ${
                  n.read ? 'bg-white' : 'bg-[#f4faf8]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'critical'
                      ? 'bg-[#fee2e2] text-[#dc2626]'
                      : n.type === 'sla'
                      ? 'bg-[#fef3c7] text-[#d97706]'
                      : 'bg-[#e6f4f0] text-[#167e68]'
                  }`}>
                    {n.type === 'critical' ? <ShieldAlert size={16} /> : <Bell size={16} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-[#17333c]">{n.title}</strong>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#167e68]"></span>
                      )}
                    </div>
                    <p className="text-xs text-[#526b74] leading-relaxed">{n.message}</p>
                    <div className="text-[10px] font-mono text-[#8a9ca2]">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    onClick={() => dataService.markNotificationRead(n.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#14705c] bg-[#eef7f4] hover:bg-[#e2f2ed] rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
