import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Copy, Edit, Trash2, ArrowLeft } from 'lucide-react';

// 定义提示词类型
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface PromptManagerProps {
  onBack: () => void;
}

export function PromptManager({ onBack }: PromptManagerProps) {
  // 提示词列表状态
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      title: '翻译助手',
      content: '请将以下内容翻译成中文，要准确、地道：\n\n[在此粘贴需要翻译的内容]',
      tags: ['翻译']
    },
    {
      id: '2',
      title: '代码优化',
      content: '请帮我优化以下代码，使其更加简洁高效：\n\n```\n[在此粘贴代码]\n```',
      tags: ['编程']
    }
  ]);
  
  // 搜索关键词状态
  const [searchKey, setSearchKey] = useState('');
  // 编辑状态
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  // 临时编辑数据
  const [editForm, setEditForm] = useState<Prompt | null>(null);

  // 处理编辑
  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setEditForm({ ...prompt });
  };

  // 处理保存
  const handleSave = () => {
    if (!editForm) return;
    
    setPrompts(prompts.map(p => 
      p.id === editForm.id ? editForm : p
    ));
    setEditingPrompt(null);
    setEditForm(null);
  };

  // 处理取消
  const handleCancel = () => {
    setEditingPrompt(null);
    setEditForm(null);
  };

  // 编辑表单更新
  const updateForm = (field: keyof Prompt, value: string) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      [field]: field === 'tags' ? value.split(',').map(t => t.trim()) : value
    });
  };

  if (editingPrompt) {
    return (
      <main className='flex flex-col w-[320px] h-[600px] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
        {/* 编辑页面头部 */}
        <div className='flex items-center gap-2 p-4 border-b dark:border-gray-800'>
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
              className="dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>内容</label>
            <Textarea
              value={editForm?.content}
              onChange={(e) => updateForm('content', e.target.value)}
              placeholder="输入提示词内容"
              className="min-h-[300px] dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>标签</label>
            <Input
              value={editForm?.tags.join(', ')}
              onChange={(e) => updateForm('tags', e.target.value)}
              placeholder="输入标签，用逗号分隔"
              className="dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='flex flex-col w-[320px] h-[600px] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
      {/* 顶部搜索和添加区 */}
      <div className='flex items-center gap-2 p-4 border-b dark:border-gray-800'>
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
            className='pl-8 dark:bg-gray-800 dark:border-gray-700'
            placeholder='搜索提示词...'
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <Button size="icon" variant="outline" className="dark:border-gray-700">
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* 提示词列表区 */}
      <div className='flex-1 overflow-y-auto p-4'>
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className='mb-4 p-3 border rounded-lg hover:border-blue-500 transition-colors dark:border-gray-700'
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
                <Button size="icon" variant="ghost" className='h-8 w-8 text-red-500 dark:text-red-400'>
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
                  className='px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 