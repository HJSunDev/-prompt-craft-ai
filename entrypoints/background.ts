import { onMessage } from '@/lib/messaging';

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

  // 监听存储变化
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.visitCount) {
        console.log(
          `访问次数从 ${changes.visitCount.oldValue} 更新为 ${changes.visitCount.newValue}`
        );
        // 输出最后访问时间
        console.log(
          `最后访问时间: ${changes.lastVisitTime.newValue}`
        );
      }
    }
  });

  // 启动时更新访问统计
  updateVisitStats();
});
