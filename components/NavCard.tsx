import React, { useState } from 'react';
import { NavItem } from '../types';

interface NavCardProps {
  item: NavItem;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (item: NavItem) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onClick: (url: string) => void;
}

const NavCard: React.FC<NavCardProps> = ({ item, index, onDelete, onEdit, onMove, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reliable screenshot service
  const previewUrl = `https://image.thum.io/get/width/400/crop/600/noanimate/${item.url}`;

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
       e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
       e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(dragIndex) && dragIndex !== index) {
      onMove(dragIndex, index);
    }
  };

  // Pastel Color Logic based on index
  const getTheme = (idx: number) => {
      const themes = [
          { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-900', sub: 'text-red-700/60', icon: 'text-red-400' },
          { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-900', sub: 'text-pink-700/60', icon: 'text-pink-400' },
          { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', sub: 'text-blue-700/60', icon: 'text-blue-400' },
          { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-900', sub: 'text-green-700/60', icon: 'text-green-400' },
          { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-900', sub: 'text-yellow-700/60', icon: 'text-yellow-400' },
          { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-900', sub: 'text-purple-700/60', icon: 'text-purple-400' },
      ];
      return themes[idx % themes.length];
  };

  const theme = getTheme(index);

  return (
    <div 
      className={`relative group flex flex-col h-48 rounded-2xl border ${theme.bg} ${theme.border} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-move`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action Buttons (visible on hover) */}
      <div className={`absolute top-2 right-2 z-20 flex gap-2 transition-all duration-200 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-full shadow-sm hover:text-blue-500 hover:bg-blue-50 transition-colors"
          aria-label="编辑项目"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-full shadow-sm hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="删除项目"
          onMouseDown={(e) => e.stopPropagation()} 
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Clickable Area */}
      <div 
        onClick={() => onClick(item.url)}
        className="flex-1 flex flex-col w-full h-full cursor-pointer"
      >
        {/* Top: Preview Image */}
        <div className="relative h-32 w-full overflow-hidden bg-white/50">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
          ) : (
            <img 
              src={previewUrl} 
              alt={`${item.title} 的预览`}
              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              onError={() => setImageError(true)}
            />
          )}
          {/* Subtle overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-${theme.bg.replace('bg-', '')} to-transparent opacity-50`}></div>
        </div>

        {/* Bottom: Text Label Area */}
        <div className="flex-1 flex flex-col justify-center px-4 pb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme.icon}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                 <span className={`text-base font-bold truncate ${theme.text}`}>
                  {item.title}
                </span>
            </div>
            <div className="text-center">
                 <span className={`text-xs ${theme.sub} truncate block`}>
                    {new URL(item.url).hostname}
                 </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NavCard;