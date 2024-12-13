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
    // 添加存储权限
    permissions: [
      "storage"
    ]
  }        
});
