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
      return `${days} dias atrás`;
    } else {
      return timestamp.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit'
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
    <div className="h-full flex flex-col bg-[#1e1e1e] border-r border-[#2a2a2a]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-400" />
            <span className="font-semibold text-gray-200">Histórico</span>
          </div>
          {conversationHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-1 h-auto"
              title="Limpar histórico"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">
            Conversas Recentes ({conversationHistory.length})
          </h3>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {conversationHistory.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Nenhuma conversa ainda
                  <p className="text-xs mt-2 text-gray-600">
                    Suas conversas aparecerão aqui
                  </p>
                </div>
              ) : (
                conversationHistory.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="group relative bg-[#2a2a2a]/50 rounded-lg p-3 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <button
                      onClick={() => onLoadConversation(conversation)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-2 w-full mb-2">
                        <span className="text-sm">{getAgentIcon(conversation.agentId)}</span>
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
                          {getAgentName(conversation.agentId)}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {formatTimestamp(conversation.timestamp)}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-200 truncate w-full text-left mb-1">
                        {conversation.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate w-full text-left">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">
                          {conversation.messages.length} mensagens
                        </span>
                        <span className="text-xs text-gray-600 font-mono">
                          {conversation.sessionId.slice(-6)}
                        </span>
                      </div>
                    </button>
                    
                    {/* Botão de deletar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/20 rounded text-gray-400 hover:text-red-400"
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
      </div>
    </div>
  );
}