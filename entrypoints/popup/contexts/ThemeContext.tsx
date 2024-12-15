import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themeStorage, type Theme } from '@/lib/storage';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 暗模式状态
  const [isDark, setIsDark] = useState(false);
  // 是否已初始化
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化时从 storage 读取主题设置
  useEffect(() => {
    const initTheme = async () => {
      const theme = await themeStorage.getWithDefault();
      setIsDark(theme === 'dark');
      setIsInitialized(true);
    };
    initTheme();
  }, []);

  // 只有在初始化完成后，才开始监听和同步主题变化
  useEffect(() => {
    if (!isInitialized) return;

    // 更新 DOM
    document.documentElement.classList.toggle('dark', isDark);
    // 保存到 storage
    themeStorage.set(isDark ? 'dark' : 'light');
  }, [isDark, isInitialized]);

  // 切换暗模式
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 hook 用于获取主题状态
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 