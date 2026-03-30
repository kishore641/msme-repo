import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, ShieldCheck, Video, BookOpen, Building2,
  LogOut, Users, Clock, CheckCircle, XCircle, Star, TrendingUp,
  Plus, Trash2, Edit3, ChevronRight, X, AlertTriangle, RefreshCw,
  Search, Filter, ExternalLink, Calendar, MapPin, Award
} from 'lucide-react';
import { API_URL } from '../config';

// ─── helpers ────────────────────────────────────────────────────────────────
const token = () => localStorage.getItem('token');
const authHeaders = () => ({ Authorization: `Token ${token()}` });

const STATUS_PILL = {
  PENDING:  'bg-amber-100 text-amber-800 border border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  REJECTED: 'bg-red-100 text-red-800 border border-red-200',
  RESUBMIT: 'bg-blue-100 text-blue-800 border border-blue-200',
};
const METHOD_ICON = { VIDEO: '🎬', IMAGE: '🖼️', AUDIO: '🎙️', QUIZ: '📝' };

// ─── Sidebar nav items ───────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',      label: 'Overview',            icon: LayoutDashboard },
  { id: 'profiles',      label: 'Profile Verification', icon: ShieldCheck },
  { id: 'submissions',   label: 'Task Submissions',     icon: Video },
  { id: 'courses',       label: 'Course Management',    icon: BookOpen },
  { id: 'enterprises',   label: 'Enterprises',          icon: Building2 },
];

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — Overview
// ════════════════════════════════════════════════════════════════════════════
function OverviewTab({ setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const h = { headers: authHeaders() };
        const [workers, enterprises, verifications, courses] = await Promise.all([
          axios.get(`${API_URL}/api/workers/`, h),
          axios.get(`${API_URL}/api/enterprises/`, h),
          axios.get(`${API_URL}/api/verifications/`, h),
          axios.get(`${API_URL}/api/courses/`, h),
        ]);
        const ws = workers.data;
        const vs = verifications.data;
        setStats({
          totalWorkers:    ws.length,
          verifiedWorkers: ws.filter(w => w.is_verified).length,
          pendingProfiles: ws.filter(w => w.verification_status === 'PENDING').length,
          totalEnterprises: enterprises.data.length,
          totalSubmissions: vs.length,
          pendingSubmissions: vs.filter(v => v.status === 'PENDING').length,
          approvedSubmissions: vs.filter(v => v.status === 'APPROVED').length,
          totalCourses: courses.data.length,
          avgRating: ws.length
            ? (ws.reduce((s, w) => s + (w.rating || 0), 0) / ws.length).toFixed(1)
            : '—',
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const cards = stats ? [
    { label: 'Total Workers',      value: stats.totalWorkers,       icon: Users,        color: 'from-green-500 to-green-600', bg: 'from-green-50 to-emerald-50' },
    { label: 'Verified Workers',   value: stats.verifiedWorkers,    icon: CheckCircle,  color: 'from-emerald-500 to-teal-600',  bg: 'from-emerald-50 to-teal-50' },
    { label: 'Pending Profiles',   value: stats.pendingProfiles,    icon: Clock,        color: 'from-amber-500 to-orange-500',  bg: 'from-amber-50 to-orange-50' },
    { label: 'Enterprises',        value: stats.totalEnterprises,   icon: Building2,    color: 'from-blue-500 to-indigo-600',   bg: 'from-blue-50 to-indigo-50' },
    { label: 'Task Submissions',   value: stats.totalSubmissions,   icon: Video,        color: 'from-pink-500 to-rose-600',     bg: 'from-pink-50 to-rose-50' },
    { label: 'Pending Reviews',    value: stats.pendingSubmissions, icon: AlertTriangle, color: 'from-red-500 to-rose-600',     bg: 'from-red-50 to-rose-50' },
    { label: 'Courses Available',  value: stats.totalCourses,       icon: BookOpen,     color: 'from-cyan-500 to-blue-600',     bg: 'from-cyan-50 to-blue-50' },
    { label: 'Avg. Worker Rating', value: stats.avgRating,          icon: Star,         color: 'from-yellow-400 to-amber-500',  bg: 'from-yellow-50 to-amber-50' },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#1a4d32]">Dashboard Overview</h2>
          <p className="text-gray-500 font-medium mt-1">Real-time snapshot of your SkillConnect platform.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <Calendar className="w-4 h-4 text-green-600" />
          <span className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-[2rem] bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ label, value, icon: TabIcon, color, bg }) => (
            <div key={label} className={`bg-gradient-to-br ${bg} border border-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
                {React.createElement(TabIcon, { className: "w-6 h-6 text-white" })}
              </div>
              <div className="text-3xl font-black text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — Profile Verification
// ════════════════════════════════════════════════════════════════════════════
function ProfileVerificationTab() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/workers/?status=${filter}`, { headers: authHeaders() });
      setProfiles(res.data);
    } catch (e) { console.error(e); }
  }, [filter]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const handleAction = async (newStatus) => {
    if (!selected) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('status', newStatus);
      fd.append('note', note);
      await axios.post(`${API_URL}/api/workers/${selected.id}/verify_profile/`, fd, { headers: authHeaders() });
      setProfiles(p => p.filter(x => x.id !== selected.id));
      setSelected(null); setNote('');
    } catch (e) { alert(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left */}
      <div className="w-full lg:w-1/3 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Queue</h2>
          <button onClick={fetchProfiles} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {['PENDING','APPROVED','REJECTED','RESUBMIT'].map(s => (
            <button key={s} onClick={() => { setFilter(s); setSelected(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === s ? 'bg-[#2e8b57] text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {profiles.length === 0
            ? <div className="text-center py-20">
                <div className="text-4xl mb-4">✨</div>
                <p className="text-gray-400 font-bold">Queue cleared!</p>
              </div>
            : profiles.map(p => (
              <div key={p.id} onClick={() => { setSelected(p); setNote(''); }}
                className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${selected?.id === p.id ? 'border-[#2e8b57] bg-green-50/50 shadow-md' : 'border-gray-50 hover:border-green-100 bg-gray-50/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-gray-900">{p.user.first_name} {p.user.last_name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${STATUS_PILL[p.verification_status]}`}>{p.verification_status}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                  <MapPin size={12} className="text-green-500" /> {p.location || 'No Loc'}
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <Award size={12} className="text-amber-500" /> {p.experience_years}yr exp
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 overflow-y-auto custom-scrollbar">
        {selected ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-[#1a4d32] text-2xl font-black">
                  {selected.user.first_name[0]}{selected.user.last_name[0]}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">{selected.user.first_name} {selected.user.last_name}</h2>
                  <p className="text-[#2e8b57] font-bold flex items-center gap-2 mt-1">
                    <Clock size={16} /> Member since {new Date().getFullYear()}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-black ${STATUS_PILL[selected.verification_status]}`}>{selected.verification_status}</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ['Location', selected.location, MapPin, 'text-red-500'],
                ['Skills', selected.skills, Award, 'text-amber-500'],
                ['Experience', `${selected.experience_years} years`, Clock, 'text-blue-500'],
                ['Wage Req.', `₹${selected.expected_wage}/day`, TrendingUp, 'text-green-500']
              ].map(([l,v, Icon, iconColor]) => (
                <div key={l} className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-green-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                    <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">{l}</span>
                  </div>
                  <div className="text-base font-black text-gray-800">{v || 'N/A'}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
              <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Submitted Documents
              </h3>
              <div className="grid gap-4">
                {[
                  ['Official ID Proof', selected.id_proof, 'shield'],
                  ['Trade Certificates', selected.certificates, 'award'],
                  ['Work Portfolio', selected.work_photos, 'image']
                ].map(([l,u, icon]) => (
                  <div key={l} className="flex items-center justify-between bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm group hover:border-[#2e8b57] transition-all">
                    <div className="flex items-center gap-4">
                       <span className="text-2xl">{icon === 'shield' ? '🛡️' : icon === 'award' ? '📜' : '📸'}</span>
                       <span className="text-sm font-bold text-gray-700">{l}</span>
                    </div>
                    {u ? <a href={u.startsWith('http') ? u : `${API_URL}${u}`} target="_blank" rel="noreferrer"
                        className="bg-green-50 text-[#2e8b57] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#2e8b57] hover:text-white transition-all">
                        View Document <ExternalLink size={12} /></a>
                      : <span className="text-gray-300 text-xs italic font-bold">Unsubmitted</span>}
                  </div>
                ))}
              </div>
            </div>

            {(filter === 'PENDING' || filter === 'RESUBMIT') && (
              <div className="bg-[#1a4d32] p-8 rounded-[2.5rem] shadow-xl shadow-green-900/20">
                <h3 className="font-black text-white text-lg mb-4">Review Decision</h3>
                <textarea className="w-full p-4 rounded-2xl bg-white/10 border-white/20 text-white placeholder-white/40 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[100px]"
                  placeholder="Notes for the worker (why approve or reject?)..." value={note} onChange={e => setNote(e.target.value)} />
                <div className="flex gap-4">
                  <button onClick={() => handleAction('APPROVED')} disabled={loading} className="flex-1 py-4 rounded-2xl bg-[#2e8b57] hover:bg-green-500 text-white text-base font-black disabled:opacity-50 transition-all shadow-lg shadow-green-900/40 flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Approve Profile
                  </button>
                  <button onClick={() => handleAction('RESUBMIT')} disabled={loading} className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-base font-black disabled:opacity-50 transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2">
                    <RefreshCw size={20} /> Request Edit
                  </button>
                  <button onClick={() => handleAction('REJECTED')} disabled={loading} className="flex-1 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-base font-black disabled:opacity-50 transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2">
                    <XCircle size={20} /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
              <ShieldCheck size={48} className="text-green-200" />
            </div>
            <div>
               <p className="text-xl font-black text-gray-800">Review Required</p>
               <p className="text-gray-400 font-bold max-w-xs mt-2">Select a worker profile from the queue to verify their credentials.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 3 — Task Submissions
// ════════════════════════════════════════════════════════════════════════════
function TaskSubmissionsTab() {
  const [all, setAll] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchSubmissions(); }, []);

  useEffect(() => {
    setSubmissions(filterStatus === 'ALL' ? all : all.filter(s => s.status === filterStatus));
  }, [filterStatus, all]);

  const fetchSubmissions = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${API_URL}/api/verifications/`, { headers: authHeaders() });
      setAll(res.data); setSubmissions(res.data);
    } catch (e) { setError(e.response?.data?.detail || e.message); }
    finally { setLoading(false); }
  };

  const handleReview = async (newStatus) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/api/verifications/${selected.id}/review_submission/`,
        { status: newStatus, admin_notes: notes }, { headers: authHeaders() });
      const updated = { ...selected, status: newStatus, admin_notes: notes };
      setAll(p => p.map(s => s.id === selected.id ? updated : s));
      setSelected(updated);
    } catch (e) { alert(e.response?.data?.error || e.message); }
    finally { setActionLoading(false); }
  };

  const getMediaUrl = p => !p ? null : p.startsWith('http') ? p : p.startsWith('/') ? p : `/${p}`;
  const fileUrl = getMediaUrl(selected?.submitted_file);
  const method = selected?.task_detail?.method || '';
  const isVideo = method === 'VIDEO' || /\.(mp4|webm|mov)$/i.test(fileUrl || '');
  const isAudio = method === 'AUDIO' || /\.(mp3|wav|ogg)$/i.test(fileUrl || '');
  const isImage = method === 'IMAGE' || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl || '');

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left list */}
      <div className="w-full lg:w-1/3 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Task Reviews</h2>
          <button onClick={fetchSubmissions} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL','PENDING','APPROVED','REJECTED'].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setSelected(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterStatus === s ? 'bg-[#2e8b57] text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {loading ? <div className="text-center py-20 font-bold text-gray-400">Loading…</div>
            : error ? <p className="text-red-500 text-sm text-center py-10">{error}</p>
            : submissions.length === 0 ? <p className="text-gray-400 text-sm text-center py-10 font-bold">No submissions in view</p>
            : submissions.map(sub => (
              <div key={sub.id} onClick={() => { setSelected(sub); setNotes(sub.admin_notes || ''); }}
                className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${selected?.id === sub.id ? 'border-[#2e8b57] bg-green-50/50 shadow-md' : 'border-gray-50 hover:border-green-100 bg-gray-50/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-gray-900 text-sm">{sub.worker_name}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${STATUS_PILL[sub.status] || 'bg-gray-100 text-gray-600'}`}>{sub.status}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                    <span className="text-base">{METHOD_ICON[sub.task_detail?.method]}</span>
                    <span className="truncate">{sub.task_detail?.course_name || sub.task_detail?.prompt_text?.slice(0,30)}…</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Right detail */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 overflow-y-auto custom-scrollbar">
        {selected ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-gray-900">{selected.worker_name}</h2>
                <p className="text-[#2e8b57] font-bold mt-1 uppercase tracking-widest text-[11px]">{selected.task_detail?.method} Submission</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-black ${STATUS_PILL[selected.status] || 'bg-gray-100 text-gray-600'}`}>{selected.status}</span>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <div className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-2">Instruction Prompt</div>
              <p className="text-lg font-bold text-gray-800 leading-snug">{selected.task_detail?.prompt_text}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-bold">
                <Calendar size={14} /> Submitted on {new Date(selected.submitted_at).toLocaleString()}
              </div>
            </div>

            {fileUrl && (
              <div className="space-y-3">
                <p className="text-base font-black text-gray-800">Review Media</p>
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-inner bg-black flex items-center justify-center min-h-[300px]">
                    {isVideo && <video controls className="max-w-full max-h-[500px]"><source src={fileUrl} /></video>}
                    {isAudio && <audio controls className="w-3/4"><source src={fileUrl} /></audio>}
                    {isImage && <img src={fileUrl} alt="submission" className="max-w-full max-h-[500px] object-contain" />}
                </div>
                {!isVideo && !isAudio && !isImage && (
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 text-[#2e8b57] font-black rounded-2xl hover:bg-[#2e8b57] hover:text-white transition-all text-sm">
                    Open File in New Tab <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}

            {selected.status === 'PENDING' && (
              <div className="bg-[#1a4d32] p-8 rounded-[2.5rem] shadow-xl shadow-green-900/20">
                <h3 className="font-black text-white text-lg mb-4">Final Verdict</h3>
                <textarea className="w-full p-4 rounded-2xl bg-white/10 border-white/20 text-white placeholder-white/40 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-green-400" rows="3"
                  placeholder="Feedback for the worker..." value={notes} onChange={e => setNotes(e.target.value)} />
                <div className="flex gap-4">
                  <button onClick={() => handleReview('APPROVED')} disabled={actionLoading} className="flex-1 py-4 rounded-2xl bg-[#2e8b57] hover:bg-green-500 text-white font-black transition-all flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Approve Task
                  </button>
                  <button onClick={() => handleReview('REJECTED')} disabled={actionLoading} className="flex-1 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black transition-all flex items-center justify-center gap-2">
                    <XCircle size={20} /> Reject Submission
                  </button>
                </div>
              </div>
            )}
            
            {selected.admin_notes && (
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 text-emerald-800">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Previous Admin Feedback</div>
                <p className="font-bold">{selected.admin_notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
              <Video size={48} className="text-emerald-200" />
            </div>
            <p className="text-xl font-black text-gray-800">Select a Task to Begin Review</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 4 — Course Management
// ════════════════════════════════════════════════════════════════════════════
function CourseManagementTab() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', category: '', video_url: '' });
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('courses'); // 'courses' | 'categories'
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const h = { headers: authHeaders() };
      const [catRes, courseRes] = await Promise.all([
        axios.get(`${API_URL}/api/course-categories/`, h),
        axios.get(`${API_URL}/api/courses/`, h),
      ]);
      setCategories(catRes.data);
      setCourses(courseRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCourse = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await axios.post(`${API_URL}/api/courses/`, form, { headers: authHeaders() });
      setForm({ title: '', description: '', category: '', video_url: '' });
      load();
    } catch (e) { setError(JSON.stringify(e.response?.data || e.message)); }
    finally { setSaving(false); }
  };

  const addCategory = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await axios.post(`${API_URL}/api/course-categories/`, catForm, { headers: authHeaders() });
      setCatForm({ name: '', description: '' });
      load();
    } catch (e) { setError(JSON.stringify(e.response?.data || e.message)); }
    finally { setSaving(false); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}/`, { headers: authHeaders() });
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-[#1a4d32]">Academy</h2>
          <p className="text-gray-500 font-bold mt-1">Design training paths and verification modules.</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem]">
          {['courses', 'categories'].map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`px-6 py-2.5 rounded-[1.2rem] text-sm font-black transition-all capitalize ${activeSection === s ? 'bg-white text-[#2e8b57] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              Manage {s}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 border-2 border-red-100 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3"><AlertTriangle /> {error}</div>}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5">
           {activeSection === 'courses' ? (
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#2e8b57]"><Plus size={20} /></div> New Course</h3>
               <form onSubmit={addCourse} className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Core Category</label>
                   <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                     className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 text-gray-900 font-bold transition-all border-2">
                     <option value="">Choose a path…</option>
                     {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Course Title</label>
                   <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Industrial Safety"
                     className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 text-gray-900 font-bold transition-all border-2" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Learning Goals</label>
                   <textarea required rows="4" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will they learn?"
                     className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 text-gray-900 font-bold transition-all border-2" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Training Video (Link)</label>
                   <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="YouTube or Drive URL"
                     className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 text-gray-900 font-bold transition-all border-2" />
                 </div>
                 <button type="submit" disabled={saving}
                   className="w-full py-5 rounded-2xl bg-[#1a4d32] hover:bg-green-900 text-white font-black text-lg disabled:opacity-50 shadow-xl shadow-green-900/10 transition-all flex items-center justify-center gap-3 mt-4">
                   {saving ? 'Creating…' : 'Publish Course'} <ChevronRight size={20} />
                 </button>
               </form>
             </div>
           ) : (
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Plus size={20} /></div> New Category</h3>
               <form onSubmit={addCategory} className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                   <input required value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Construction"
                     className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 text-gray-900 font-bold transition-all border-2" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                   <textarea required rows="4" value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief sector overview…"
                     className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 text-gray-900 font-bold transition-all border-2" />
                 </div>
                 <button type="submit" disabled={saving}
                   className="w-full py-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg disabled:opacity-50 shadow-xl shadow-emerald-900/10 transition-all">
                   {saving ? 'Saving…' : 'Create Category'}
                 </button>
               </form>
             </div>
           )}
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 space-y-4 pr-1">
          {activeSection === 'courses' ? (
             loading ? <div className="text-center py-20 font-black text-gray-300">Searching library…</div>
             : courses.length === 0 ? <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-20 text-center font-bold text-gray-400">Library is empty.</div>
             : courses.map(c => (
               <div key={c.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm flex items-start justify-between gap-5 hover:border-green-300 transition-all hover:shadow-lg group">
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-3 mb-2">
                     <span className="text-9 text-green-700 font-black truncate">{c.title}</span>
                     <span className="text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-black uppercase tracking-widest shrink-0">{c.category_name}</span>
                   </div>
                   <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{c.description}</p>
                   {c.video_url && <a href={c.video_url} target="_blank" rel="noreferrer" className="text-xs font-black text-green-600 hover:text-green-800 mt-4 inline-flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-xl transition-all">▶ Watch Material</a>}
                 </div>
                 <button onClick={() => deleteCourse(c.id)} className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all flex items-center justify-center shrink-0">
                   <Trash2 className="w-5 h-5" />
                 </button>
               </div>
             ))
          ) : (
            categories.length === 0
              ? <div className="text-center py-20 font-black text-gray-300">No sectors defined yet.</div>
              : categories.map(c => (
                <div key={c.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:border-emerald-300 transition-all hover:shadow-lg group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-gray-900">{c.name}</h4>
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black">
                      {courses.filter(co => co.category === c.id || co.category_name === c.name).length} Modules
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{c.description}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 5 — Enterprise Management
// ════════════════════════════════════════════════════════════════════════════
function EnterprisesTab() {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnterprises = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/enterprises/`, { headers: authHeaders() });
      // Safety filter: ensure we only show accounts where the user role is actually ENTERPRISE
      setEnterprises(res.data.filter(e => e.user?.role === 'ENTERPRISE'));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEnterprises(); }, [fetchEnterprises]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this enterprise account and its associated login?')) return;
    try {
      // Deleting enterprise profile cascades to the user in our backend
      await axios.delete(`${API_URL}/api/enterprises/${id}/`, { headers: authHeaders() });
      setEnterprises(prev => prev.filter(e => e.id !== id));
    } catch (e) { alert('Error: ' + e.message); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-[#1a4d32]">Enterprise Partners</h2>
          <p className="text-gray-500 font-bold mt-1">{enterprises.length} verified business associations.</p>
        </div>
        <button onClick={fetchEnterprises} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-lg transition-all">
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-[2.5rem] bg-gray-100 animate-pulse" />)}
        </div>
      ) : enterprises.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-24 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Building2 className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-lg font-bold text-gray-400">No Enterprise accounts found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enterprises.map(e => (
            <div key={e.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 hover:border-[#2e8b57] hover:shadow-xl transition-all duration-300 group relative">
              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(e.id)}
                className="absolute top-6 right-6 p-3 rounded-xl bg-red-50 text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:rotate-6 transition-transform shrink-0">
                  {(e.business_name || 'B').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-10">
                  <div className="font-black text-gray-900 text-lg leading-tight truncate">{e.business_name}</div>
                  <div className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-widest bg-green-50 inline-block px-2 py-0.5 rounded-lg">Enterprise Account</div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-red-400 shrink-0"><MapPin size={16} /></div> 
                  <span className="truncate">{e.location || 'Location Pending'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#2e8b57] font-black">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#2e8b57] shrink-0"><Clock size={16} /></div>
                  <span className="truncate">{e.user?.phone_number || 'No Phone'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN AdminDashboard
// ════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const TABS = {
    overview:    <OverviewTab setActiveTab={setActiveTab} />,
    profiles:    <ProfileVerificationTab />,
    submissions: <TaskSubmissionsTab />,
    courses:     <CourseManagementTab />,
    enterprises: <EnterprisesTab />,
  };

  return (
    <div className="min-h-screen flex selection:bg-green-100 selection:text-green-900" style={{ fontFamily: "'Inter', sans-serif", background: '#F9FAFB' }}>

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-72 shrink-0 flex flex-col sticky top-0 h-screen z-50 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a4d32 0%, #1a4d32 100%)' }}>
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-4 px-8 py-10">
          <div className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl shadow-xl shadow-green-950/40"
            style={{ background: 'linear-gradient(135deg, #2e8b57, #1a4d32)' }}>SC</div>
          <div>
            <div className="text-white font-black text-2xl tracking-tighter">SkillConnect</div>
            <div className="text-green-400/60 text-[10px] font-black tracking-[0.2em] uppercase">Control Center</div>
          </div>
        </div>

        {/* User Badge */}
        <div className="relative z-10 px-6 mb-8">
           <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[#2e8b57] flex items-center justify-center text-white font-black">AD</div>
                 <div>
                    <div className="text-white text-sm font-black">System Admin</div>
                    <div className="text-green-400/50 text-[10px] font-bold">Authorized Personnel</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {NAV.map(({ id, label, icon: NavIcon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300 group
                  ${active ? 'text-white bg-white/10 shadow-lg shadow-black/10' : 'text-green-100/50 hover:text-white hover:bg-white/5'}`}>
                <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {React.createElement(NavIcon, { className: `w-5 h-5 ${active ? 'text-green-400' : ''}` })}
                </div>
                <span className="tracking-tight">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative z-10 p-4 border-t border-white/5 bg-black/10 backdrop-blur-lg">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-300 hover:text-white hover:bg-rose-500/20 text-sm font-black transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        {/* Subtle Background pattern */}
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
           <Users size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto">
          {TABS[activeTab]}
        </div>
      </main>
    </div>
  );
}
