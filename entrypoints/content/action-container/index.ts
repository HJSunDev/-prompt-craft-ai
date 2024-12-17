import { actionConfigStorage, type ActionConfig } from '@/lib/storage/modules/actions';
import { promptsStorage, type Prompt } from '@/lib/storage/modules/prompts';
import './styles.css';

// 类型定义
interface ActionContainerModule {
  init(): Promise<void>;
  destroy(): void;
}

// 操作执行器
class ActionExecutor {
  private static async execute(config: ActionConfig) {
    const button = document.querySelector('.pc-main-button');
    if (!button) return;

    try {
      switch (config.type) {
        case 'copy':
          await this.handleCopyAction(config, button);
          break;

        case 'custom':
          await this.handleCustomAction(config, button);
          break;
      }
    } catch (error) {
      console.error('Action execution failed:', error);
    }
  }

  private static async handleCopyAction(config: ActionConfig, button: Element) {
    if (!config.promptId) return;

    const prompts = await promptsStorage.getWithDefault();
    const prompt = prompts.find(p => p.id === config.promptId);
    
    if (prompt) {
      await navigator.clipboard.writeText(prompt.content);
      console.log('Prompt content copied:', prompt.title);
      this.showSuccessState(button);
    }
  }

  private static async handleCustomAction(config: ActionConfig, button: Element) {
    if (!config.customConfig) return;
    
    console.log('Custom action executed with config:', config.customConfig);
    this.showSuccessState(button);
  }

  private static showSuccessState(button: Element) {
    button.classList.add('success');
    setTimeout(() => {
      button.classList.remove('success');
    }, 1500);
  }

  static async tryExecute() {
    const config = await actionConfigStorage.getWithDefault();
    if (config.enabled) {
      await this.execute(config);
    } else {
      console.log('Action is not configured or disabled');
    }
  }
}

// UI 构建器
class ActionContainerBuilder {
  private static createButton(): HTMLDivElement {
    const button = document.createElement('div');
    button.className = 'pc-main-button';
    
    // 添加默认图标
    const defaultContent = this.createIconContainer('default', `
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    `);

    // 添加成功图标
    const successContent = this.createIconContainer('success', `
      <polyline points="20 6 9 17 4 12"></polyline>
    `);

    button.appendChild(defaultContent);
    button.appendChild(successContent);

    // 添加点击事件
    button.addEventListener('click', async () => {
      if (button.classList.contains('success')) return;
      console.log('Action button clicked');
      await ActionExecutor.tryExecute();
    });

    return button;
  }

  private static createIconContainer(type: 'default' | 'success', pathData: string): HTMLDivElement {
    const container = document.createElement('div');
    container.className = `pc-button-content pc-button-${type}`;
    container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${pathData}
      </svg>
    `;
    return container;
  }

  static createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'pc-action-container';
    container.appendChild(this.createButton());
    return container;
  }
}

// 模块管理器
class ActionContainerManager implements ActionContainerModule {
  private observer: MutationObserver | null = null;

  private ensureContainer() {
    const existingContainer = document.querySelector('.pc-action-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = ActionContainerBuilder.createContainer();
    document.body.appendChild(container);
    console.log('Action container added successfully');
  }

  async init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    try {
      // 初始化容器
      this.ensureContainer();

      // 监听页面变化
      this.observer = new MutationObserver(() => {
        if (!document.querySelector('.pc-action-container')) {
          this.ensureContainer();
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });

    } catch (error) {
      console.error('Failed to initialize action container:', error);
    }
  }

  destroy() {
    // 清理观察器
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // 移除容器
    const container = document.querySelector('.pc-action-container');
    if (container) {
      container.remove();
    }
  }
}

// 导出模块实例
export const actionContainer = new ActionContainerManager(); 