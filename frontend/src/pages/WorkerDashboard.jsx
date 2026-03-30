import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  User, BookOpen, MessageSquare, Briefcase, LogOut, Send,
  ShieldCheck, Star, MapPin, Phone, ChevronRight, Loader2,
  CheckCircle, XCircle, Clock, UploadCloud, X, Wallet, TrendingUp,
  Zap, Wrench
} from 'lucide-react';
import WorkerProfileComplete from './WorkerProfileComplete';
import { API_URL } from '../config';

const token = () => localStorage.getItem('token');
const authH = () => ({ Authorization: `Token ${token()}` });

const NAV = [
  { id: 'overview',  label: 'Overview',      icon: TrendingUp },
  { id: 'profile',   label: 'My Profile',    icon: User },
  { id: 'courses',   label: 'Training',       icon: BookOpen },
  { id: 'messages',  label: 'Messages',       icon: MessageSquare },
  { id: 'hire',      label: 'Hire Requests',  icon: Briefcase },
];

// ─── Stat Card Component ───────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

// ─── Messages Tab ──────────────────────────────────────────────────────────
function MessagesTab({ workerId }) {
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const pollRef  = useRef(null);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/`, { headers: authH() });
      const all = res.data;
      const map = {};
      all.forEach(m => {
        const eid = m.enterprise;
        if (!map[eid]) map[eid] = { enterpriseId: eid, name: m.sender_role === 'ENTERPRISE' ? m.sender_name : '—', msgs: [] };
        map[eid].msgs.push(m);
        if (m.sender_role === 'ENTERPRISE') map[eid].name = m.sender_name;
      });
      const list = Object.values(map);
      setThreads(list);
      if (selected) {
        const updated = list.find(t => t.enterpriseId === selected.enterpriseId);
        if (updated) setMsgs(updated.msgs);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAll();
    pollRef.current = setInterval(fetchAll, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    if (selected) {
      const t = threads.find(t => t.enterpriseId === selected.enterpriseId);
      if (t) setMsgs(t.msgs);
    }
  }, [threads, selected]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const openThread = async (thread) => { 
    setSelected(thread); 
    setMsgs(thread.msgs);
    try {
      await axios.post(`${API_URL}/api/messages/mark_read/`, {
        enterprise_id: thread.enterpriseId
      }, { headers: authH() });
      fetchAll();
    } catch (e) { console.error(e); }
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      await axios.post(`${API_URL}/api/messages/`, {
        enterprise: selected.enterpriseId,
        worker: workerId,
        body: text.trim(),
      }, { headers: authH() });
      setText('');
      fetchAll();
    } catch (err) { alert('Send failed'); }
    finally { setSending(false); }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <div className="w-80 shrink-0 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-24 text-[#2e8b57]"><Loader2 className="animate-spin" /></div>
          ) : threads.length === 0 ? (
            <div className="text-center p-8 text-gray-400">No messages yet.</div>
          ) : threads.map(t => (
            <button key={t.enterpriseId} onClick={() => openThread(t)}
              className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-all border-b border-gray-50
                ${selected?.enterpriseId === t.enterpriseId ? 'bg-green-50 border-r-4 border-r-[#2e8b57]' : 'hover:bg-gray-50'}`}>
              <div className="w-12 h-12 rounded-2xl bg-[#2e8b57] flex items-center justify-center text-white font-bold">
                {t.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{t.name}</div>
                <div className="text-xs text-gray-500 mt-1">{t.msgs.length} messages</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-[#2e8b57] flex items-center justify-center font-bold">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-gray-900">{selected.name}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {msgs.map(m => {
                const isMine = m.sender_role === 'WORKER';
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                      isMine ? 'bg-[#2e8b57] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      {m.body}
                      <div className={`text-[10px] mt-1 ${isMine ? 'text-green-100' : 'text-gray-400'}`}>
                        {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMsg} className="p-4 bg-white border-t border-gray-100 flex gap-3">
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..."
                className="flex-1 px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2e8b57]/20 focus:border-[#2e8b57]" />
              <button type="submit" disabled={sending || !text.trim()}
                className="bg-[#2e8b57] text-white p-3 rounded-2xl hover:bg-[#267347] transition-all disabled:opacity-50">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <MessageSquare size={48} className="mb-4" />
            <p className="font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Hire Requests Tab ─────────────────────────────────────────────────────
function HireRequestsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/job-applications/${appId}/`, { status: newStatus }, { headers: authH() });
      const res = await axios.get(`${API_URL}/api/job-applications/`, { headers: authH() });
      setApplications(res.data);
    } catch (e) { alert('Failed to update status'); }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/job-applications/`, { headers: authH() });
        setApplications(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-gray-900">Hire Requests</h2>
      {loading ? ( <div className="text-[#2e8b57] text-center py-10"><Loader2 className="animate-spin mx-auto" /></div> ) :
      applications.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400">
          <Briefcase size={40} className="mx-auto mb-4 text-gray-200" />
          <p>No active hire requests available.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900">{app.job_detail?.title}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  app.status === 'APPLIED' ? 'bg-orange-50 text-orange-600' :
                  app.status === 'ACCEPTED' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                }`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{app.job_detail?.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5"><MapPin size={14} /> {app.job_detail?.location}</div>
                <div className="flex items-center gap-1.5"><Clock size={14} /> {new Date(app.applied_at).toLocaleDateString()}</div>
              </div>
              {app.status === 'APPLIED' && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="py-3 rounded-2xl border border-gray-100 font-bold text-gray-600 text-sm hover:bg-gray-50">Decline</button>
                  <button onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="py-3 rounded-2xl bg-[#2e8b57] text-white font-bold text-sm hover:bg-[#267347]">Accept Hire</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Profile Tab ───────────────────────────────────────────────────────────
function ProfileTab({ profile }) {
  if (!profile) return null;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-gray-900">Personal Profile</h2>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 rounded-3xl bg-green-50 flex items-center justify-center text-[#2e8b57] text-3xl font-black">
          {profile.user?.first_name?.charAt(0) || 'W'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black text-gray-900">{profile.user?.first_name} {profile.user?.last_name}</h3>
            {profile.is_verified && <ShieldCheck className="text-[#2e8b57]" size={20} />}
          </div>
          <p className="text-gray-500 mb-6 flex items-center gap-2 font-medium"><MapPin size={16} /> {profile.location || 'Location not set'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Primary Skill', value: profile.skills || 'General Labour' },
              { label: 'Experience', value: `${profile.experience_years || 0} Years` },
              { label: 'Rating', value: `⭐ ${profile.rating || 0}` },
              { label: 'Wage Expectation', value: `₹${profile.expected_wage || 0}` },
            ].map(i => (
              <div key={i.label} className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{i.label}</p>
                <p className="text-sm font-bold text-gray-900">{i.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────
function OverviewTab({ profile, unread, appsCount }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Good Morning, {profile?.user?.first_name}!</h1>
        <p className="text-gray-500 mt-2 font-medium">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Jobs Completed" value={profile?.jobs_completed || 0} icon={CheckCircle} color="bg-blue-50 text-blue-600" />
        <StatCard label="Total Earnings" value={`₹${(profile?.jobs_completed || 0) * (profile?.expected_wage || 0)}`} icon={Wallet} color="bg-green-50 text-green-600" />
        <StatCard label="Overall Rating" value={profile?.rating || '0.0'} icon={Star} color="bg-yellow-50 text-yellow-600" />
        <StatCard label="Hire Requests" value={appsCount || 0} icon={Briefcase} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">My Skills & Level</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#2e8b57]"><Zap size={20} /></div>
                <div>
                  <p className="font-bold text-gray-900">{profile?.skills || 'No skills added'}</p>
                  <p className="text-xs text-gray-400">Current expertise level</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase">{profile?.level}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#2e8b57] h-full" style={{ width: profile?.level === 'EXPERT' ? '100%' : profile?.level === 'SKILLED' ? '70%' : '30%' }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-4 rounded-2xl bg-[#2e8b57] text-white font-bold flex items-center justify-between hover:bg-[#267347] transition-all">
              <span>Find New Jobs</span>
              <ChevronRight size={18} />
            </button>
            <button className="w-full p-4 rounded-2xl bg-white border border-gray-100 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-50 transition-all">
              <span>Update Profile</span>
              <ChevronRight size={18} />
            </button>
            <button className="w-full p-4 rounded-2xl bg-white border border-gray-100 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-50 transition-all">
              <span>View Wallet</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function WorkerDashboard() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [unread, setUnread] = useState(0);
  const [appsCount, setAppsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/workers/`, { headers: authH() });
      if (res.data.length > 0) setProfile(res.data[0]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const [mr, ar] = await Promise.all([
        axios.get(`${API_URL}/api/messages/`, { headers: authH() }),
        axios.get(`${API_URL}/api/job-applications/`, { headers: authH() })
      ]);
      setUnread(mr.data.filter(m => !m.is_read && m.sender_role === 'ENTERPRISE').length);
      setAppsCount(ar.data.filter(a => a.status === 'APPLIED').length);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
    const t = setInterval(fetchStats, 10000);
    return () => clearInterval(t);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-[#2e8b57]" />
    </div>
  );

  if (profile && !profile.id_proof) {
    return <WorkerProfileComplete profile={profile} onComplete={p => setProfile(p)} />;
  }

  const TABS = {
    overview: <OverviewTab profile={profile} unread={unread} appsCount={appsCount} />,
    profile:  <ProfileTab profile={profile} />,
    courses:  <TrainingTab />, // Renamed subcomponent below
    messages: <MessagesTab workerId={profile?.id} />,
    hire:     <HireRequestsTab />,
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-['Inter']">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-[#1a4d32] flex flex-col fixed h-screen z-40 transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#2e8b57] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/40">
              <Wrench className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tight">SkillConnect</span>
          </div>

          <div className="mb-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/10 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black border border-white/10">
              {profile?.user?.first_name?.charAt(0) || 'W'}
            </div>
            <h3 className="text-white font-bold text-lg">{profile?.user?.first_name} {profile?.user?.last_name}</h3>
            <p className="text-green-300/60 text-xs font-bold uppercase tracking-widest mt-1">Verified {profile?.level}</p>
          </div>

          <nav className="space-y-2">
            {NAV.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const badge = (item.id === 'messages' && unread > 0) || (item.id === 'hire' && appsCount > 0);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all relative ${
                    active ? 'bg-[#2e8b57] text-white shadow-lg' : 'text-green-100/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {badge && (
                    <span className="ml-auto w-5 h-5 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center shadow-sm">
                      {item.id === 'messages' ? unread : appsCount}
                    </span>
                  )}
                  {active && <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/10">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-4 px-4 py-3 text-green-100/60 font-bold hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {TABS[activeTab]}
        </div>
      </main>
    </div>
  );
}

// ─── Training Tab (Redesigned) ─────────────────────────────────────────────
function TrainingTab() {
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const h = { headers: authH() };
        const [cr, tr] = await Promise.all([
          axios.get(`${API_URL}/api/courses/`, h),
          axios.get(`${API_URL}/api/verification-tasks/`, h),
        ]);
        setCourses(cr.data);
        setTasks(tr.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const handleUpload = async () => {
    if (!selectedTask || !file) { setUploadStatus('Select task and file'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('task', selectedTask);
    fd.append('submitted_file', file);
    try {
      await axios.post(`${API_URL}/api/verifications/`, fd, { headers: { ...authH(), 'Content-Type': 'multipart/form-data' } });
      setUploadStatus('✅ Verification submitted!');
      setFile(null); setSelectedTask('');
    } catch { setUploadStatus('❌ Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-black text-gray-900">Training & Skills</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="text-[#2e8b57]" size={20} /> Latest Courses</h3>
          <div className="space-y-4">
            {courses.length === 0 ? <p className="text-gray-400">No courses available.</p> :
            courses.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-green-200 transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-[#2e8b57] group-hover:bg-[#2e8b57] group-hover:text-white transition-colors"><Zap size={24} /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{c.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">{c.category_name}</p>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-8"><ShieldCheck className="text-[#2e8b57]" size={20} /> Submit Verification</h3>
          <div className="space-y-5 flex-1">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center cursor-pointer border-dashed border-2 hover:bg-green-50 hover:border-green-200 transition-all relative overflow-hidden">
              <UploadCloud size={32} className="mb-2 text-[#2e8b57]" />
              <p className="text-sm font-bold text-gray-600">Select Document or Video</p>
              <p className="text-xs text-gray-400 mt-1">Proof of training completion</p>
              <input type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              {file && <p className="mt-4 text-xs font-bold text-[#2e8b57] bg-white px-3 py-1 rounded-full shadow-sm">{file.name}</p>}
            </div>

            <select value={selectedTask} onChange={e => setSelectedTask(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2e8b57]/20">
              <option value="">Select Verification Task</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.method}: {t.prompt_text}</option>)}
            </select>

            <button onClick={handleUpload} disabled={uploading || !file || !selectedTask}
              className="w-full py-4 rounded-2xl bg-[#2e8b57] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-[#267347] transition-all disabled:opacity-30">
              {uploading ? 'Processing...' : 'Submit Verification'}
            </button>
            {uploadStatus && <p className="text-center text-xs font-bold text-[#2e8b57]">{uploadStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
