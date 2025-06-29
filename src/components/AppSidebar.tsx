import React from 'react';
import { History, MessageSquare, Trash2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface ConversationHistoryItem {
  id: string;
  title: string;
  agentId: number;
  lastMessage: string;
  timestamp: Date;
  messages: any[];
  sessionId: string;
}

interface AppSidebarProps {
  conversationHistory: ConversationHistoryItem[];
  onLoadConversation: (conversation: ConversationHistoryItem) => void;
  onDeleteConversation: (conversationId: string) => void;
  onClearHistory: () => void;
  currentAgent: number;
}

export function AppSidebar({ 
  conversationHistory, 
  onLoadConversation, 
  onDeleteConversation,
  onClearHistory,
  currentAgent 
}: AppSidebarProps) {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Hoje';
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return timestamp.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit'
      });
    }
  };

  const getAgentName = (agentId: number) => {
    const agentNames = {
      1: 'Reels',
      2: 'Raiz',
      3: 'Aquecimento',
      4: 'Criativos'
    };
    return agentNames[agentId as keyof typeof agentNames] || `Agente ${agentId}`;
  };

  const getAgentIcon = (agentId: number) => {
    const agentIcons = {
      1: '🎬',
      2: '🌱',
      3: '🔥',
      4: '🎨'
    };
    return agentIcons[agentId as keyof typeof agentIcons] || '🤖';
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] border-r border-[#2a2a2a]/50">
      {/* Header minimalista */}
      <div className="p-4 border-b border-[#2a2a2a]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-300">Conversas</span>
          </div>
          {conversationHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-gray-500 hover:text-red-400 hover:bg-red-900/10 p-1.5 h-auto rounded-md transition-colors"
              title="Limpar histórico"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content com scroll customizado */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1">
            {conversationHistory.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#2a2a2a]/30 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Suas conversas<br />aparecerão aqui
                </p>
              </div>
            ) : (
              conversationHistory.map((conversation) => (
                <div
                  key={conversation.id}
                  className="group relative rounded-lg hover:bg-[#2a2a2a]/20 transition-all duration-200"
                >
                  <button
                    onClick={() => onLoadConversation(conversation)}
                    className="w-full text-left p-3 rounded-lg"
                  >
                    {/* Header da conversa */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{getAgentIcon(conversation.agentId)}</span>
                        <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-[#2a2a2a]/40 rounded text-[10px] font-medium">
                          {getAgentName(conversation.agentId)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 font-mono">
                        {formatTimestamp(conversation.timestamp)}
                      </span>
                    </div>
                    
                    {/* Título da conversa */}
                    <h4 className="text-sm text-gray-200 font-medium mb-1 line-clamp-1">
                      {conversation.title}
                    </h4>
                    
                    {/* Última mensagem */}
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                      {conversation.lastMessage}
                    </p>
                    
                    {/* Footer com informações */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        {conversation.messages.length} msgs
                      </span>
                      <span className="text-xs text-gray-600 font-mono opacity-60">
                        #{conversation.sessionId.slice(-4)}
                      </span>
                    </div>
                  </button>
                  
                  {/* Botão de deletar minimalista */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-red-900/20 rounded text-gray-500 hover:text-red-400"
                    title="Deletar conversa"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Footer minimalista */}
      {conversationHistory.length > 0 && (
        <div className="p-3 border-t border-[#2a2a2a]/30">
          <div className="text-xs text-gray-600 text-center">
            {conversationHistory.length} conversa{conversationHistory.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}