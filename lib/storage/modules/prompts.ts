import { createStorage } from '../factory';
import type { StorageConfig } from '../types';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isLinkedToAction?: boolean;
  createdAt: number;
  updatedAt: number;
}

const config: StorageConfig<Prompt[]> = {
  key: 'prompts',
  defaultValue: [],
  description: '提示词列表',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      required: ['id', 'title', 'content', 'tags', 'createdAt', 'updatedAt'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' }
        },
        isLinkedToAction: { type: 'boolean' },
        createdAt: { type: 'number' },
        updatedAt: { type: 'number' }
      }
    }
  }
};

export const promptsStorage = createStorage(config); 