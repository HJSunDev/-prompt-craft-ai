import { createStorage } from '../factory';

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export const defaultModules: Module[] = [
  {
    id: 'prompt-manager',
    name: '提示词管理',
    description: '管理和组织你的 AI 提示词',
    icon: 'MessageSquarePlus',
    enabled: false,
    order: 0
  },
  {
    id: 'ai-chat',
    name: 'AI 对话',
    description: '与 AI 进行智能对话',
    icon: 'Sparkles',
    enabled: false,
    order: 1
  }
];

export const modulesStorage = createStorage<Module[]>({
  key: 'modules',
  defaultValue: defaultModules,
  description: '功能模块配置',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      required: ['id', 'name', 'description', 'icon', 'enabled', 'order'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        icon: { type: 'string' },
        enabled: { type: 'boolean' },
        order: { type: 'number' }
      }
    }
  }
}); 