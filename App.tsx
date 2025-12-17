import React, { useState, useEffect, useRef } from 'react';
import AddModal from './components/AddModal';
import ExportModal from './components/ExportModal';
import { NavItem } from './types';

// 本地存储的 Key
const STORAGE_KEY = 'sys_upgrade_nav_data_v1';

// 用户指定的固定数据
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
    "id": "1765869420209",
    "url": "https://wangongshenhe.pages.dev/",
    "title": "完工审核页",
    "timestamp": 1765869420209
  },
  {
    "id": "3",
    "url": "https://dingdanguanli1.pages.dev/",
    "title": "订单管理页",
    "timestamp": 1715000000000
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
    "id": "1765877066685",
    "url": "https://shifuheimindan.pages.dev/",
    "title": "师傅黑名单页",
    "timestamp": 1765877066685
  },
  {
    "id": "1765938309622",
    "url": "https://dingdanshouku.pages.dev/",
    "title": "订单收款页",
    "timestamp": 1765938309622
  },
  {
    "id": "1765938335682",
    "url": "https://baocuodingdan.pages.dev/",
    "title": "报错订单页",
    "timestamp": 1765938335682
  },
  {
    "id": "1765938358648",
    "url": "https://zhipaidingdan1.pages.dev/",
    "title": "直派订单页",
    "timestamp": 1765938358648
  },
  {
    "id": "1765938389055",
    "url": "https://paidanyeji.pages.dev/",
    "title": "派单业绩",
    "timestamp": 1765938389055
  },
  {
    "id": "1765939188488",
    "url": "https://yuanshidingdan.pages.dev/",
    "title": "原始订单页",
    "timestamp": 1765939188488
  },
  {
    "id": "1765939498767",
    "url": "https://changqidingdan.pages.dev/",
    "title": "长期订单页",
    "timestamp": 1765939498767
  },
  {
    "id": "1765939589456",
    "url": "https://zhuanpaijilu.pages.dev/",
    "title": "转派记录页",
    "timestamp": 1765939589456
  },
  {
    "id": "1765940326326",
    "url": "https://paidanjilu.pages.dev/",
    "title": "派单记录页",
    "timestamp": 1765940326326
  },
  {
    "id": "1765941266543",
    "url": "https://diyuxiangmujiage.pages.dev/",
    "title": "地域项目价格页",
    "timestamp": 1765941266543
  },
  {
    "id": "1765941721016",
    "url": "https://haopingfanxian.pages.dev/",
    "title": "好评返现",
    "timestamp": 1765941721016
  },
  {
    "id": "1765941888712",
    "url": "https://ludanjiage.pages.dev/",
    "title": "录单价格页",
    "timestamp": 1765941888712
  },
  {
    "id": "1765943337256",
    "url": "https://yonghuheimingdan.pages.dev/",
    "title": "用户黑名单",
    "timestamp": 1765943337256
  },
  {
    "id": "1765950001916",
    "url": "https://baojiaye.pages.dev/",
    "title": "报价页",
    "timestamp": 1765950001916
  }
];

const App: React.FC = () => {
  // 1. 初始化状态：优先尝试从本地存储读取
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

  // 默认激活第一个链接
  const [activeUrl, setActiveUrl] = useState<string | null>(() => {
    if (items && items.length > 0) return items[0].url;
    return null;
  });

  // 监听 items 变化，如果 activeUrl 为空则自动设置第一个
  useEffect(() => {
    if (!activeUrl && items.length > 0) {
      setActiveUrl(items[0].url);
    }
  }, [items]);

  const [isLoading, setIsLoading] = useState(false);
  
  // 检查是否有本地缓存
  const hasLocalData = !!localStorage.getItem(STORAGE_KEY);
  const hasUserChanges = useRef(hasLocalData);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
      // 如果本地有缓存，优先使用缓存
      if (localStorage.getItem(STORAGE_KEY)) {
        return;
      }
      const serverData = await fetchServerData();
      if (serverData) {
        setItems(serverData);
      }
    };
    initData();
  }, []);

  // 统一的数据保存方法
  const persistChanges = (newItems: NavItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    hasUserChanges.current = true;
  };

  // 强制重置为服务器版本
  const handleResetToServer = async () => {
    if (window.confirm('确定要丢弃本地修改并恢复默认配置吗？')) {
      localStorage.removeItem(STORAGE_KEY);
      hasUserChanges.current = false;
      
      const serverData = await fetchServerData();
      if (serverData) {
        setItems(serverData);
      } else {
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
    // 如果删除的是当前选中的项，重置 activeUrl
    if (items.find(i => i.id === id)?.url === activeUrl) {
      if (newItems.length > 0) setActiveUrl(newItems[0].url);
      else setActiveUrl(null);
    }
  };

  const handleEditClick = (item: NavItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // 布局结构：
  // 1. Header (h-10)
  // 2. Body (Flex Row)
  //    2.1 Sidebar (w-28, reduced from w-32)
  //    2.2 Content (Iframe)
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 font-sans">
        {/* 1. Header Section */}
        <header className="flex items-center justify-between px-4 bg-slate-900 text-white shrink-0 h-10 shadow-md z-30">
            {/* Title */}
            <div className="font-bold text-sm tracking-wide truncate">
                急修到家系统升级优化
            </div>
            
            {/* Right Side Buttons */}
            <div className="flex items-center gap-2">
                 <button 
                    onClick={handleResetToServer}
                    className="flex items-center gap-1 px-2 py-1 border border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-all"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                     <span>重置/刷新</span>
                 </button>

                 <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition-all"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                     <span>生成部署配置</span>
                 </button>
            </div>
        </header>

        {/* 2. Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Width reduced to w-28 */}
            <aside className="w-28 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ul className="py-0">
                        {items.map((item) => (
                            <li key={item.id} className="relative group border-b border-gray-200 last:border-0">
                                <button
                                    onClick={() => setActiveUrl(item.url)}
                                    className={`w-full text-left px-2 py-3 text-xs font-medium transition-all border-l-2 ${
                                        activeUrl === item.url 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                        : 'border-transparent text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="truncate" title={item.title}>{item.title}</div>
                                </button>
                                
                                {/* Edit/Delete Actions (Hover only) - Scaled down for smaller sidebar */}
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded shadow-sm p-0.5">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                                        className="p-0.5 text-slate-400 hover:text-blue-500 rounded"
                                        title="编辑"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                                        className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                                        title="删除"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Initialize Module Button (Fixed at bottom of sidebar) */}
                <div className="p-2 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setIsModalOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="truncate">初始化模块</span>
                    </button>
                </div>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 relative bg-slate-100 h-full w-full">
                {activeUrl ? (
                    <iframe 
                        src={activeUrl} 
                        className="absolute inset-0 w-full h-full border-none bg-white"
                        title="Content Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-presentation"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>请选择左侧导航项目</p>
                    </div>
                )}
            </main>
        </div>

        {/* Modals */}
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