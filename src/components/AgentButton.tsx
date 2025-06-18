
import React from 'react';

interface AgentButtonProps {
  agentNumber: number;
  isSelected: boolean;
  onClick: () => void;
}

const AgentButton: React.FC<AgentButtonProps> = ({ agentNumber, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        agent-button px-6 py-3 rounded-full font-medium text-sm
        shadow-lg backdrop-blur-sm
        ${isSelected 
          ? 'bg-blue-600 text-white shadow-blue-600/30' 
          : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-white'
        }
        transition-all duration-300 ease-out
        border border-transparent
        ${isSelected ? 'border-blue-500/50' : 'hover:border-gray-600'}
      `}
    >
      Agente {agentNumber}
    </button>
  );
};

export default AgentButton;
