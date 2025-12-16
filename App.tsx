import React, { useState, useEffect, useRef } from 'react';
import NavCard from './components/NavCard';
import AddCard from './components/AddCard';
import AddModal from './components/AddModal';
import ExportModal from './components/ExportModal';
import { NavItem } from './types';

// 本地存储的 Key
const STORAGE_KEY = 'sys_upgrade_nav_data_v1';

// 用户指定的固定数据 - 共10个板块
const DEFAULT_DATA: NavItem[] = [
  {
    "id": "home-nav",
    "url": "https://gerendaohang.pages.dev/",
    "title": "首页导航",
    "timestamp": 1715000000001
  },
  {
    "id": "dispatcher",
    "url": "https://paidanyuan.pages.dev/",
    "title": "派单员页",
    "timestamp": 1715000000002
  },
  {
    "id": "3",
    "url": "https://dingdanguanli1.pages.dev/",
    "title": "订单管理页",
    "timestamp": 1715000000000
  },
  {
    "id": "4",
    "url": "https://shouhouguanli.pages.dev/",
    "title": "售后管理页",
    "timestamp": 1715000000000
  },
  {
    "id": "5",
    "url": "https://ludandating.pages.dev/",
    "title": "录单大厅",
    "timestamp": 1765770834252
  },
  {
    "id": "1765846048371",
    "url": "https://danku-59j.pages.dev/",
    "title": "单库页",
    "timestamp": 1765846048371
  },
  {
    "id": "1765863229413",
    "url": "https://paidanyuanshuju1.pages.dev/",
    "title": "派单员数据分析",
    "timestamp": 1765863229413
  },
  {
    "id": "1765865340448",
    "url": "https://shifuluru.pages.dev/",
    "title": "师傅录入",
    "timestamp": 1765865340448
  },
  {
    "id": "1765869420209",
    "url": "https://wangongshenhe.pages.dev/",
    "title": "完工审核页",
    "timestamp": 1765869420209
  },
  {
    "id": "1765877066685",
    "url": "https://shifuheimindan.pages.dev/",
    "title": "师傅黑名单页",
    "timestamp": 1765877066685
  }
];

const App: React.FC = () => {
  // 1. 初始化状态：优先尝试从本地存储读取
  // 如果没有本地缓存，直接使用 DEFAULT_DATA (代码中固定的10个板块)
  const [items, setItems] = useState<NavItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("读取本地缓存失败", e);
    }
    return DEFAULT_DATA; 
  });

  const [isLoading, setIsLoading] = useState(false);
  
  // 检查是否有本地缓存
  const hasLocalData = !!localStorage.getItem(STORAGE_KEY);
  const hasUserChanges = useRef(hasLocalData);
  const [showUnsavedBadge, setShowUnsavedBadge] = useState(hasLocalData);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);

  // 加载数据的方法
  const fetchServerData = async () => {
    try {
      setIsLoading(true);
      // 添加时间戳防止缓存
      const response = await fetch(`/nav-data.json?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.error("加载配置失败", e);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  // 首次加载逻辑
  useEffect(() => {
    const initData = async () => {
      // 如果本地有缓存，优先使用缓存（防止刷新丢失新增内容）
      if (localStorage.getItem(STORAGE_KEY)) {
        console.log("检测到本地修改，保留用户数据");
        return;
      }

      // 如果没有本地缓存，尝试从服务器更新（虽然DEFAULT_DATA已经有数据了，但保持同步是个好习惯）
      // 这里如果服务器fetch失败，页面依然会显示 DEFAULT_DATA
      const serverData = await fetchServerData();
      if (serverData) {
        setItems(serverData);
      }
    };
    initData();
  }, []);

  // 统一的数据保存方法：更新状态 + 写入本地存储
  const persistChanges = (newItems: NavItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    hasUserChanges.current = true;
    setShowUnsavedBadge(true);
  };

  // 强制重置为服务器版本（解决“更新了GitHub但本地还是旧版”的问题）
  const handleResetToServer = async () => {
    if (window.confirm('确定要丢弃本地修改并恢复默认配置吗？')) {
      localStorage.removeItem(STORAGE_KEY);
      hasUserChanges.current = false;
      setShowUnsavedBadge(false);
      
      const serverData = await fetchServerData();
      if (serverData) {
        setItems(serverData);
      } else {
        // 如果 fetch 失败，回退到代码里的默认数据
        setItems(DEFAULT_DATA);
      }
    }
  };

  const handleSaveItem = (url: string, title: string) => {
    let newItems;
    if (editingItem) {
      newItems = items.map(item => 
        item.id === editingItem.id ? { ...item, url, title } : item
      );
    } else {
      const newItem: NavItem = {
        id: Date.now().toString(),
        url,
        title,
        timestamp: Date.now(),
      };
      newItems = [...items, newItem];
    }
    persistChanges(newItems);
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    persistChanges(newItems);
  };

  const handleMoveItem = (dragIndex: number, hoverIndex: number) => {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    persistChanges(newItems);
  };

  const handleEditClick = (item: NavItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Iframe 预览视图
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

  // 主界面
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
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-100 border border-red-500/30 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        重要公告
                      </div>
                      {showUnsavedBadge && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-100 border border-yellow-500/30 text-[10px] font-semibold animate-fade-in">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          有未保存修改
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                       {/* Reset Button */}
                       <button 
                        onClick={handleResetToServer}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-all"
                        title="放弃本地修改，重新加载服务器配置"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                         <span className="hidden sm:inline">重置/刷新</span>
                      </button>

                      {/* Export Button */}
                      <button 
                        onClick={() => setIsExportModalOpen(true)}
                        className={`group flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-md ${showUnsavedBadge ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-100 animate-pulse' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${showUnsavedBadge ? 'text-white' : 'text-yellow-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                         <span>{showUnsavedBadge ? '点击保存配置' : '生成部署配置'}</span>
                      </button>
                    </div>
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

        {/* Loading State - only show if items are empty, which is unlikely now */}
        {isLoading && items.length === 0 && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-slate-200"></div>
              ))}
           </div>
        )}

        {/* Grid Section */}
        {items.length > 0 && (
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
         SYS.VER.4.1.5 © 2025 急修到家技术部
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