import React, { useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { Message as MessageType } from './ChatInterface';

interface ChatAreaProps {
  messages: MessageType[];
  agentNumber: number;
  onSendMessage: (message: string) => Promise<void>;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, agentNumber, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Conversa com Agente {agentNumber}</h3>
              <p className="text-sm">Envie uma mensagem para começar a conversar</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;