import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Zap, Droplets, Palette, Hammer, Monitor, Sparkles, ClipboardList, ShieldCheck, Star, ArrowRight, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const services = [
    { name: 'Electrician', icon: Zap, color: 'text-orange-500' },
    { name: 'Plumber', icon: Droplets, color: 'text-blue-500' },
    { name: 'Cleaner', icon: Sparkles, color: 'text-yellow-600' },
    { name: 'Painter', icon: Palette, color: 'text-pink-500' },
    { name: 'Carpenter', icon: Hammer, color: 'text-gray-600' },
    { name: 'Computer Hardware', icon: Monitor, color: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2e8b57] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">Skill<span className="text-[#2e8b57]">Connect</span></span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-gray-600 font-bold hover:text-[#2e8b57] transition-colors">Log In</Link>
          <Link to="/register" className="bg-[#2e8b57] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#267347] transition-all shadow-xl shadow-green-100 active:scale-95">
            Get Started
          </Link>
        </div>
      </header>


      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#111827] leading-tight mb-6">
            Find <span className="text-[#2e8b57]">Skilled Workers</span> for Your Business
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Trained, verified local workers ready to help with electrical, plumbing, cleaning, and more. Post a job and get it done today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 bg-[#2e8b57] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#267347] shadow-lg shadow-green-100 transition-all"
            >
              <Users className="w-5 h-5" />
              I Need Workers
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              <Wrench className="w-5 h-5" />
              I Want Work
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Services We Cover</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Icon className={`w-10 h-10 ${service.color}`} />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">{service.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <ClipboardList className="w-8 h-8 text-[#2e8b57]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Post a Job</h3>
              <p className="text-gray-500">Describe your problem and what you need help with.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#2e8b57]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Get Verified Workers</h3>
              <p className="text-gray-500">Browse trained and verified workers matching your needs.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-[#2e8b57]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Job Done & Rate</h3>
              <p className="text-gray-500">Worker completes the job. Rate their work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="bg-[#2e8b57] py-20 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Are You a Worker Looking for Jobs?</h2>
          <p className="text-green-50 text-lg mb-10 max-w-xl mx-auto">
            Complete free training courses, get verified, and start earning. No fees to join.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-[#f4a261] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e76f51] transition-all"
          >
            Join as a Worker <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 grayscale-0">
            <div className="w-8 h-8 bg-[#2e8b57] rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillConnect</span>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            © 2025 SkillConnect. Empowering local workers and businesses.
          </p>
        </div>
      </footer>
    </div>
  );
}
