import React from 'react';
import { X, Star, MapPin, ShieldCheck, Briefcase, Phone, MessageCircle, Award, Clock } from 'lucide-react';
import { skillsList } from '../data/skillsData';
import { API_URL } from '../config';

export default function WorkerProfileModal({ worker, isOpen, onClose }) {
  if (!isOpen || !worker) return null;

  const firstSkill = worker.skills?.split(',')[0]?.trim().toLowerCase() || '';
  const matchedSkill = skillsList.find(s =>
    firstSkill.includes(s.name.split(' ')[0].toLowerCase())
  );
  const SkillIcon = matchedSkill?.icon || Briefcase;
  const skillName = worker.skills?.split(',')[0]?.trim() || 'General';
  const allSkills = worker.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  const photoUrl = worker.work_photos
    ? (worker.work_photos.startsWith('http') ? worker.work_photos : `${API_URL}${worker.work_photos}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent((worker.user?.first_name || 'W') + ' ' + (worker.user?.last_name || ''))}&background=EDE9FE&color=6D28D9&size=256&bold=true`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
          style={{ background: '#FFFFFF' }}>

          {/* Header gradient */}
          <div className="relative h-36 rounded-t-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #5B21B6, #2563EB)' }}>
            {/* Decor */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }} />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }} />

            <button onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all hover:scale-110">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar overlapping header */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-14 mb-4">
              <div className="relative">
                <img src={photoUrl} alt={worker.user?.first_name || 'Worker'}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl" />
                {worker.is_verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Contact buttons */}
              <div className="flex gap-2 pb-1">
                <button className="p-2.5 rounded-2xl border border-gray-200 text-gray-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </button>
                {worker.user?.phone_number ? (
                  <a href={`tel:${worker.user.phone_number}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #6D28D9, #4F46E5)' }}>
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                ) : (
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold shadow-xl transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #6D28D9, #4F46E5)' }}>
                    <Phone className="w-4 h-4" /> Contact
                  </button>
                )}
              </div>
            </div>

            {/* Name & info */}
            <div className="mb-5">
              <h1 className="text-2xl font-extrabold text-gray-900">
                {worker.user?.first_name} {worker.user?.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-xl border border-violet-100">
                  <SkillIcon className="w-3.5 h-3.5" />{skillName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {worker.rating?.toFixed(1) || '4.5'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />{worker.location || 'Location N/A'}
                </span>
                {worker.user?.phone_number && (
                  <a href={`tel:${worker.user.phone_number}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
                    <Phone className="w-3.5 h-3.5" />{worker.user.phone_number}
                  </a>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Experience', value: `${worker.experience_years || 0} yrs`, icon: Clock,    color: '#6D28D9', bg: '#F5F3FF' },
                { label: 'Jobs Done',  value: worker.jobs_completed || 0,             icon: Award,   color: '#0369A1', bg: '#EFF6FF' },
                { label: 'Daily Rate', value: `₹${worker.expected_wage || 'N/A'}`,   icon: Star,    color: '#B45309', bg: '#FFFBEB' },
                { label: 'Verified',   value: worker.is_verified ? '✓ Yes' : 'Pending', icon: ShieldCheck, color: worker.is_verified ? '#059669' : '#6B7280', bg: worker.is_verified ? '#ECFDF5' : '#F9FAFB' },
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} className="p-3 rounded-2xl text-center border" style={{ background: bg, borderColor: bg }}>
                  {React.createElement(icon, { className: "w-4 h-4 mx-auto mb-1", style: { color } })}
                  <div className="text-sm font-extrabold text-gray-900">{value}</div>
                  <div className="text-[10px] font-semibold text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            {allSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2.5">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
