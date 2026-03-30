import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Search, Bell, LogOut, LayoutGrid, List, SlidersHorizontal,
  MapPin, Star, ShieldCheck, Phone, Eye, ChevronDown, Users,
  Zap, Droplets, Wrench, Settings, Hammer, Paintbrush, Sparkles,
  Laptop, Truck, X, Briefcase, MessageSquare, Zap as HireIcon,
  TrendingUp, Award, Clock, ArrowRight, Filter
} from 'lucide-react';
import WorkerProfileModal from '../components/WorkerProfileModal';
import ChatPanel from '../components/ChatPanel';
import QuickHireModal from '../components/QuickHireModal';
import WorkerMap from '../components/WorkerMap';
import { API_URL } from '../config';

// ─── Constants ──────────────────────────────────────────────────────────────
const skillKeywords = {
  electrical: 'electric', plumbing: 'plumb', welding: 'weld',
  mechanical: 'mechanic', construction: 'construct', painting: 'paint',
  cleaning: 'clean', installation: 'install', transport: 'transport', general: 'general',
};

const SKILLS = [
  { id: 'all',          label: 'All Skills',    icon: null },
  { id: 'electrical',   label: 'Electrical',    icon: Zap },
  { id: 'plumbing',     label: 'Plumbing',       icon: Droplets },
  { id: 'welding',      label: 'Welding',        icon: Wrench },
  { id: 'mechanical',   label: 'Mechanical',     icon: Settings },
  { id: 'construction', label: 'Construction',   icon: Hammer },
  { id: 'painting',     label: 'Painting',       icon: Paintbrush },
  { id: 'cleaning',     label: 'Cleaning',       icon: Sparkles },
  { id: 'installation', label: 'Installation',   icon: Laptop },
  { id: 'transport',    label: 'Transport',      icon: Truck },
  { id: 'general',      label: 'General Labor',  icon: Users },
];

const skillIconMap = {
  electric: Zap, plumb: Droplets, weld: Wrench, mechanic: Settings,
  construct: Hammer, mason: Hammer, paint: Paintbrush, clean: Sparkles,
  install: Laptop, transport: Truck, carpenter: Hammer, general: Users, labor: Users,
};

