import { useState } from 'react';
import './App.css';
import { PromptManager } from './components/PromptManager';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  MessageSquarePlus,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import { AuroraBackground } from '@/components/ui/aurora-background';

// 主应用组件
function AppContent() {
  // 当前页面状态
  const [currentView, setCurrentView] = useState<'home' | 'promptManager'>('home');
  // 使用主题上下文
  const { isDark, toggleTheme } = useTheme();

  // 返回主页
  const handleBack = () => {
    setCurrentView('home');
  };

  if (currentView === 'promptManager') {
    return (
      <div className="relative">
        <PromptManager onBack={handleBack} />
      </div>
    );
  }

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
            aria-label="打开设置"
          >
            <Settings className='h-5 w-5' />
          </Button>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className='flex-1 p-4 space-y-4 overflow-y-auto'>
        {/* 功能导航区 */}
        <nav aria-label="主要功能">
          <ul className='grid grid-cols-2 gap-4'>
            <li>
              <Button
                variant="outline"
                className='w-full h-32 flex flex-col items-center justify-center gap-2 group hover:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20'
                onClick={() => setCurrentView('promptManager')}
                aria-label="进入提示词管理"
              >
                <MessageSquarePlus className='h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform' />
                <span className='text-sm font-medium'>提示词管理</span>
              </Button>
            </li>
            <li>
              <Button
                variant="outline"
                className='w-full h-32 flex flex-col items-center justify-center gap-2 group hover:border-purple-500 dark:border-gray-700/50 dark:hover:border-purple-500 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20'
                aria-label="开始 AI 对话"
              >
                <Sparkles className='h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform' />
                <span className='text-sm font-medium'>AI 对话</span>
              </Button>
            </li>
          </ul>
        </nav>

        {/* 最近使用区域 */}
        <section aria-labelledby="recent-prompts-heading">
          <h2 
            id="recent-prompts-heading" 
            className='text-sm font-medium text-gray-800 dark:text-gray-200'
          >
            最近使用
          </h2>
          <ul className='mt-3 space-y-2'>
            <li>
              <Button
                variant="ghost"
                className='w-full justify-start text-left h-auto py-2 px-3 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20'
                aria-label="使用翻译助手提示词"
              >
                <article>
                  <h3 className='font-medium'>翻译助手</h3>
                  <p className='text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-1'>
                    请将以下内容翻译成中文，要准确、地道...
                  </p>
                </article>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className='w-full justify-start text-left h-auto py-2 px-3 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20'
                aria-label="使用代码优化提示词"
              >
                <article>
                  <h3 className='font-medium'>代码优化</h3>
                  <p className='text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-1'>
                    请帮我优化以下代码，使其更加简洁高效...
                  </p>
                </article>
              </Button>
            </li>
          </ul>
        </section>
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
          <div className="relative z-10 w-full h-full bg-white/[0.5] dark:bg-zinc-900/[0.6] backdrop-blur-[1px]">
            <AppContent />
          </div>
        </AuroraBackground>
      </div>
    </ThemeProvider>
  );
}

export default App;
