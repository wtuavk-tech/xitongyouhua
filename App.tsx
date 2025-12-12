import React, { useState, useEffect } from 'react';
import NavCard from './components/NavCard';
import AddCard from './components/AddCard';
import AddModal from './components/AddModal';
import ExportModal from './components/ExportModal';
import { NavItem } from './types';

const App: React.FC = () => {
  const [items, setItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);

  // Load data from JSON file on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to fetch the configuration file from the public root
        const response = await fetch('/nav-data.json');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error("Failed to load config, using empty state");
          setItems([]);
        }
      } catch (e) {
        console.error("Error loading nav-data.json", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveItem = (url: string, title: string) => {
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, url, title } 
          : item
      ));
    } else {
      const newItem: NavItem = {
        id: Date.now().toString(),
        url,
        title,
        timestamp: Date.now(),
      };
      setItems(prev => [...prev, newItem]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (item: NavItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveItem = (dragIndex: number, hoverIndex: number) => {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    setItems(newItems);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Iframe Overlay View
  if (activeUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col h-screen w-screen overflow-hidden font-sans">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm shrink-0 z-50 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveUrl(null)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>返回导航</span>
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <span className="text-gray-500 text-sm truncate max-w-xl">{activeUrl}</span>
          </div>
          <div className="text-sm font-bold text-slate-800">
            急修到家
          </div>
        </div>
        <div className="flex-1 relative bg-white">
           <iframe 
             src={activeUrl} 
             className="absolute inset-0 w-full h-full border-none"
             title="Preview Content"
             sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-presentation"
           />
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-dash-bg font-sans text-dash-text p-4 md:p-8">
      <main className="container mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
           
           <div className="relative z-10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-100 border border-red-500/30 text-[10px] font-semibold">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                       重要公告
                    </div>
                    
                    {/* Admin Action */}
                    <button 
                      onClick={() => setIsExportModalOpen(true)}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                       <span>生成部署配置</span>
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                        急修到家系统升级优化
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-4xl mt-2 opacity-80">
                        所有系统节点已在后台完成同步。编辑内容后，请点击右上角“生成部署配置”以更新线上版本。
                        </p>
                    </div>
                </div>
              </div>
           </div>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item, index) => (
              <NavCard 
                key={item.id} 
                index={index}
                item={item} 
                onDelete={handleDeleteItem} 
                onEdit={handleEditClick}
                onMove={handleMoveItem}
                onClick={setActiveUrl}
              />
            ))}
            <AddCard onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }} />
          </div>
        )}
      </main>

      <div className="text-center py-8 text-xs text-slate-400">
         SYS.VER.4.0.3 © 2025 急修到家技术部
      </div>

      <AddModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSaveItem}
        initialValues={editingItem ? { title: editingItem.title, url: editingItem.url } : undefined}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={items}
      />
    </div>
  );
};

export default App;