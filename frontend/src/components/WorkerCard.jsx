import React from 'react';
import { Star, MapPin, ShieldCheck, Clock, Phone, Eye, Zap, Droplets, Wrench, Settings, Hammer, Paintbrush, Sparkles, Laptop, Truck, Users } from 'lucide-react';
import { API_URL } from '../config';

const skillIconMap = {
  electrical: Zap, electric: Zap,
  plumb: Droplets, plumbing: Droplets,
  weld: Wrench, welding: Wrench,
  mechanic: Settings, mechanical: Settings,
  construct: Hammer, construction: Hammer, mason: Hammer,
  paint: Paintbrush, painting: Paintbrush,
  clean: Sparkles, cleaning: Sparkles,
  install: Laptop, installation: Laptop,
  transport: Truck, logistics: Truck,
  general: Users, labor: Users,
  carpenter: Hammer, carpent: Hammer,
};

function getSkillIcon(skillsStr) {
  const lower = (skillsStr || '').toLowerCase();
  for (const [key, Icon] of Object.entries(skillIconMap)) {
    if (lower.includes(key)) return Icon;
  }
  return Clock;
}

const levelColors = {
  BEGINNER: { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
  SKILLED: { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
  EXPERT: { bg: '#FFF7ED', text: '#EA580C', dot: '#F97316' },
};

export default function WorkerCard({ worker, onViewProfile }) {
  const skillIcon = getSkillIcon(worker.skills);
  const skillName = worker.skills?.split(',')[0]?.trim() || 'General Labor';
  const level = worker.level || 'BEGINNER';
  const levelStyle = levelColors[level] || levelColors['BEGINNER'];
  const rating = worker.rating || 4.5;

  const photoUrl = worker.work_photos
    ? (worker.work_photos.startsWith('http') ? worker.work_photos : `${API_URL}${worker.work_photos}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent((worker.user?.first_name || 'W') + '+' + (worker.user?.last_name || ''))}&background=EEF2FF&color=4F46E5&size=200&bold=true&font-size=0.45`;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 hover:border-indigo-100 flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Gradient top accent */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #A855F7)' }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={photoUrl}
              alt={worker.user?.first_name || 'Worker'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            {/* Online dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
          </div>

          {/* Name & badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                {worker.user?.first_name} {worker.user?.last_name}
              </h3>
              {worker.is_verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified" />
              )}
            </div>

            {/* Skill tag */}
            <div className="flex items-center gap-1.5 mt-1.5 inline-flex">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                {React.createElement(skillIcon, { className: "w-3.5 h-3.5" })}
                {skillName}
              </span>
            </div>
          </div>

          {/* Level badge */}
          <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: levelStyle.bg, color: levelStyle.text }}>
            {level.charAt(0) + level.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-gray-50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Rating</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <span className="text-sm font-bold text-gray-900">{worker.experience_years || 0}yr</span>
            <p className="text-[10px] text-gray-400 mt-0.5">Exp.</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-bold text-gray-900">₹{worker.expected_wage || 'N/A'}</span>
            <p className="text-[10px] text-gray-400 mt-0.5">/ day</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{worker.location || 'Location not set'}</span>
        </div>

        {/* Action buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewProfile(worker)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <Eye className="w-4 h-4" />
            Profile
          </button>
          <button
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all hover:shadow-indigo-200 hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            <Phone className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
