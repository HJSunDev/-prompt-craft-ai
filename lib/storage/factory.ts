import { sendMessage, onMessage } from '@/lib/messaging';
import type { Storage, StorageConfig } from './types';

// 管理全局存储变化监听器
const storageListeners = new Map<string, Set<(value: any) => void>>();

// 标记全局监听器是否已设置
let isListenerSetup = false;

/**
 * 设置全局存储变化监听器
 * 确保只设置一次全局监听器，监听存储变化并通知相应的回调函数
 */
function setupGlobalListener() {
  if (isListenerSetup) return;

  onMessage('storageChanged', message => {
    const listeners = storageListeners.get(message.data.key);
    if (listeners) {
      listeners.forEach(callback => callback(message.data.newValue));
    }
  });

  isListenerSetup = true;
}

/**
 * 创建存储模块实例
 * @param config 存储配置
 * @returns 存储模块实例
 */
export function createStorage<T>(config: StorageConfig<T>): Storage<T> {
  return {
    // 获取存储的值
    async get() {
      try {
        const result = await sendMessage('storageGet', { key: config.key });
        return result as T;
      } catch (error) {
        console.error(`Storage get error for ${config.key}:`, error);
        throw error;
      }
    },

    // 设置存储的值
    async set(value: T) {
      try {
        await sendMessage('storageSet', { key: config.key, value });
      } catch (error) {
        console.error(`Storage set error for ${config.key}:`, error);
        throw error;
      }
    },

    // 监听存储值的变化，并在值变化时调用回调函数
    watch(callback: (value: T) => void) {
      try {
        // 确保全局存储变化监听器已初始化
        setupGlobalListener();

        // 将回调函数添加到对应存储键的监听器集合中
        if (!storageListeners.has(config.key)) {
          storageListeners.set(config.key, new Set());
        }
        const listeners = storageListeners.get(config.key)!;
        listeners.add(callback);

        // 获取当前存储值（带默认值）并立即调用回调函数
        this.getWithDefault().then(value => {
          callback(value);
        }).catch(error => {
          console.error(`[Storage] 获取键 "${config.key}" 的初始值失败:`, error);
          // 发生错误时，使用默认值
          callback(config.defaultValue);
        });

        // 返回一个函数用于移除当前回调监听
        return () => {
          const listeners = storageListeners.get(config.key);
          if (listeners) {
            listeners.delete(callback);
            // 如果没有剩余的监听器，移除该存储键的监听器集合
            if (listeners.size === 0) {
              storageListeners.delete(config.key);
            }
          }
        };
      } catch (error) {
        console.error(`Storage 监听错误，键 "${config.key}":`, error);
        return () => {};
      }
    },

    // 获取存储的值，如果不存在则返回默认值
    async getWithDefault() {
      try {
        const value = await this.get();
        return value === undefined ? config.defaultValue : value;
      } catch (error) {
        console.error(`Storage getWithDefault error for ${config.key}:`, error);
        return config.defaultValue;
      }
    },

    // 重置存储的值为默认值
    async reset() {
      return this.set(config.defaultValue);
    },

    // 删除存储的值
    async remove() {
      try {
        await sendMessage('storageRemove', { key: config.key });
      } catch (error) {
        console.error(`Storage remove error for ${config.key}:`, error);
        throw error;
      }
    },

    // 获取存储的配置
    getConfig() {
      return config;
    },
  };
} 