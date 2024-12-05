/** @type {import('tailwindcss').Config} */
export default {
  // 指定 Tailwind CSS 应用的文件路径
  content: [
    "./{components,entrypoints,lib}/**/*.{js,jsx,ts,tsx}",
    "./*.html",
    "./**/*.css",
  ],
  // 排除的文件路径
  exclude: [
    "./node_modules/**/*",
    "./dist/**/*",
  ],
  theme: {
    // 扩展默认主题
    extend: {},
  },
  // 插件列表
  plugins: [],
}
