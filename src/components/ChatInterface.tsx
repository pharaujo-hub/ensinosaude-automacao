import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import AgentButton from './AgentButton';
import ChatArea from './ChatArea';
import { Button } from '@/components/ui/button';
import { History, ArrowLeft } from 'lucide-react';

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
  webhookUrl: string;
}

const ChatInterface = () => {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Record<number, Message[]>>({
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string;
    title: string;
    agentId: number;
    lastMessage: string;
    timestamp: Date;
    messages: Message[];
  }>>([]);
  
  // Estado para armazenar os IDs de sessão únicos para cada agente
  const [sessionIds, setSessionIds] = useState<Record<number, string>>({});

  const agentsData: AgentData[] = [
    {
      id: 1,
      title: "Gerador de Reels",
      description: "Especializado em criar roteiros e ideias para reels virais no Instagram.",
      icon: "🎬",
      webhookUrl: "https://n8n-n8n-start.u6yj1s.easypanel.host/webhook/gerador-reels"
    },
    {
      id: 2,
      title: "Gerador Raiz",
      description: "Focado em conteúdo autêntico e conectado com as raízes da marca.",
      icon: "🌱",
      webhookUrl: "https://n8n-n8n-start.u6yj1s.easypanel.host/webhook/gerador-raiz"
    },
    {
      id: 3,
      title: "Gerador Aquecimento",
      description: "Cria conteúdo para aquecer a audiência antes de vendas e lançamentos.",
      icon: "🔥",
      webhookUrl: "https://n8n-n8n-start.u6yj1s.easypanel.host/webhook/gerador-aquecimento"
    },
    {
      id: 4,
      title: "Gerador de Criativos",
      description: "Desenvolve peças criativas inovadoras para campanhas publicitárias.",
      icon: "🎨",
      webhookUrl: "https://n8nwebhook.n8n-n8n-start.u81uve.easypanel.host/webhook/gerador-criativos"
    }
  ];

  // Função para gerar um ID único de sessão
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Função para obter ou criar um ID de sessão para um agente
  const getSessionId = (agentId: number) => {
    if (!sessionIds[agentId]) {
      const newSessionId = generateSessionId();
      setSessionIds(prev => ({
        ...prev,
        [agentId]: newSessionId
      }));
      return newSessionId;
    }
    return sessionIds[agentId];
  };

  const handleAgentSelect = (agentNumber: number) => {
    setSelectedAgent(agentNumber);
    // Garantir que existe um session ID para este agente
    getSessionId(agentNumber);
  };

  const handleBackToAgents = () => {
    setSelectedAgent(null);
  };

  // Função para iniciar uma nova conversa (gera novo session ID)
  const startNewConversation = (agentId: number) => {
    const newSessionId = generateSessionId();
    setSessionIds(prev => ({
      ...prev,
      [agentId]: newSessionId
    }));
    
    // Limpar mensagens da conversa atual
    setConversations(prev => ({
      ...prev,
      [agentId]: []
    }));
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
    
    // Gerar novo session ID para a conversa carregada
    startNewConversation(conversation.agentId);
    
    setSidebarOpen(false);
  };

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!selectedAgent) return;

    const selectedAgentData = agentsData.find(agent => agent.id === selectedAgent);
    if (!selectedAgentData) return;

    // Obter o session ID para este agente
    const sessionId = getSessionId(selectedAgent);

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
      console.log(`Enviando mensagem para ${selectedAgentData.title}:`, message);
      console.log(`URL do webhook: ${selectedAgentData.webhookUrl}`);
      console.log(`Session ID: ${sessionId}`);

      const response = await fetch(selectedAgentData.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message,
          id: sessionId
        })
      });

      let agentResponse = 'Desculpe, não consegui processar sua mensagem no momento.';
      
      if (response.ok) {
        try {
          // Primeiro, tenta fazer parse como JSON
          const data = await response.json();
          console.log('Resposta completa do n8n (JSON):', data);
          
          // Verifica se é um array e pega o primeiro item
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
            
            // Verifica se tem a propriedade 'output'
            if (firstItem.output !== undefined) {
              agentResponse = String(firstItem.output);
            }
            // Verifica outras propriedades possíveis
            else if (firstItem.response !== undefined) {
              agentResponse = String(firstItem.response);
            }
            else if (firstItem.message !== undefined) {
              agentResponse = String(firstItem.message);
            }
            // Se for string diretamente
            else if (typeof firstItem === 'string') {
              agentResponse = firstItem;
            }
            // Fallback: usar o objeto completo como string
            else {
              agentResponse = JSON.stringify(firstItem);
            }
          }
          // Se não for array, verifica propriedades diretamente
          else if (data && typeof data === 'object') {
            if (data.output !== undefined) {
              agentResponse = String(data.output);
            }
            else if (data.response !== undefined) {
              agentResponse = String(data.response);
            }
            else if (data.message !== undefined) {
              agentResponse = String(data.message);
            }
            else {
              agentResponse = JSON.stringify(data);
            }
          }
          // Se for string diretamente
          else if (typeof data === 'string') {
            agentResponse = data;
          }
          // Fallback final
          else {
            agentResponse = JSON.stringify(data);
          }
          
        } catch (jsonError) {
          // Se não conseguir fazer parse como JSON, tenta como texto
          console.log('Resposta não é JSON válido, tentando como texto...');
          try {
            // Precisa fazer uma nova requisição pois o response já foi consumido
            const textResponse = await fetch(selectedAgentData.webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                message: message,
                id: sessionId
              })
            });
            
            agentResponse = await textResponse.text();
            console.log('Resposta como texto:', agentResponse);
          } catch (textError) {
            console.error('Erro ao obter resposta como texto:', textError);
            agentResponse = 'Erro ao processar resposta do servidor.';
          }
        }
      } else {
        console.error('Erro na resposta do webhook:', response.status, response.statusText);
        try {
          // Tenta obter a mensagem de erro exata do backend
          const errorText = await response.text();
          console.error('Texto do erro:', errorText);
          agentResponse = errorText || `Erro ${response.status}: ${response.statusText}`;
        } catch (errorParseError) {
          agentResponse = `Erro ${response.status}: ${response.statusText}`;
        }
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
      console.error('Erro ao enviar mensagem para o webhook:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
    <div className="min-h-screen flex w-full bg-[#1e1e1e]">
      {/* Sidebar - sempre renderizado */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-[#1e1e1e] border-r border-[#2a2a2a] transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-80
        ${sidebarOpen ? 'md:block' : 'md:hidden'}
      `}>
        <AppSidebar 
          conversationHistory={conversationHistory}
          onLoadConversation={loadConversation}
          currentAgent={selectedAgent || 1}
        />
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#1e1e1e] relative z-30">
          <div className="flex items-center gap-2">
            {/* Botão de histórico */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white hover:bg-[#2a2a2a] flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Button>
            
            {/* Botão voltar apenas quando agente está selecionado */}
            {selectedAgent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToAgents}
                className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}

            {/* Botão para nova conversa quando um agente está selecionado */}
            {selectedAgent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startNewConversation(selectedAgent)}
                className="text-gray-400 hover:text-white hover:bg-[#2a2a2a] ml-2"
              >
                Nova Conversa
              </Button>
            )}
          </div>
          
          {/* Nome do agente e Session ID quando selecionado */}
          {selectedAgent && (
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <span className="text-lg">
                {agentsData.find(a => a.id === selectedAgent)?.icon}
              </span>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <span>
                  {agentsData.find(a => a.id === selectedAgent)?.title}
                </span>
                <span className="text-xs text-gray-500">
                  ID: {sessionIds[selectedAgent]?.slice(-8)}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Conteúdo */}
        {!selectedAgent ? (
          // Tela inicial com seleção de agentes
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Escolha seu Gerador de Conteúdo IA
              </h1>
              <p className="text-gray-400 mb-12 text-lg">
                Selecione o agente ideal para criar seu conteúdo
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default ChatInterface;