
import React from 'react';
import { History, MessageSquare, Trash2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationHistoryItem {
  id: string;
  title: string;
  agentId: number;
  lastMessage: string;
  timestamp: Date;
  messages: any[];
}

interface AppSidebarProps {
  conversationHistory: ConversationHistoryItem[];
  onLoadConversation: (conversation: ConversationHistoryItem) => void;
  currentAgent: number;
}

export function AppSidebar({ conversationHistory, onLoadConversation, currentAgent }: AppSidebarProps) {
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
      1: 'Geral',
      2: 'Técnico',
      3: 'Criativo',
      4: 'Dados',
      5: 'Mentor'
    };
    return agentNames[agentId as keyof typeof agentNames] || `Agente ${agentId}`;
  };

  const getAgentIcon = (agentId: number) => {
    const agentIcons = {
      1: '🤖',
      2: '⚡',
      3: '🎨',
      4: '📊',
      5: '🌟'
    };
    return agentIcons[agentId as keyof typeof agentIcons] || '🤖';
  };

  return (
    <Sidebar className="border-r border-[#2a2a2a]">
      <SidebarHeader className="border-b border-[#2a2a2a] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-400" />
            <span className="font-semibold text-gray-200">Histórico</span>
          </div>
          <SidebarTrigger className="text-gray-400 hover:text-white" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wide">
            Conversas Recentes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <SidebarMenu>
                {conversationHistory.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Nenhuma conversa ainda
                  </div>
                ) : (
                  conversationHistory.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        onClick={() => onLoadConversation(conversation)}
                        className="flex flex-col items-start p-3 h-auto hover:bg-[#2a2a2a] rounded-lg group"
                      >
                        <div className="flex items-center gap-2 w-full mb-1">
                          <span className="text-sm">{getAgentIcon(conversation.agentId)}</span>
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
                            {getAgentName(conversation.agentId)}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-200 truncate w-full text-left">
                          {conversation.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate w-full text-left mt-1">
                          {conversation.lastMessage}
                        </p>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
