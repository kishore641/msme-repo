import React, { useState } from 'react';
import axios from 'axios';
import { X, Briefcase, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function QuickHireModal({ worker, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: worker?.location || '',
    skill_required: worker?.skills?.split(',')[0]?.trim() || '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const workerName = `${worker?.user?.first_name || ''} ${worker?.user?.last_name || ''}`.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // 1. Create the job
      const jobRes = await axios.post(`${API_URL}/api/jobs/`, form, {
        headers: { Authorization: `Token ${token}` },
      });
      const jobId = jobRes.data.id;

      // 2. Immediately create an application linking the specific worker
      await axios.post(`${API_URL}/api/job-applications/`, {
        job: jobId,
        worker: worker.id,
      }, { headers: { Authorization: `Token ${token}` } });

      // 3. Send automated message to chat
      await axios.post(`${API_URL}/api/messages/`, {
        worker: worker.id,
        body: `Hi! I've sent you a hire request for "${form.title}". Please check your Hire Requests tab to confirm!`,
      }, { headers: { Authorization: `Token ${token}` } });

      setDone(true);
    } catch (err) {
      alert('Failed: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #2563EB)' }}>
            <div>
              <h2 className="text-white font-black text-lg">Quick Hire</h2>
              <p className="text-violet-300 text-xs mt-0.5">Send a job offer to {workerName}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {done ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-black text-gray-900 mb-2">Hire Request Sent!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Your job offer has been sent to <span className="font-semibold text-violet-700">{workerName}</span>.
              </p>
              <button onClick={onClose}
                className="px-6 py-2.5 rounded-2xl text-white font-bold shadow-lg text-sm"
                style={{ background: 'linear-gradient(135deg, #6D28D9, #4F46E5)' }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Worker preview */}
              <div className="flex items-center gap-3 bg-violet-50 p-3 rounded-2xl border border-violet-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black">
                  {workerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{workerName}</div>
                  <div className="text-xs text-gray-500">{worker?.skills?.split(',')[0]?.trim()} · {worker?.location}</div>
                </div>
                <div className="ml-auto text-sm font-bold text-emerald-600">₹{worker?.expected_wage}/day</div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Job Title *</label>
                <input required value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Electrical work at office"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description *</label>
                <textarea required rows="3" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the work needed…"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location *</label>
                  <input required value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Work location"
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Skill Needed *</label>
                  <input required value={form.skill_required}
                    onChange={e => setForm(f => ({ ...f, skill_required: e.target.value }))}
                    placeholder="e.g. Electrical"
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-xl disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #6D28D9, #4F46E5)' }}>
                {loading ? 'Sending Hire Request…' : '🚀 Send Hire Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
