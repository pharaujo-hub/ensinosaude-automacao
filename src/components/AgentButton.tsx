import React from 'react';

interface AgentButtonProps {
  agentNumber: number;
  isSelected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: string;
}

const AgentButton: React.FC<AgentButtonProps> = ({ 
  agentNumber, 
  isSelected, 
  onClick, 
  title, 
  description, 
  icon 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        agent-button p-6 rounded-2xl font-medium text-left
        shadow-xl backdrop-blur-sm w-full min-h-[140px] md:min-w-[280px] md:h-[140px]
        flex flex-col justify-between
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-600/40' 
          : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-white hover:shadow-2xl'
        }
        transition-all duration-300 ease-out
        border border-transparent
        ${isSelected ? 'border-blue-500/50' : 'hover:border-gray-600'}
        transform hover:scale-105
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <p className={`text-sm leading-relaxed ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
            {description}
          </p>
        </div>
      </div>
      
      {/* Footer com alinhamento consistente */}
      <div className="flex justify-between items-center mt-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          isSelected 
            ? 'bg-blue-500/30 text-blue-100' 
            : 'bg-gray-700 text-gray-400'
        }`}>
          Agente {agentNumber}
        </span>
        {isSelected && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>
    </button>
  );
};

export default AgentButton;