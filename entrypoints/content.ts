import { sendMessage } from '@/lib/messaging';


// 定义内容脚本
export default defineContentScript({
  // 匹配的URL模式
  matches: ['*://*.google.com/*'],
  // 主函数
  async main() {
    // 输出欢迎信息到控制台
    console.log('Hello content...');

    const length = await sendMessage('getStringLength', 'hello world');

    console.log(length);
  },
});
