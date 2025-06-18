
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import AgentButton from './AgentButton';
import ChatArea from './ChatArea';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

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
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null); // Começa sem agente selecionado
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Record<number, Message[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  });
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string;
    title: string;
    agentId: number;
    lastMessage: string;
    timestamp: Date;
    messages: Message[];
  }>>([]);

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

  const saveConversation = (messages: Message[], agentId: number) => {
    if (messages.length === 0) return;
    
    const conversationId = `${agentId}-${Date.now()}`;
    const lastMessage = messages[messages.length - 1];
    const title = messages[0]?.content.substring(0, 30) + '...' || 'Nova conversa';
    
    const newConversation = {
      id: conversationId,
      title,
      agentId,
      lastMessage: lastMessage.content.substring(0, 50) + '...',
      timestamp: new Date(),
      messages: [...messages]
    };

    setConversationHistory(prev => [newConversation, ...prev].slice(0, 20));
  };

  const loadConversation = (conversation: any) => {
    setSelectedAgent(conversation.agentId);
    setConversations(prev => ({
      ...prev,
      [conversation.agentId]: conversation.messages
    }));
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setConversations(prev => ({
      ...prev,
      [selectedAgent]: [...prev[selectedAgent], userMessage]
    }));

    try {
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
        agentResponse = `Agente ${selectedAgent}: Obrigado pela sua mensagem "${message}". Como posso ajudá-lo hoje?`;
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: agentResponse,
        sender: 'agent',
        timestamp: new Date()
      };

      const updatedMessages = [...conversations[selectedAgent], userMessage, agentMessage];
      
      setConversations(prev => ({
        ...prev,
        [selectedAgent]: updatedMessages
      }));

      saveConversation(updatedMessages, selectedAgent);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'agent',
        timestamp: new Date()
      };

      const updatedMessages = [...conversations[selectedAgent], userMessage, errorMessage];
      
      setConversations(prev => ({
        ...prev,
        [selectedAgent]: updatedMessages
      }));

      saveConversation(updatedMessages, selectedAgent);
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full bg-[#1e1e1e]">
        <AppSidebar 
          conversationHistory={conversationHistory}
          onLoadConversation={loadConversation}
          currentAgent={selectedAgent || 1}
        />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
            {/* Header com botão do histórico */}
            <header className="p-4 border-b border-[#2a2a2a] flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              >
                <History className="h-4 w-4 mr-2" />
                Histórico
              </Button>
              {selectedAgent && (
                <div className="text-gray-400 text-sm">
                  Conversando com {agentsData.find(a => a.id === selectedAgent)?.title}
                </div>
              )}
            </header>

            {/* Tela inicial ou área de chat */}
            {!selectedAgent ? (
              // Tela inicial com seleção de agentes
              <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-6xl mx-auto text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Escolha seu Assistente IA
                  </h1>
                  <p className="text-gray-400 mb-12 text-lg">
                    Selecione o agente ideal para sua necessidade
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center">
                    {agentsData.map((agent) => (
                      <AgentButton
                        key={agent.id}
                        agentNumber={agent.id}
                        title={agent.title}
                        description={agent.description}
                        icon={agent.icon}
                        isSelected={false}
                        onClick={() => handleAgentSelect(agent.id)}
                      />
                    ))}
                  </div>
                </div>
              </main>
            ) : (
              // Área do chat quando um agente está selecionado
              <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <ChatArea
                  messages={conversations[selectedAgent]}
                  agentNumber={selectedAgent}
                  onSendMessage={handleSendMessage}
                />
              </main>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
