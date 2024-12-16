import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GripVertical, Home } from 'lucide-react';
import * as Icons from 'lucide-react';
import { modulesStorage, type Module } from '@/lib/storage/modules/modules';

interface ModuleSettingsProps {
  onClose: () => void;
}

export function ModuleSettings({ onClose }: ModuleSettingsProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [draggedModule, setDraggedModule] = useState<Module | null>(null);
  const [dragOverModuleId, setDragOverModuleId] = useState<string | null>(null);

  // 加载模块配置
  useEffect(() => {
    modulesStorage.getWithDefault().then(setModules);
    const unwatch = modulesStorage.watch(setModules);
    return () => unwatch();
  }, []);

  // 保存模块配置
  const saveModules = async (newModules: Module[]) => {
    await modulesStorage.set(newModules);
    setModules(newModules);
  };

  // 切换模块启用状态
  const toggleModule = (moduleId: string) => {
    const newModules = modules.map(m => {
      if (m.id === moduleId) {
        // 如果是启用模块，将其添加到已启用列表的最后
        const maxOrder = Math.max(...modules.filter(mod => mod.enabled).map(mod => mod.order), -1);
        return { 
          ...m, 
          enabled: !m.enabled,
          order: !m.enabled ? maxOrder + 1 : m.order 
        };
      }
      return m;
    });
    saveModules(newModules);
  };

  // 处理拖拽开始
  const handleDragStart = (module: Module) => {
    setDraggedModule(module);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedModule(null);
    setDragOverModuleId(null);
  };

  // 处理拖拽经过
  const handleDragOver = (e: React.DragEvent, moduleId: string) => {
    e.preventDefault();
    if (draggedModule?.id !== moduleId) {
      setDragOverModuleId(moduleId);
    }
  };

  // 处理拖拽离开
  const handleDragLeave = () => {
    setDragOverModuleId(null);
  };

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent, targetModule: Module) => {
    e.preventDefault();
    if (!draggedModule || draggedModule.id === targetModule.id) return;

    const newModules = [...modules];
    const draggedIndex = newModules.findIndex(m => m.id === draggedModule.id);
    const targetIndex = newModules.findIndex(m => m.id === targetModule.id);

    // 更新顺序
    newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, draggedModule);

    // 重新计算 order
    newModules
      .filter(m => m.enabled)
      .forEach((m, index) => {
        m.order = index;
      });

    saveModules(newModules);
    setDragOverModuleId(null);
  };

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const enabledModules = modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  const disabledModules = modules
    .filter(m => !m.enabled)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      {/* 头部 */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200/10">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onClose}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="flex-1 font-medium">模块设置</h2>
      </div>

      {/* 内容区 */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">已启用的模块</h3>
          <div className="space-y-2">
            {enabledModules.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 border border-dashed rounded-lg">
                还没有启用任何模块
              </div>
            ) : (
              enabledModules.map((module, index) => (
                <div
                  key={module.id}
                  className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border rounded-lg cursor-move transition-colors
                    ${dragOverModuleId === module.id ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200/50 dark:border-gray-700/50'}
                    ${draggedModule?.id === module.id ? 'opacity-50' : 'opacity-100'}
                    ${index === 0 ? 'relative' : ''}
                  `}
                  draggable
                  onDragStart={() => handleDragStart(module)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, module.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, module)}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-violet-400/90 to-indigo-500/90 backdrop-blur-sm rounded-full ring-[1.5px] ring-white dark:ring-gray-900 shadow-lg flex items-center justify-center group transition-all hover:scale-110">
                      <Home className="w-3 h-3 text-white/90 stroke-[2.5px]" />
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/90 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-md shadow-lg -top-8 right-0 whitespace-nowrap">
                        默认主页模块
                      </div>
                    </div>
                  )}
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                  {getIconComponent(module.icon)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{module.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{module.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModule(module.id)}
                    className="shrink-0 hover:text-red-500 dark:hover:text-red-400"
                  >
                    禁用
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">可用模块</h3>
          <div className="space-y-2">
            {disabledModules.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 border border-dashed rounded-lg">
                没有更多可用模
              </div>
            ) : (
              disabledModules.map(module => (
                <div
                  key={module.id}
                  className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg"
                >
                  {getIconComponent(module.icon)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{module.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{module.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModule(module.id)}
                    className="shrink-0 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    启用
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 