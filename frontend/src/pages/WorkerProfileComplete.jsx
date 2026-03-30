import React, { useState } from 'react';
import axios from 'axios';
import { User, Phone, MapPin, Briefcase, Award, Clock, UploadCloud, ShieldCheck, X, ChevronRight, Sparkles } from 'lucide-react';
import { API_URL } from '../config';

export default function WorkerProfileComplete({ profile, onComplete }) {
  const [formData, setFormData] = useState({
    first_name: profile?.user?.first_name || '',
    last_name: profile?.user?.last_name || '',
    contact_number: profile?.user?.phone_number || '',
    location: profile?.location || '',
    skills: profile?.skills || '',
    experience_years: profile?.experience_years || 0,
    expected_wage: profile?.expected_wage || '',
  });

  const [files, setFiles] = useState({
    id_proof: null,
    certificates: null,
    work_photos: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    Object.keys(files).forEach(key => {
      if (files[key]) {
        submitData.append(key, files[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      
      await axios.patch(`${API_URL}/api/auth/me/`, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.contact_number,
      }, {
         headers: { 'Authorization': `Token ${token}` }
      });

      const res = await axios.patch(`${API_URL}/api/workers/${profile.id}/`, submitData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if(onComplete) onComplete(res.data);
      
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#1a4d32] p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#2e8b57] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Complete Your Profile</h2>
            <p className="text-green-100/60 max-w-md mx-auto">Help us verify your skills to connect you with potential employers and businesses.</p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {error && (
            <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border border-red-100">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#2e8b57]">
                  <User size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required 
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl p-4 text-base font-medium transition-all border-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required 
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl p-4 text-base font-medium transition-all border-2" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                    <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleInputChange} required placeholder="e.g. 9876543210"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl text-base font-medium transition-all border-2" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Service Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="City name or area"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl text-base font-medium transition-all border-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#2e8b57]">
                  <Briefcase size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Professional Expertise</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Skill Categories (comma separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} required placeholder="e.g. Plumbing, Electrical, Carpentry"
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl p-4 text-base font-medium transition-all border-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                    <input type="number" name="experience_years" value={formData.experience_years} onChange={handleInputChange} required min="0"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl text-base font-medium transition-all border-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Expected Daily Wage (₹)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-[#2e8b57]">₹</span>
                    <input type="number" name="expected_wage" value={formData.expected_wage} onChange={handleInputChange} required min="0" step="0.01" placeholder="500"
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl text-base font-medium transition-all border-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#2e8b57]">
                  <UploadCloud size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verification Documents</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-green-50/20 hover:border-green-100 transition-all">
                  <label className="block text-sm font-bold text-gray-700 mb-4">Official ID Proof (Aadhar/PAN/Voter ID) <span className="text-red-500">*</span></label>
                  <input type="file" name="id_proof" onChange={handleFileChange} required 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2e8b57] file:text-white hover:file:bg-[#267347] transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-green-50/20 hover:border-green-100 transition-all">
                    <label className="block text-sm font-bold text-gray-700 mb-4">Trade Certificates (Optional)</label>
                    <input type="file" name="certificates" onChange={handleFileChange} 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2e8b57] file:text-white transition-all" />
                  </div>
                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-green-50/20 hover:border-green-100 transition-all">
                    <label className="block text-sm font-bold text-gray-700 mb-4">Work Portfolio Photos (Optional)</label>
                    <input type="file" name="work_photos" onChange={handleFileChange} 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2e8b57] file:text-white transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 py-5 px-4 rounded-[1.5rem] text-xl font-bold text-white transition-all shadow-xl shadow-green-900/10 ${loading ? 'bg-green-300' : 'bg-[#2e8b57] hover:bg-[#267347]'}`}
              >
                {loading ? (
                  <>Saving Profile...</>
                ) : (
                  <>
                    Complete & Submit Profile
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
              <p className="text-center text-gray-400 text-xs mt-6 font-medium">By submitting, you agree to our verification process and terms of service.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
