import { useState, useEffect } from 'react';
import './App.css';
import './styles/animations.css';
import { PromptManager } from './components/PromptManager';
import { ModuleSettings } from './components/ModuleSettings';
import { ModuleNavbar } from './components/ModuleNavbar';
import { Layers } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { modulesStorage, type Module } from '@/lib/storage/modules/modules';

// 修改View类型为字符串
type View = string;

// 主应用组件
function AppContent() {
  // 当前页面状态
  const [currentView, setCurrentView] = useState<View>('home');
  // 模块配置
  const [modules, setModules] = useState<Module[]>([]);

  // 加载模块配置
  useEffect(() => {
    modulesStorage.getWithDefault().then(setModules);
    const unwatch = modulesStorage.watch(setModules);
    return () => unwatch();
  }, []);

  // 渲染特定模块
  const renderModule = (moduleId: string) => {
    switch (moduleId) {
      case 'prompt-manager':
        return <PromptManager />;
      case 'moduleSettings':
        return <ModuleSettings onClose={() => setCurrentView('home')} />;
      default:
        return null;
    }
  };

  // 获取已启用的模块列表
  const enabledModules = modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  // 如果有启用的模块且当前是主页，更新currentView为第一个模块
  useEffect(() => {
    if (enabledModules.length > 0 && currentView === 'home') {
      setCurrentView(enabledModules[0].id);
    }
  }, [enabledModules, currentView]);

  // 渲染当前模块内容
  const renderContent = () => {
    if (currentView === 'moduleSettings') {
      return renderModule('moduleSettings');
    }

    const moduleToRender = modules.find(m => m.id === currentView);
    if (moduleToRender) {
      return renderModule(moduleToRender.id);
    }

    // 如果没有启用的模块，显示欢迎页面
    return (
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="max-w-[280px] space-y-8">
            <div className="space-y-3">
              <p className="text-lg leading-relaxed tracking-wide text-blue-500/80 dark:text-blue-400/80">
                智慧不在于掌握知识，而在于懂得如何运用它
              </p>
              <p className="text-sm italic tracking-wider text-blue-500/50 dark:text-blue-400/50 text-right">
                — 苏格拉底
              </p>
            </div>
            <p className="text-xs tracking-wide text-blue-500/40 dark:text-blue-400/40">
              点击右上角，开启你的探索之旅
            </p>
          </div>
        </div>
        <div className="w-full p-4 border-t border-gray-200/5 dark:border-gray-200/5 bg-white/20 dark:bg-gray-900/20 backdrop-blur-[2px]">
          <p className='text-xs text-center text-blue-500/60 dark:text-blue-400/60 hover:text-blue-500/80 dark:hover:text-blue-400/80 transition-colors'>
            Version 1.0.0 - Made with ❤️
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col w-[320px] h-[600px] bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-200'>
      {/* 模块导航栏 */}
      <ModuleNavbar 
        currentModuleId={currentView} 
        onModuleChange={setCurrentView}
      />
      
      {/* 模块内容区域 */}
      <div className='flex-1 min-h-0'>
        {renderContent()}
      </div>
    </div>
  );
}

// 根组件
function App() {
  return (
    <ThemeProvider>
      <div className="relative w-[320px] h-[600px] overflow-hidden">
        <AuroraBackground className="absolute inset-0 !h-full">
          <div className="relative z-10 w-full h-full">
            <AppContent />
          </div>
        </AuroraBackground>
      </div>
    </ThemeProvider>
  );
}

export default App;
