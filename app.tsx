
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MachineEntry } from './components/MachineEntry';
import { Role } from './types';
import { MACHINES, TELUGU_LABELS } from './constants';
import { db } from './services/db';

type Tab = 'dashboard' | 'm1' | 'm2' | 'm3';

const App: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    if (role === Role.STAFF) setActiveTab('m1');
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, [role]);

  const handleSync = async () => {
    if (syncing || !isOnline) return;
    setSyncing(true);
    await db.syncRecords();
    setSyncing(false);
  };

  if (!role) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-indigo-700 flex flex-col justify-center items-center p-10 text-center text-white">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-10 mx-auto">
          <span className="text-4xl">🥚</span>
        </div>
        <h1 className="text-3xl font-black mb-10 leading-tight">{TELUGU_LABELS.title}</h1>
        <div className="w-full space-y-4">
          <button onClick={() => setRole(Role.ADMIN)} className="w-full bg-slate-900 py-5 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all">📊 {TELUGU_LABELS.admin}</button>
          <button onClick={() => setRole(Role.STAFF)} className="w-full bg-white text-indigo-700 py-5 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all">⚙️ {TELUGU_LABELS.staff}</button>
        </div>
      </div>
    );
  }

  const NavButton = ({ tab, label, icon }: { tab: Tab, label: string, icon: string }) => (
    <button onClick={() => setActiveTab(tab)} className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${activeTab === tab ? 'text-indigo-700 scale-110' : 'text-slate-400'}`}>
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );

  return (
    <Layout 
      onLogout={() => setRole(null)} 
      isOnline={isOnline} 
      title={activeTab === 'dashboard' ? TELUGU_LABELS.dashboard : `మెషిన్ ${activeTab.replace('m', '')} ఎంట్రీ`}
      bottomNav={
        <>
          {role === Role.ADMIN && <NavButton tab="dashboard" label="డాష్‌బోర్డ్" icon="📊" />}
          <NavButton tab="m1" label="మెషిన్ 1" icon="⚙️" />
          <NavButton tab="m2" label="మెషిన్ 2" icon="⚙️" />
          <NavButton tab="m3" label="మెషిన్ 3" icon="⚡" />
        </>
      }
    >
      {activeTab === 'dashboard' ? <Dashboard /> : (
        <MachineEntry 
          machineId={parseInt(activeTab.replace('m', ''))} 
          machineType={activeTab === 'm3' ? '20lb' : '16lb'} 
          machineName={MACHINES.find(m => m.id === parseInt(activeTab.replace('m', '')))?.name || ''} 
          onSuccess={() => { if (role === Role.ADMIN) setActiveTab('dashboard'); }} 
        />
      )}

      {db.getUnsyncedCount() > 0 && isOnline && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2">
           <button onClick={handleSync} className="bg-amber-500 text-white px-6 py-3 rounded-full text-[10px] font-black shadow-2xl animate-bounce">
            🔄 Sync {db.getUnsyncedCount()} Logs
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
