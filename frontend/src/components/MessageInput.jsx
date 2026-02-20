import { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Type your message..."
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none px-4 py-2.5 border border-dental-200 rounded-xl focus:ring-2 focus:ring-dental-500 focus:border-dental-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] max-h-[120px]"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-dental-600 hover:bg-dental-700 text-white rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
      </button>
    </form>
  );
}
