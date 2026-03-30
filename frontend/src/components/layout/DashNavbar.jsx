import { Bell, Search, User, Users, Briefcase, BookmarkCheck, MessageSquare, LogOut, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

const navTabs = [
  { name: 'Find Workers', icon: Users },
  { name: 'Post Job', icon: Briefcase },
  { name: 'Saved Workers', icon: BookmarkCheck },
  { name: 'Messages', icon: MessageSquare },
];

export default function DashNavbar({ businessName, searchQuery, setSearchQuery }) {
  const [activeTab, setActiveTab] = useState('Find Workers');

  return (
    <header className="sticky top-0 z-50 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main navbar */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                LW
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-sm font-black text-gray-900 tracking-tight">LocalWorks</span>
                <span className="text-[10px] font-semibold text-indigo-500 tracking-widest uppercase">SkillMap</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search workers, skills, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 justify-end ml-4">
              <button className="p-2.5 rounded-xl hover:bg-gray-100 relative transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #EEF2FF, #DDD6FE)' }}>
                  {(businessName || 'E').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-xs font-bold text-gray-900">{businessName || 'My Business'}</span>
                  <span className="text-[10px] text-gray-400 font-medium">Enterprise</span>
                </div>
                <button
                  onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                  className="ml-1 p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {navTabs.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === name
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
                }`}
              >
                {React.createElement(icon, { className: `w-4 h-4 ${activeTab === name ? 'text-indigo-500' : 'text-gray-400'}` })}
                {name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
