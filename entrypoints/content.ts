import { actionContainer } from './content/action-container';
import { siteButtons } from './content/site-buttons';

// 内容脚本入口
export default defineContentScript({
  matches: [
    '*://claude.ai/chat/*',
    '*://claude.ai/new',
    '*://*.google.com/*',
    '*://*.coze.com/store/agent/*'
  ],
  
  // 确保在 DOM 加载完成后执行
  runAt: 'document_idle',

  async main() {
    console.log('Content script loaded at:', window.location.href);

    // 初始化操作区
    await actionContainer.init();
    
    // 初始化网站按钮
    await siteButtons.init();
  }
});
