// 定义内容脚本
export default defineContentScript({
  // 匹配的URL模式
  matches: ['*://*.google.com/*'],
  // 主函数
  main() {
    // 输出欢迎信息到控制台
    console.log('Hello content...');
  },
});
