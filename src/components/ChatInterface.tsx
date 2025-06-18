
import React, { useState } from 'react';
import AgentButton from './AgentButton';
import ChatArea from './ChatArea';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface AgentData {
  id: number;
  title: string;
  description: string;
  icon: string;
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

  const agentsData: AgentData[] = [
    {
      id: 1,
      title: "Assistente Geral",
      description: "Seu assistente para dúvidas gerais, conversas e tarefas do dia a dia.",
      icon: "🤖"
    },
    {
      id: 2,
      title: "Especialista Técnico",
      description: "Especializado em programação, tecnologia e soluções técnicas.",
      icon: "⚡"
    },
    {
      id: 3,
      title: "Consultor Criativo",
      description: "Ideal para brainstorming, ideias criativas e projetos inovadores.",
      icon: "🎨"
    },
    {
      id: 4,
      title: "Analista de Dados",
      description: "Focado em análise, relatórios e interpretação de informações.",
      icon: "📊"
    },
    {
      id: 5,
      title: "Mentor Pessoal",
      description: "Orientação pessoal, desenvolvimento e crescimento profissional.",
      icon: "🌟"
    }
  ];

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
      <header className="p-6 border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center">
            {agentsData.map((agent) => (
              <AgentButton
                key={agent.id}
                agentNumber={agent.id}
                title={agent.title}
                description={agent.description}
                icon={agent.icon}
                isSelected={selectedAgent === agent.id}
                onClick={() => handleAgentSelect(agent.id)}
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
