/**
 * 存储模块
 * 
 * 使用示例:
 * ```typescript
 * // 主题存储
 * import { themeStorage } from '@/lib/storage';
 * 
 * // 获取主题
 * const theme = await themeStorage.getWithDefault();
 * 
 * // 设置主题
 * await themeStorage.set('dark');
 * 
 * // 监听主题变化
 * const unwatch = themeStorage.watch(theme => {
 *   console.log('主题变化:', theme);
 * });
 * 
 * // 清理监听器
 * unwatch();
 * 
 * // 提示词存储
 * import { promptsStorage, type Prompt } from '@/lib/storage';
 * 
 * // 获取提示词列表
 * const prompts = await promptsStorage.getWithDefault();
 * 
 * // 添加提示词
 * const newPrompt: Prompt = {
 *   id: 'unique-id',
 *   title: '新提示词',
 *   content: '提示词内容',
 *   tags: ['标签1', '标签2'],
 *   createdAt: Date.now(),
 *   updatedAt: Date.now()
 * };
 * await promptsStorage.set([...prompts, newPrompt]);
 * ```
 */

// 导出类型和工具函数
export * from './types';
export * from './factory';

// 导出存储模块
export { themeStorage, type Theme } from './modules/theme';
export { promptsStorage, type Prompt } from './modules/prompts'; 