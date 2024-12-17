import './styles.css';
import { promptsStorage, type Prompt } from '@/lib/storage/modules/prompts';
import { actionConfigStorage } from '@/lib/storage/modules/actions';

/**
 * 网站按钮模块接口
 */
interface SiteButtonModule {
  /** 初始化模块 */
  init(): Promise<void>;
  /** 销毁模块 */
  destroy(): void;
}

/**
 * 网站配置接口
 */
interface SiteConfig {
  /** 网站名称 */
  name: string;
  /** 按钮容器选择器 */
  buttonContainerSelector: string;
  /** 观察目标选择器 */
  observeTargetSelector: string;
  /** 是否启用 */
  enabled: boolean;
  /** 文本框选择器 */
  textareaSelector: string;
  /** 发送按钮选择器 */
  sendButtonSelector: string;
}

// Coze 网站配置
const COZE_CONFIG: SiteConfig = {
  name: 'Coze',
  buttonContainerSelector: '#root > div > div > div > div > div > div.f0SuJlgVjvkFtOGiOWZ2.pUh9UKr9_kw673u6R4vM > div > div.SAofg94zEvwlDg17xeFO > div > div.a0BdnOGko7txCGkv1GmY.akEqzGLYZWsjA6qUneWI > div.nEZ4cK4PKRUeAely3T8A > div.FUjI0tE29vUr893NlfjD > div > div.wR9gVK7v5II9hKJYKV93 > div.JmMZmVrOwngPEdAAVcoB.input-wraper-for-reset > div.T2LHeTOxNUwB6GHgkXQF',
  textareaSelector: '#root > div > div > div > div > div > div.f0SuJlgVjvkFtOGiOWZ2.pUh9UKr9_kw673u6R4vM > div > div.SAofg94zEvwlDg17xeFO > div > div.a0BdnOGko7txCGkv1GmY.akEqzGLYZWsjA6qUneWI > div.nEZ4cK4PKRUeAely3T8A > div.FUjI0tE29vUr893NlfjD > div > div.wR9gVK7v5II9hKJYKV93 > div.JmMZmVrOwngPEdAAVcoB.input-wraper-for-reset > div.T2LHeTOxNUwB6GHgkXQF.coz-bg-max.coz-stroke-primary > div > textarea',
  sendButtonSelector: '#root > div > div > div > div > div > div.f0SuJlgVjvkFtOGiOWZ2.pUh9UKr9_kw673u6R4vM > div > div.SAofg94zEvwlDg17xeFO > div > div.a0BdnOGko7txCGkv1GmY.akEqzGLYZWsjA6qUneWI > div.nEZ4cK4PKRUeAely3T8A > div.FUjI0tE29vUr893NlfjD > div > div.wR9gVK7v5II9hKJYKV93 > div.JmMZmVrOwngPEdAAVcoB.input-wraper-for-reset > div.T2LHeTOxNUwB6GHgkXQF.coz-bg-max.coz-stroke-primary > div > div > div.uqdGhcCF44rt4cvXd8rC > div > button',
  observeTargetSelector: '#root',
  enabled: true,
};

/**
 * Coze 网站按钮实现
 */
class CozeButton implements SiteButtonModule {
  private observer: MutationObserver | null = null;
  private static instance: CozeButton | null = null;

  constructor() {
    // 如果已经有实例了,先清理旧实例
    if (CozeButton.instance) {
      CozeButton.instance.destroy();
    }
    CozeButton.instance = this;
  }

  private async getLinkedPrompt(): Promise<Prompt | null> {
    try {
      const [actionConfig, prompts] = await Promise.all([
        actionConfigStorage.getWithDefault(),
        promptsStorage.getWithDefault()
      ]);

      if (!actionConfig.enabled || !actionConfig.promptId) {
        console.log('No prompt linked to action');
        return null;
      }

      const prompt = prompts.find(p => p.id === actionConfig.promptId);
      if (!prompt) {
        console.log('Linked prompt not found');
        return null;
      }

      return prompt;
    } catch (error) {
      console.error('Failed to get linked prompt:', error);
      return null;
    }
  }

  private async handleButtonClick() {
    const textarea = document.querySelector(COZE_CONFIG.textareaSelector) as HTMLTextAreaElement;
    if (!textarea) return;

    // 获取关联的提示词
    const prompt = await this.getLinkedPrompt();
    if (!prompt) {
      console.log('No prompt available');
      return;
    }

    // 获取当前内容
    const currentContent = textarea.value;
    
    // 准备新内容
    const newContent = currentContent
      ? currentContent + '\n' + prompt.content  // 如果有内容,添加新行
      : prompt.content;                         // 如果没有内容,直接添加

    // 更新文本框内容
    textarea.value = newContent;

    // 触发 input 事件以通知 React 更新
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // 聚焦文本框并将光标移到末尾
    textarea.focus();
    textarea.setSelectionRange(newContent.length, newContent.length);

    // 点击发送按钮
    setTimeout(() => {
      const sendButton = document.querySelector(COZE_CONFIG.sendButtonSelector) as HTMLButtonElement;
      if (sendButton) {
        // 模拟真实的点击事件
        sendButton.dispatchEvent(new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        sendButton.dispatchEvent(new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        sendButton.click();
      }
    }, 100); // 给一个小延迟确保文本已更新
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'pc-site-button';
    button.setAttribute('type', 'button');
    button.style.setProperty('visibility', 'visible', 'important');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;
    
    // 添加点击事件
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleButtonClick();
    });

    return button;
  }

  private insertButton() {
    const container = document.querySelector(COZE_CONFIG.buttonContainerSelector) as HTMLElement;
    if (!container || container.querySelector('.pc-site-button')) return;

    // 重置父元素的 overflow 属性
    container.style.setProperty('overflow', 'visible', 'important');

    // 创建按钮
    const button = this.createButton();

    // 设置父元素的相对定位
    container.style.setProperty('position', 'relative', 'important');

    // 插入按钮
    container.appendChild(button);
  }

  private setupObserver() {
    // 如果已经有观察器了,先清理掉
    this.cleanupObserver();

    const target = document.querySelector(COZE_CONFIG.observeTargetSelector);
    if (!target) return;

    // 使用防抖来避免频繁操作
    let debounceTimer: number | null = null;
    
    this.observer = new MutationObserver(() => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        this.insertButton();
      }, 100);
    });

    // 使用更精确的配置
    this.observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    // 添加页面卸载时的清理
    window.addEventListener('unload', () => this.destroy(), { once: true });
  }

  private cleanupObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  async init() {
    if (!COZE_CONFIG.enabled) return;

    try {
      // 等待 DOM 加载完成
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // 尝试插入按钮
      this.insertButton();

      // 设置观察器
      this.setupObserver();

    } catch (error) {
      console.error('Failed to initialize Coze button:', error);
      this.destroy();
    }
  }

  destroy() {
    // 清理观察器
    this.cleanupObserver();

    // 移除按钮
    const button = document.querySelector('.pc-site-button');
    if (button) {
      button.remove();
    }

    // 清理实例引用
    if (CozeButton.instance === this) {
      CozeButton.instance = null;
    }
  }
}

/**
 * 网站按钮管理器
 */
class SiteButtons {
  private modules: SiteButtonModule[] = [
    new CozeButton()
  ];

  async init() {
    // 初始化所有网站模块
    await Promise.all(
      this.modules.map(module => module.init())
    );
  }

  destroy() {
    // 销毁所有网站模块
    this.modules.forEach(module => module.destroy());
  }
}

export const siteButtons = new SiteButtons(); 