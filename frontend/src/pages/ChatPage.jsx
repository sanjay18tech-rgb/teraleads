import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient, getChatHistory, sendChatMessage } from '../services/api';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [patientData, chatData] = await Promise.all([
        getPatient(patientId),
        getChatHistory(patientId),
      ]);
      setPatient(patientData);
      setMessages(chatData.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [patientId]);

  async function handleSendMessage(message) {
    if (!message.trim()) return;
    setSending(true);
    setError('');
    const userMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const { reply } = await sendChatMessage(patientId, message);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          message: reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-dental-600 animate-spin" />
      </div>
    );
  }

  if (error && !patient) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-dental-600 hover:text-dental-700">
          <ArrowLeft size={18} /> Back to patients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-4 mb-4">
        <Link
          to="/"
          className="p-2 text-dental-600 hover:bg-dental-100 rounded-lg transition"
          title="Back to patients"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-dental-800">{patient?.name}</h1>
          {patient?.email && (
            <p className="text-sm text-dental-600">{patient.email}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow border border-dental-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        </div>
        <div className="border-t border-dental-100 p-4">
          <MessageInput onSend={handleSendMessage} disabled={sending} />
        </div>
      </div>
    </div>
  );
}
