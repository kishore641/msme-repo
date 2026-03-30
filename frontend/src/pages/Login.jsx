import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Wrench, Users, Shield, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('WORKER');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        phone_number: phoneNumber,
        password: password
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      const userRole = res.data.role;
      if (userRole === 'ADMIN') {
        navigate('/admin-panel');
      } else if (userRole === 'WORKER') {
        navigate('/worker');
      } else {
        navigate('/enterprise');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Authentication failed. Please check your credentials.');
      } else {
        setError('Network error. Is the backend running?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'WORKER', label: 'Worker', icon: Wrench },
    { id: 'ENTERPRISE', label: 'Business', icon: Users },
    { id: 'ADMIN', label: 'Admin', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-8 self-start text-lg font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 w-full max-w-lg p-10 md:p-14">
          <div className="flex flex-col items-center text-center">
            {/* Header Icon */}
            <div className="w-20 h-20 bg-[#2e8b57] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100">
              <Wrench className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {role === 'ADMIN' ? 'Admin Portal' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 text-lg mb-10">
              {role === 'ADMIN' ? 'Secure authorization required' : 'Choose your role to log in'}
            </p>

            <div className="grid grid-cols-3 gap-4 w-full mb-10">
              {roles.map((r) => {
                const Icon = r.icon;
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                      isActive 
                        ? 'border-[#2e8b57] bg-green-50 text-[#2e8b57]' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Icon className={`w-10 h-10 mb-3 ${isActive ? 'text-[#2e8b57]' : 'text-gray-400'}`} />
                    <span className="text-base font-semibold">{r.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="text-left">
                <label className="block text-gray-900 font-semibold mb-2 ml-1">
                  {role === 'ADMIN' ? 'Admin Email / Username' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'ADMIN' ? "Admin Username" : "+91 98765 43210"}
                  required
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl p-5 text-lg transition-all border-2"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="text-left">
                <label className="block text-gray-900 font-semibold mb-2 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#2e8b57] focus:ring-0 rounded-2xl p-5 text-lg transition-all border-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#9bc9b5] hover:bg-[#2e8b57] text-white font-bold py-5 rounded-2xl text-xl transition-all shadow-lg shadow-green-50 disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Signing in...' : (role === 'ADMIN' ? 'Admin Access' : `Log In as ${role.charAt(0) + role.slice(1).toLowerCase()}`)}
              </button>
            </form>

            {role !== 'ADMIN' && (
              <div className="mt-10 text-lg">
                <span className="text-gray-500">Don't have an account? </span>
                <Link to="/register" className="text-[#2e8b57] font-bold hover:underline">
                  Register
                </Link>
              </div>
            )}

            {role === 'ADMIN' && (
              <div className="mt-10 text-lg">
                <p className="text-gray-400 italic">Admin accounts are managed via the secure system console.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


