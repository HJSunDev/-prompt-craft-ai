// 定义后台脚本
export default defineBackground(() => {
  // 输出后台脚本启动信息到控制台
  console.log('Hello background!', { id: browser.runtime.id });
});
