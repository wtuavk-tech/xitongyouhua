import React from 'react';

interface AddCardProps {
  onClick: () => void;
}

const AddCard: React.FC<AddCardProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col h-48 bg-white border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md items-center justify-center cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all duration-300 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="mt-3 text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
        初始化模块
      </span>
    </button>
  );
};

export default AddCard;