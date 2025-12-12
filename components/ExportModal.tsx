import React, { useState } from 'react';
import { NavItem } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: NavItem[];
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              系统部署配置
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">请复制下方代码以更新 GitHub 仓库</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto border border-slate-700 shadow-inner relative group">
             <pre>{jsonString}</pre>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">更新步骤：</p>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>点击下方<span className="text-blue-600 font-medium">“复制配置代码”</span>按钮。</li>
              <li>打开您的 GitHub 仓库，找到 <code className="bg-gray-200 px-1 rounded text-red-500 font-mono text-xs">nav-data.json</code> 文件。</li>
              <li>点击 GitHub 上的编辑图标（铅笔），全选原有内容并粘贴新代码。</li>
              <li>点击 <span className="text-green-600 font-medium">Commit changes</span> 提交修改。</li>
              <li>等待 Cloudflare 自动完成构建（约1-2分钟）。</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            关闭
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold shadow-lg rounded-lg transition-all transform active:scale-95 ${copied ? 'bg-green-600 shadow-green-500/30' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/30'}`}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已复制到剪贴板
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                复制配置代码
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;