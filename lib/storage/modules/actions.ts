import { createStorage } from '../factory';
import type { StorageConfig } from '../types';

// 操作类型定义
export type ActionType = 'copy' | 'custom';  // 预留 custom 类型以便未来扩展

// 操作配置接口
export interface ActionConfig {
  type: ActionType;
  enabled: boolean;
  // copy 类型的配置
  promptId?: string;  // 关联的提示词 ID
  // 为未来扩展预留的配置字段
  customConfig?: Record<string, any>;
  updatedAt: number;
}

const config: StorageConfig<ActionConfig> = {
  key: 'action-config',
  defaultValue: {
    type: 'copy',
    enabled: false,
    updatedAt: Date.now()
  },
  description: '操作区配置',
  schema: {
    type: 'object',
    required: ['type', 'enabled', 'updatedAt'],
    properties: {
      type: { type: 'string', enum: ['copy', 'custom'] },
      enabled: { type: 'boolean' },
      promptId: { type: 'string' },
      customConfig: { type: 'object' },
      updatedAt: { type: 'number' }
    }
  }
};

export const actionConfigStorage = createStorage(config); 