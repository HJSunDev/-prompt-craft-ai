import { useState, useEffect } from 'react';
import './App.css';
import { PromptManager } from './components/PromptManager';
import { ModuleSettings } from './components/ModuleSettings';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  MessageSquarePlus,
  Sparkles,
  Moon,
  Sun,
  Layers
} from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { modulesStorage, type Module } from '@/lib/storage/modules/modules';
import * as Icons from 'lucide-react';

type View = 'home' | 'promptManager' | 'moduleSettings';

// 主应用组件
function AppContent() {
  // 当前页面状态
  const [currentView, setCurrentView] = useState<View>('home');
  // 使用主题上下文
  const { isDark, toggleTheme } = useTheme();
  // 模块配置
  const [modules, setModules] = useState<Module[]>([]);

  // 加载模块配置
  useEffect(() => {
    modulesStorage.getWithDefault().then(setModules);
    const unwatch = modulesStorage.watch(setModules);
    return () => unwatch();
  }, []);

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-8 w-8" /> : null;
  };

  // 返回主页
  const handleBack = () => {
    setCurrentView('home');
  };

  // 渲染特定模块
  const renderModule = (moduleId: string) => {
    switch (moduleId) {
      case 'prompt-manager':
        return <PromptManager onBack={handleBack} />;
      default:
        return null;
    }
  };

  if (currentView === 'moduleSettings') {
    return <ModuleSettings onClose={handleBack} />;
  }

  if (currentView !== 'home') {
    const moduleToRender = modules.find(m => m.id === currentView);
    if (moduleToRender) {
      return renderModule(moduleToRender.id);
    }
  }

  const enabledModules = modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className='flex flex-col w-[320px] h-[600px] bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-200'>
      {/* 页面头部 */}
      <header className='flex items-center justify-between p-4 border-b border-gray-200/10 backdrop-blur-md'>
        <h1 className='text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>
          Prompt Craft
        </h1>
        <div className='flex items-center gap-2'>
          {/* 暗模式切换按钮 */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
            className="hover:text-blue-500"
          >
            {isDark ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentView('moduleSettings')}
            aria-label="模块设置"
          >
            <Layers className='h-5 w-5' />
          </Button>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className='flex-1 p-4 space-y-4 overflow-y-auto'>
        {enabledModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="max-w-[240px] space-y-2">
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                开启你的 AI 之旅
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                点击右上角的模块设置，选择你需要的功能开始使用
              </p>
            </div>
          </div>
        ) : (
          <nav aria-label="功能模块">
            <ul className='grid grid-cols-2 gap-4'>
              {enabledModules.map(module => (
                <li key={module.id}>
                  <Button
                    variant="outline"
                    className='w-full h-32 flex flex-col items-center justify-center gap-2 group hover:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20'
                    onClick={() => setCurrentView(module.id as View)}
                    aria-label={`进入${module.name}`}
                  >
                    {getIconComponent(module.icon)}
                    <span className='text-sm font-medium'>{module.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>

      {/* 页面底部 */}
      <footer className='p-4 border-t border-gray-200/10 backdrop-blur-md'>
        <p className='text-xs text-center text-gray-700 dark:text-gray-300'>
          Version 1.0.0 - Made with ❤️
        </p>
      </footer>
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
