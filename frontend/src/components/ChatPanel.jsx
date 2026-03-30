import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Send, Phone, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

export default function ChatPanel({ worker, enterpriseId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Token ${token}` };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/messages/?worker_id=${worker.id}`,
        { headers }
      );
      setMessages(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchMessages();
    // Poll every 5 seconds for new messages
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await axios.post(`${API_URL}/api/messages/`, {
        worker: worker.id,
        enterprise: enterpriseId,
        body: text.trim(),
      }, { headers });
      setText('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send: ' + (err.response?.data?.detail || err.message));
    } finally { setSending(false); }
  };

  const workerName = `${worker.user?.first_name || ''} ${worker.user?.last_name || ''}`.trim() || worker.user?.username;
  const avatar = workerName.charAt(0).toUpperCase();

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 flex flex-col rounded-3xl shadow-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid #E9D5FF', maxHeight: '520px' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5"
        style={{ background: 'linear-gradient(135deg, #4C1D95, #5B21B6)' }}>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm truncate">{workerName}</div>
          <div className="text-violet-300 text-[10px]">
            {worker.user?.phone_number ? '🟢 Online' : '⚪ In-app chat'}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {worker.user?.phone_number && (
            <a href={`tel:${worker.user.phone_number}`}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all" title="Call">
              <Phone className="w-4 h-4" />
            </a>
          )}
          <button onClick={onClose} className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ minHeight: 260, maxHeight: 340 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-10">
            <div className="text-3xl mb-2">💬</div>
            Start the conversation with {workerName}
          </div>
        ) : (
          messages.map(m => {
            const isMine = m.sender_role === 'ENTERPRISE';
            return (
              <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm shadow-sm ${
                  isMine
                    ? 'text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                }`} style={isMine ? { background: 'linear-gradient(135deg, #6D28D9, #4F46E5)' } : {}}>
                  {m.body}
                  <div className={`text-[10px] mt-1 ${isMine ? 'text-violet-200' : 'text-gray-400'}`}>
                    {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 bg-white border-t border-gray-100">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
        />
        <button type="submit" disabled={sending || !text.trim()}
          className="p-2.5 rounded-2xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6D28D9, #4F46E5)' }}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
