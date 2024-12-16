import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Moon,
  Sun,
  Layers,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { modulesStorage, type Module } from '@/lib/storage/modules/modules';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleNavbarProps {
  currentModuleId: string;
  onModuleChange: (moduleId: string) => void;
}

export function ModuleNavbar({ currentModuleId, onModuleChange }: ModuleNavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const [modules, setModules] = useState<Module[]>([]);
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);

  // 加载模块配置
  useEffect(() => {
    modulesStorage.getWithDefault().then(setModules);
    const unwatch = modulesStorage.watch(setModules);
    return () => unwatch();
  }, []);

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  // 获取已启用的模块
  const enabledModules = modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  // 获取当前模块
  const currentModule = modules.find(m => m.id === currentModuleId);

  // 处理模块切换
  const handleModuleChange = (moduleId: string) => {
    setIsModuleMenuOpen(false);
    onModuleChange(moduleId);
  };

  // 渲染左侧内容
  const renderLeftContent = () => {
    // 在模块设置页面
    if (currentModuleId === 'moduleSettings') {
      return (
        <div className="flex items-center gap-2 animate-slide-in-left">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onModuleChange('home')}
            className="h-8 w-8 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">模块设置</span>
        </div>
      );
    }

    // 在主页
    if (currentModuleId === 'home') {
      return (
        <div className="animate-slide-in-left">
          <h1 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Prompt Craft
          </h1>
        </div>
      );
    }

    // 在具体模块页面
    return (
      <button
        onClick={() => setIsModuleMenuOpen(!isModuleMenuOpen)}
        className={cn(
          "flex items-center gap-2 px-2 h-8 rounded-md transition-colors animate-slide-in-left",
          "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
          "active:bg-gray-200/50 dark:active:bg-gray-700/50"
        )}
      >
        {currentModule && (
          <>
            {getIconComponent(currentModule.icon)}
            <span className="text-sm font-medium">{currentModule.name}</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      {/* 主导航栏 */}
      <div className={cn(
        "flex items-center justify-between h-12 px-3 backdrop-blur-md",
        currentModuleId === 'home'
          ? "bg-white/20 dark:bg-gray-900/20 border-b border-gray-200/5 dark:border-gray-200/5" // 主页时更加透明
          : "bg-white/60 dark:bg-gray-900/60 border-b border-gray-200/10 dark:border-gray-200/10" // 其他页面保持不变
      )}>
        {/* 左侧动态内容 */}
        <div className="flex-1 flex items-center min-w-0">
          {renderLeftContent()}
        </div>

        {/* 右侧工具按钮 */}
        <div className={cn(
          "flex items-center gap-1 ml-2",
          currentModuleId === 'home' && "opacity-75 hover:opacity-100 transition-opacity"
        )}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {currentModuleId !== 'moduleSettings' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onModuleChange('moduleSettings')}
              className="h-8 w-8"
            >
              <Layers className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 模块选择菜单 */}
      {isModuleMenuOpen && enabledModules.length > 0 && (
        <div 
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-1 mx-2 p-1",
            "rounded-lg shadow-lg backdrop-blur-md",
            "bg-white/80 dark:bg-gray-900/80",
            "border border-gray-200/20 dark:border-gray-700/20",
            "animate-slide-down"
          )}
        >
          {enabledModules.map(module => (
            <button
              key={module.id}
              onClick={() => handleModuleChange(module.id)}
              className={cn(
                "flex items-center w-full gap-2 px-3 h-9 rounded-md transition-colors",
                currentModuleId === module.id
                  ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400",
                "group"
              )}
            >
              {getIconComponent(module.icon)}
              <span className="flex-1 text-sm font-medium text-left">{module.name}</span>
              {currentModuleId === module.id && (
                <ChevronRight className="h-4 w-4 opacity-60" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 