function getSkillIcon(skillsStr) {
  const lower = (skillsStr || '').toLowerCase();
  for (const [key, Icon] of Object.entries(skillIconMap)) {
    if (lower.includes(key)) return Icon;
  }
  return Briefcase;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-1 bg-gray-100" />
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-100" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-gray-100 rounded-xl w-3/4" />
            <div className="h-3 bg-gray-100 rounded-xl w-1/2" />
          </div>
        </div>
        <div className="h-10 bg-gray-50 rounded-2xl" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-gray-100 rounded-2xl" />
          <div className="h-12 bg-gray-100 rounded-2xl" />
          <div className="h-12 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Worker Card (with Chat + Call + Hire actions) ──────────────────────────
function WorkerCard({ worker, onViewProfile, onChat, onHire }) {
  const skillIcon = getSkillIcon(worker.skills);
  const skillName = worker.skills?.split(',')[0]?.trim() || 'General Labor';
  const rating = worker.rating || 4.5;
  const photoUrl = worker.work_photos
    ? (worker.work_photos.startsWith('http') ? worker.work_photos : `${API_URL}${worker.work_photos}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent((worker.user?.first_name || 'W') + '+' + (worker.user?.last_name || ''))}&background=f0fdf4&color=166534&size=200&bold=true`;

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-100 flex flex-col cursor-pointer">
      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative shrink-0">
            <img src={photoUrl} alt={worker.user?.first_name || 'Worker'}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
            {worker.is_verified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">{worker.user?.first_name} {worker.user?.last_name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-wider">
                {React.createElement(skillIcon, { className: "w-3 h-3" })}{skillName}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500 font-medium">
              <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
              <span className="truncate">{worker.location || 'Location not set'}</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-xl">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Exp.', value: `${worker.experience_years || 0}y` },
            { label: 'Jobs', value: worker.jobs_completed || 0 },
            { label: 'Rate/d', value: `₹${worker.expected_wage || '0'}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-2.5 text-center transition-colors group-hover:bg-green-50/50">
              <div className="text-xs font-bold text-gray-900">{value}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Actions — 3 buttons */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <button onClick={() => onViewProfile(worker)}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border border-gray-100 text-gray-500 text-[10px] font-bold hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all">
            <Eye className="w-4 h-4" /> View
          </button>
          <button onClick={() => onChat(worker)}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border border-gray-100 text-gray-500 text-[10px] font-bold hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all">
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
          <button onClick={() => onHire(worker)}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl text-white text-[10px] font-bold bg-[#2e8b57] hover:bg-[#267347] shadow-lg shadow-green-100 transition-all active:scale-95">
            <HireIcon className="w-4 h-4" /> Hire
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function EnterpriseDashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [enterpriseId, setEnterpriseId] = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isProfileOpen, setIsProfileOpen]   = useState(false);
  const [chatWorker, setChatWorker] = useState(null);
  const [hireWorker, setHireWorker] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy]     = useState('rating');
  const [activeSkill, setActiveSkill] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'map'
  const [enterpriseData, setEnterpriseData] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Token ${token}` };
      const [wRes, eRes] = await Promise.all([
        axios.get(`${API_URL}/api/workers/`, { headers }),
        axios.get(`${API_URL}/api/enterprises/`, { headers }),
      ]);
      setWorkers(wRes.data);
      if (eRes.data.length > 0) {
        setBusinessName(eRes.data[0].business_name || eRes.data[0].user?.first_name + "'s Business");
        setEnterpriseId(eRes.data[0].id);
        setEnterpriseData(eRes.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = useMemo(() => {
    let result = workers.filter(w => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = `${w.user?.first_name || ''} ${w.user?.last_name || ''}`.toLowerCase();
        if (!name.includes(q) && !(w.skills || '').toLowerCase().includes(q) && !(w.location || '').toLowerCase().includes(q)) return false;
      }
      if (activeSkill !== 'all') {
        const kw = skillKeywords[activeSkill] || activeSkill;
        if (!(w.skills || '').toLowerCase().includes(kw)) return false;
      }
      return true;
    });
    if (sortBy === 'rating')     result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'experience') result.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
    if (sortBy === 'wage')       result.sort((a, b) => (a.expected_wage || 0) - (b.expected_wage || 0));
    return result;
  }, [workers, activeSkill, searchQuery, sortBy]);

  const stats = [
    { label: 'Available',    value: workers.length,                          icon: Users,      color: 'bg-green-500' },
    { label: 'Verified',     value: workers.filter(w => w.is_verified).length, icon: ShieldCheck, color: 'bg-blue-500' },
    { label: 'Success Rate', value: '98%',                                   icon: TrendingUp, color: 'bg-amber-500' },
    { label: 'Avg Rating',   value: workers.length ? (workers.reduce((s, w) => s + (w.rating || 0), 0) / workers.length).toFixed(1) : '4.8', icon: Award, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full z-50 w-72 flex flex-col transition-transform duration-300 bg-[#1a4d32]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-8 py-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg bg-[#2e8b57]">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white font-extrabold text-lg tracking-tight leading-none">SkillConnect</div>
            <div className="text-green-400 text-[10px] font-bold uppercase tracking-widest mt-1">Enterprise Hub</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-green-200 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Info */}
        <div className="px-5 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl bg-[#2e8b57]">
                {(businessName || 'B').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-white font-bold text-sm truncate">{businessName || 'Enterprise'}</div>
                <div className="text-green-400 text-[10px] font-bold uppercase mt-0.5">Verified Partner</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/5">
              Edit Business Profile
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-6 space-y-1 mb-8">
          <p className="text-green-400/50 text-[10px] font-bold uppercase tracking-widest mb-4 px-2">Dashboard</p>
          <button onClick={() => setActiveTab('browse')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
              ${activeTab === 'browse' ? 'text-white bg-[#2e8b57] shadow-lg shadow-green-900/20' : 'text-green-100/60 hover:text-white hover:bg-white/5'}`}>
            <LayoutGrid className="w-5 h-5" /> Browse Workers
          </button>
          <button onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
              ${activeTab === 'map' ? 'text-white bg-[#2e8b57] shadow-lg shadow-green-900/20' : 'text-green-100/60 hover:text-white hover:bg-white/5'}`}>
            <MapPin className="w-5 h-5" /> Live Map View
          </button>
          <button
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-green-100/60 hover:text-white hover:bg-white/5 transition-all">
            <Clock className="w-5 h-5" /> Hiring History
          </button>
        </div>

        {/* Skill Quick Filters */}
        <div className="px-6 flex-1 overflow-y-auto">
          <p className="text-green-400/50 text-[10px] font-bold uppercase tracking-widest mb-4 px-2">Quick Categories</p>
          <div className="space-y-1">
            {SKILLS.map(({ id, label, icon: Icon }) => {
              const active = activeSkill === id;
              return (
                <button key={id} onClick={() => { setActiveSkill(id); setActiveTab('browse'); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-bold transition-all
                    ${active ? 'text-white bg-white/10' : 'text-green-100/40 hover:text-white hover:bg-white/5'}`}>
                  {Icon ? React.createElement(Icon, { className: "w-4 h-4 shrink-0" }) : <span className="w-4 h-4 shrink-0" />}
                  {label}
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="p-6 mt-auto">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-300 hover:text-red-200 hover:bg-red-500/10 text-sm font-bold transition-all border border-transparent hover:border-red-500/20">
            <LogOut className="w-5 h-5" /> Sign Out Account
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <SlidersHorizontal className="w-6 h-6" />
            </button>
            <div className="relative max-w-lg w-full hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by worker name, skill, or location..."
                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 rounded-[1.25rem] pl-12 pr-4 py-3 text-sm font-medium transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all text-gray-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
            </button>
            <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-gray-900 leading-none">Admin Panel</div>
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">Enterprise</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#2e8b57] flex items-center justify-center text-white font-bold shadow-lg shadow-green-100">
                {(businessName || 'B').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10">

          {/* Hero Section */}
          <div className="relative rounded-[2.5rem] bg-[#1a4d32] p-8 sm:p-12 overflow-hidden shadow-2xl shadow-green-900/10">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-green-500/10 blur-3xl opacity-50" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider mb-6 border border-green-500/20">
                <Sparkles className="w-3 h-3" /> New Workers Joined Today
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-[1.1]">
                Find the Best <span className="text-green-400 italic">Talent</span> for Your Local Tasks
              </h1>
              <p className="text-green-100/60 text-lg mb-8 leading-relaxed max-w-xl">
                SkillConnect bridges the gap between verified local workers and businesses needing instant help. Browse 10+ categories and hire in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('browse')}
                  className="bg-[#2e8b57] hover:bg-[#267347] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-green-900/20">
                  Hire Now <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center -space-x-3 px-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="w-10 h-10 rounded-full border-2 border-[#1a4d32] grayscale hover:grayscale-0 transition-all cursor-pointer" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#1a4d32] bg-[#2e8b57] flex items-center justify-center text-white text-[10px] font-bold">1k+</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl ${s.color} bg-opacity-10 flex items-center justify-center`}>
                  {React.createElement(s.icon, { className: `w-7 h-7 ${s.color.replace('bg-', 'text-')}` })}
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {activeSkill === 'all' ? 'Featured Workers' : SKILLS.find(s => s.id === activeSkill)?.label}
              </h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">Hiring verified experts in <span className="text-green-600 font-bold">{activeSkill}</span></p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="pl-10 pr-10 py-3 text-sm font-bold bg-white border border-gray-100 rounded-2xl text-gray-600 outline-none focus:border-green-500 cursor-pointer appearance-none w-full shadow-sm">
                  <option value="rating">Top Rated First</option>
                  <option value="experience">Most Experienced</option>
                  <option value="wage">Budget Optimized</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#2e8b57] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#2e8b57] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Workers Content */}
          {activeTab === 'map' ? (
            <div className="h-[600px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative">
              <WorkerMap 
                workers={filteredWorkers} 
                enterprise={enterpriseData} 
                onChat={w => setChatWorker(w)}
                onHire={w => setHireWorker(w)}
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl border border-white">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Worker Locations
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredWorkers.length > 0 ? (
            <div className={viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-4'}>
              {filteredWorkers.map(worker => (
                <WorkerCard key={worker.id} worker={worker}
                  onViewProfile={w => { setSelectedWorker(w); setIsProfileOpen(true); }}
                  onChat={w => setChatWorker(w)}
                  onHire={w => setHireWorker(w)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-green-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">No workers found</h3>
              <p className="text-gray-400 text-sm max-w-xs font-medium">
                Try widening your search radius or selecting a different skill category.
              </p>
              <button 
                onClick={() => { setActiveSkill('all'); setSearchQuery(''); }}
                className="mt-8 px-8 py-3 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition-all">
                Clear Filters
              </button>
            </div>
          )}

          {/* Footer Info */}
          <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-gray-400 text-sm font-medium">© 2026 SkillConnect Enterprise. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-[#2e8b57] text-sm font-bold transition-colors">Safety Center</button>
              <button className="text-gray-400 hover:text-[#2e8b57] text-sm font-bold transition-colors">Privacy Policy</button>
              <button className="text-gray-400 hover:text-[#2e8b57] text-sm font-bold transition-colors">Support Hub</button>
            </div>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <WorkerProfileModal worker={selectedWorker} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}
        onChat={w => { setIsProfileOpen(false); setChatWorker(w); }}
        onHire={w => { setIsProfileOpen(false); setHireWorker(w); }} />

      {/* Chat Panel */}
      {chatWorker && (
        <ChatPanel worker={chatWorker} enterpriseId={enterpriseId} onClose={() => setChatWorker(null)} />
      )}

      {/* Quick Hire Modal */}
      {hireWorker && (
        <QuickHireModal worker={hireWorker} onClose={() => setHireWorker(null)} />
      )}
    </div>
  );
}
