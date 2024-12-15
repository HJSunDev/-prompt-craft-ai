import { createStorage } from '../factory';

export type Theme = 'light' | 'dark';

export const themeStorage = createStorage<Theme>({
  key: 'theme',
  defaultValue: 'light',
  description: '主题设置',
  schema: {
    type: 'string',
    enum: ['light', 'dark'],
  },
}); 