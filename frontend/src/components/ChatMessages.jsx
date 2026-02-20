import { Bot, User } from 'lucide-react';

export default function ChatMessages({ messages, messagesEndRef }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-dental-500 text-center py-12">
        <Bot size={48} className="mb-4 opacity-50" />
        <p>No messages yet. Send a message to start the conversation.</p>
        <p className="text-sm mt-1">The dental assistant will help answer patient questions.</p>
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-dental-600 text-white' : 'bg-dental-100 text-dental-600'
            }`}
          >
            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2 ${
              msg.role === 'user'
                ? 'bg-dental-600 text-white rounded-br-md'
                : 'bg-dental-100 text-dental-800 rounded-bl-md'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            <p
              className={`text-xs mt-1 ${
                msg.role === 'user' ? 'text-dental-200' : 'text-dental-500'
              }`}
            >
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
