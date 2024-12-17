import { actionContainer } from './content/action-container';

// 内容脚本入口
export default defineContentScript({
  matches: [
    '*://claude.ai/chat/*',
    '*://claude.ai/new',
    '*://*.google.com/*',
    '*://*.coze.com/store/agent/*'
  ],
  
  async main() {
    console.log('Content script loaded at:', window.location.href);

    // 初始化操作区
    await actionContainer.init();
  },
});
