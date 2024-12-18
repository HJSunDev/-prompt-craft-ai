import { sendMessage } from '@/lib/messaging';
import type { Storage, StorageConfig } from './types';

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

    // 监听存储值的变化
    watch(callback: (value: T) => void) {
      const listener = (changes: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        // 当存储的键发生变化时，调用回调函数
        if (config.key in changes) {
          callback(changes[config.key].newValue);
        }
      };

      try {
        // 添加监听器
        chrome.storage.local.onChanged.addListener(listener);
        return () => {
          try {
            // 移除监听器
            chrome.storage.local.onChanged.removeListener(listener);
          } catch (error) {
            console.error(`Storage unwatch error for ${config.key}:`, error);
          }
        };
      } catch (error) {
        console.error(`Storage watch error for ${config.key}:`, error);
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