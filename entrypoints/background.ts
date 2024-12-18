import { onMessage, sendMessage } from '@/lib/messaging';

// 定义存储的数据结构
interface StorageSchema {
  visitCount: number;
  lastVisitTime: string;
}

// 定义后台脚本
export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // 原有的消息处理
  onMessage('getStringLength', message => {
    return message.data.length;
  });

  // 处理存储获取请求
  onMessage('storageGet', async (message) => {
    try {
      const result = await chrome.storage.local.get(message.data.key);
      return result[message.data.key];
    } catch (error) {
      console.error('Storage get error:', error);
      throw error;
    }
  });

  // 处理存储设置请求
  onMessage('storageSet', async (message) => {
    try {
      await chrome.storage.local.set({ [message.data.key]: message.data.value });
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  });

  // 处理存储删除请求
  onMessage('storageRemove', async (message) => {
    try {
      await chrome.storage.local.remove(message.data.key);
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  });

  // 示例：记录访问次数
  async function updateVisitStats() {
    // 获取当前访问次数
    const result = await browser.storage.local.get('visitCount');
    const currentCount = result.visitCount || 0;
    
    // 更新访问次数和最后访问时间
    await browser.storage.local.set({
      visitCount: currentCount + 1,
      lastVisitTime: new Date().toISOString()
    });
  }

  // 监听本地存储的变化并广播更新
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      // 遍历所有变化的键并广播更新
      Object.entries(changes).forEach(([key, change]) => {
        sendMessage('storageChanged', {
          key,
          oldValue: change.oldValue,
          newValue: change.newValue
        }).catch(error => {
          // 忽略连接未建立的错误，记录其他错误
          if (!error.message.includes('Could not establish connection')) {
            console.error(`[Background] 广播键 "${key}" 的变化失败:`, error);
          }
        });
      });
    }
  });

  // 启动时更新访问统计
  updateVisitStats();
});
