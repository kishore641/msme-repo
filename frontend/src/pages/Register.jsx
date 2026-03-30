import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wrench, User, Phone, MapPin, Lock, ChevronRight, Briefcase, Users } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Register() {
  const [role, setRole] = useState('WORKER');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic registration call
      // We use phone number as username for simplicity
      const response = await axios.post(`${API_URL}/api/auth/register/`, {
        username: formData.phone,
        phone_number: formData.phone,
        password: formData.password,
        role: role,
        first_name: formData.fullName.split(' ')[0],
        last_name: formData.fullName.split(' ').slice(1).join(' '),
        location: formData.location,
      });

      if (response.data.token || response.status === 201) {
        // If registration is successful, we might need to update the profile with location
        // But for now, let's redirect to login
        alert('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.username?.[0] || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#2e8b57] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-500">Join SkillConnect today</p>
          </div>
        </div>

        <div className="bg-white py-10 px-6 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('WORKER')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  role === 'WORKER' 
                  ? 'border-[#2e8b57] bg-green-50' 
                  : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'WORKER' ? 'bg-[#2e8b57] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Briefcase size={20} />
                </div>
                <span className={`text-sm font-bold ${role === 'WORKER' ? 'text-[#2e8b57]' : 'text-gray-500'}`}>Worker</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('ENTERPRISE')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  role === 'ENTERPRISE' 
                  ? 'border-[#2e8b57] bg-green-50' 
                  : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'ENTERPRISE' ? 'bg-[#2e8b57] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Users size={20} />
                </div>
                <span className={`text-sm font-bold ${role === 'ENTERPRISE' ? 'text-[#2e8b57]' : 'text-gray-500'}`}>Business</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e8b57]/20 focus:border-[#2e8b57] transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e8b57]/20 focus:border-[#2e8b57] transition-all"
                  placeholder="Phone Number"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e8b57]/20 focus:border-[#2e8b57] transition-all"
                  placeholder="Location (City, Area)"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#2e8b57] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e8b57]/20 focus:border-[#2e8b57] transition-all"
                  placeholder="Create Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-[#2e8b57] hover:bg-[#267347] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e8b57] transition-all shadow-lg shadow-green-100 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ChevronRight className="ml-2 h-6 w-6" />}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#2e8b57] hover:text-[#267347]">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
