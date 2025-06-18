
import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      setIsLoading(true);
      await onSendMessage(message.trim());
      setMessage('');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          className="
            w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-2xl
            border border-gray-600 focus:border-blue-500 focus:outline-none
            resize-none min-h-[52px] max-h-32
            placeholder-gray-400 text-sm leading-relaxed
            transition-all duration-200
          "
          rows={1}
          disabled={isLoading}
        />
      </div>
      
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="
          send-button p-3 bg-blue-600 text-white rounded-2xl
          hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed
          shadow-lg hover:shadow-blue-600/30
          transition-all duration-200
        "
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send size={20} />
        )}
      </button>
    </div>
  );
};

export default MessageInput;
