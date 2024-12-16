import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Copy, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { promptsStorage, type Prompt } from '@/lib/storage';

interface PromptManagerProps {
  onBack: () => void;
}

export function PromptManager({ onBack }: PromptManagerProps) {
  // 提示词列表状态
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  // 搜索关键词状态
  const [searchKey, setSearchKey] = useState('');
  // 编辑状态
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  // 临时编辑数据
  const [editForm, setEditForm] = useState<Prompt | null>(null);

  // 加载提示词列表
  useEffect(() => {
    console.log('Loading prompts...');
    promptsStorage.getWithDefault().then(data => {
      console.log('Loaded prompts:', data);
      setPrompts(data);
    });

    const unwatch = promptsStorage.watch(data => {
      console.log('Prompts updated:', data);
      setPrompts(data);
    });

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

    const newPrompts = prompts.map(p => 
      p.id === updatedPrompt.id ? updatedPrompt : p
    );

    await promptsStorage.set(newPrompts);
    setEditingPrompt(null);
    setEditForm(null);
  };

  // 处理取消
  const handleCancel = () => {
    setEditingPrompt(null);
    setEditForm(null);
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
  const handleAdd = async () => {
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      title: '新提示词',
      content: '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const newPrompts = [...prompts, newPrompt];
    await promptsStorage.set(newPrompts);
    handleEdit(newPrompt);
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

  console.log('Rendering prompts:', filteredPrompts);

  // 编辑视图
  if (editingPrompt) {
    return (
      <main className='flex flex-col w-[320px] h-[600px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
        {/* 编辑页面头部 */}
        <div className='flex items-center gap-2 p-4 border-b border-gray-200/10'>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCancel}
            className='h-8 w-8'
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <h2 className='flex-1 font-medium'>编辑提示词</h2>
          <Button 
            size="sm"
            onClick={handleSave}
          >
            保存
          </Button>
        </div>

        {/* 编辑表单 */}
        <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
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
      </main>
    );
  }

  // 列表视图
  return (
    <main className='flex flex-col w-[320px] h-[600px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      {/* 顶部搜索和添加区 */}
      <div className='flex items-center gap-2 p-4 border-b border-gray-200/10'>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onBack}
          className='h-8 w-8'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400' />
          <Input
            className='pl-8 dark:bg-gray-800/50 dark:border-gray-700/50'
            placeholder='搜索提示词...'
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <Button 
          size="icon" 
          variant="outline" 
          className="dark:border-gray-700/50"
          onClick={handleAdd}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* 提示词列表区 */}
      <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
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
                  <Button size="icon" variant="ghost" className='h-8 w-8'>
                    <Copy className='h-4 w-4' />
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
              
              <div className='flex gap-2 mt-2'>
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2 py-0.5 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs rounded-full'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
} 