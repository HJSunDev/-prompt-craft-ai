import { defineConfig } from 'wxt';

// 参考 https://wxt.dev/api/config.html
export default defineConfig({
  // 指定扩展API为chrome
  extensionApi: 'chrome',
  // 使用的模块列表
  modules: ['@wxt-dev/module-react'],        
  // 输出目录
  outDir: "dist",        
  // 添加权限配置
  manifest: {
    name: "Prompt Craft",
    description: "AI 体验优化工具",
    version: "1.0.0",
    // 添加存储权限
    permissions: [
      "storage"
    ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval' http://localhost:3000 http://localhost:3001; object-src 'self'"
    }
  }        
});
