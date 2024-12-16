import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Copy, Edit, Trash2, Check } from 'lucide-react';
import { promptsStorage, type Prompt } from '@/lib/storage';
import { cn } from '@/lib/utils';

export function PromptManager() {
  // 提示词列表状态
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  // 搜索关键词状态
  const [searchKey, setSearchKey] = useState('');
  // 编辑状态
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  // 临时编辑数据
  const [editForm, setEditForm] = useState<Prompt | null>(null);
  // 复制状态管理
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // 定时器引用
  const copyTimeoutRef = useRef<NodeJS.Timeout>();

  // 加载提示词列表
  useEffect(() => {
    promptsStorage.getWithDefault().then(setPrompts);
    const unwatch = promptsStorage.watch(setPrompts);
    return () => unwatch();
  }, []);

  // 处理编辑
  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setEditForm({ ...prompt });
  };

  // 处理保存
  const handleSave = async () => {
    if (!editForm) return;
    
    const updatedPrompt = {
      ...editForm,
      updatedAt: Date.now()
    };

    // 如果是新增提示词
    if (!prompts.find(p => p.id === updatedPrompt.id)) {
      await promptsStorage.set([...prompts, updatedPrompt]);
    } else {
      // 如果是编辑已有提示词
      const newPrompts = prompts.map(p => 
        p.id === updatedPrompt.id ? updatedPrompt : p
      );
      await promptsStorage.set(newPrompts);
    }

    setEditingPrompt(null);
    setEditForm(null);
  };

  // 处理取消
  const handleCancel = () => {
    // 如果是新增状态（editingPrompt 存在但在 prompts 中不存在）
    if (editingPrompt && !prompts.find(p => p.id === editingPrompt.id)) {
      // 直接关闭编辑状态，不需要其他操作
      setEditingPrompt(null);
      setEditForm(null);
    } else {
      // 如果是编辑已有提示词，直接关闭编辑状态
      setEditingPrompt(null);
      setEditForm(null);
    }
  };

  // 编辑表单更新
  const updateForm = (field: keyof Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>, value: string) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      [field]: field === 'tags' ? value.split(',').map(t => t.trim()) : value
    });
  };

  // 处理添加新提示词
  const handleAdd = () => {
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      title: '新提示词',
      content: '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    // 直接进入编辑状态，不保存到存储中
    setEditingPrompt(newPrompt);
    setEditForm({ ...newPrompt });
  };

  // 处理删除提示词
  const handleDelete = async (id: string) => {
    const newPrompts = prompts.filter(p => p.id !== id);
    await promptsStorage.set(newPrompts);
  };

  // 过滤提示词
  const filteredPrompts = searchKey
    ? prompts.filter(p => 
        p.title.toLowerCase().includes(searchKey.toLowerCase()) ||
        p.content.toLowerCase().includes(searchKey.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchKey.toLowerCase()))
      )
    : prompts;

  // 处理复制
  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      
      // 清除之前的定时器
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      
      setCopiedId(prompt.id);
      // 设置新的定时器
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // 编辑视图
  if (editingPrompt) {
    return (
      <div className='flex flex-col h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md'>
        <div 
          className='flex-1 overflow-y-auto custom-scrollbar'
        >
          <div className='p-4 space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>标题</label>
              <Input
                value={editForm?.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="输入提示词标题"
                className="dark:bg-gray-800/50 dark:border-gray-700/50"
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>内容</label>
              <Textarea
                value={editForm?.content}
                onChange={(e) => updateForm('content', e.target.value)}
                placeholder="输入提示词内容"
                className="min-h-[300px] dark:bg-gray-800/50 dark:border-gray-700/50"
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>标签</label>
              <Input
                value={editForm?.tags.join(', ')}
                onChange={(e) => updateForm('tags', e.target.value)}
                placeholder="输入标签，用逗号分隔"
                className="dark:bg-gray-800/50 dark:border-gray-700/50"
              />
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="relative">
          {/* 分隔线 */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-gray-200/0 via-gray-200/30 to-gray-200/0 dark:from-gray-700/0 dark:via-gray-700/30 dark:to-gray-700/0" />
          
          <div className="px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="flex justify-end items-center gap-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                取消
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
                className="bg-blue-500/90 hover:bg-blue-600/90 text-white"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 列表视图
  return (
    <div className='flex flex-col h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md'>
      {/* 搜索栏 */}
      <div className='p-4 border-b border-gray-200/10'>
        <div className='flex items-center gap-3'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400' />
            <Input
              className='pl-9 dark:bg-gray-800/50 dark:border-gray-700/50'
              placeholder='搜索提示词...'
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            className="shrink-0 dark:border-gray-700/50"
            onClick={handleAdd}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* 提示词列表 */}
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        <div className='p-4 space-y-3'>
          {filteredPrompts.length === 0 ? (
            <div className='text-center text-gray-500 dark:text-gray-400 mt-8'>
              {searchKey ? '没有找到匹配的提示词' : '还没有添加提示词'}
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className='p-3 border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:border-blue-500 transition-colors dark:hover:border-blue-500 bg-white/50 dark:bg-gray-800/50'
              >
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='font-medium'>{prompt.title}</h3>
                  <div className='flex gap-1'>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={cn(
                        'relative h-8 w-8 transition-all duration-300',
                        copiedId === prompt.id && 'text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500'
                      )}
                      onClick={() => handleCopy(prompt)}
                    >
                      <div className="relative">
                        {copiedId === prompt.id ? (
                          <Check className='h-4 w-4 animate-scale-in' />
                        ) : (
                          <Copy className='h-4 w-4' />
                        )}
                        {copiedId === prompt.id && (
                          <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2">
                            <div className="relative">
                              <div className="px-3 py-1.5 text-xs font-medium text-white/90 rounded-lg bg-blue-500/90 dark:bg-blue-500/90 shadow-lg whitespace-nowrap animate-fade-in-up backdrop-blur-sm">
                                已复制
                                <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 transform rotate-45 w-[10px] h-[10px] bg-blue-500/90 dark:bg-blue-500/90" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className='h-8 w-8'
                      onClick={() => handleEdit(prompt)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className='h-8 w-8 text-red-500 dark:text-red-400'
                      onClick={() => handleDelete(prompt.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                
                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                  {prompt.content}
                </p>
                
                {prompt.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-0.5 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs rounded-full'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 