
import React, { useState } from 'react';
import AgentButton from './AgentButton';
import ChatArea from './ChatArea';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatInterface = () => {
  const [selectedAgent, setSelectedAgent] = useState<number>(1);
  const [conversations, setConversations] = useState<Record<number, Message[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  });

  const handleAgentSelect = (agentNumber: number) => {
    setSelectedAgent(agentNumber);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    // Adiciona a mensagem do usuário
    setConversations(prev => ({
      ...prev,
      [selectedAgent]: [...prev[selectedAgent], userMessage]
    }));

    try {
      // Simula chamada para o backend n8n
      const response = await fetch(`/webhook/agent${selectedAgent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      let agentResponse = 'Desculpe, não consegui processar sua mensagem no momento.';
      
      if (response.ok) {
        const data = await response.json();
        agentResponse = data.response || `Resposta do Agente ${selectedAgent}: ${message}`;
      } else {
        // Resposta simulada para demonstração
        agentResponse = `Agente ${selectedAgent}: Obrigado pela sua mensagem "${message}". Como posso ajudá-lo hoje?`;
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: agentResponse,
        sender: 'agent',
        timestamp: new Date()
      };

      setConversations(prev => ({
        ...prev,
        [selectedAgent]: [...prev[selectedAgent], agentMessage]
      }));
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Resposta de erro
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'agent',
        timestamp: new Date()
      };

      setConversations(prev => ({
        ...prev,
        [selectedAgent]: [...prev[selectedAgent], errorMessage]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
      {/* Header com botões dos agentes */}
      <header className="p-4 border-b border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((agentNumber) => (
              <AgentButton
                key={agentNumber}
                agentNumber={agentNumber}
                isSelected={selectedAgent === agentNumber}
                onClick={() => handleAgentSelect(agentNumber)}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Área principal do chat */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ChatArea
          messages={conversations[selectedAgent]}
          agentNumber={selectedAgent}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default ChatInterface;
