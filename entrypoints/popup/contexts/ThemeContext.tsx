import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 暗模式状态
  const [isDark, setIsDark] = useState(() => {
    // 从本地存储读取暗模式偏好
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // 监听暗模式变化，更新 DOM 和本地存储
  useEffect(() => {
    // 更新 DOM
    document.documentElement.classList.toggle('dark', isDark);
    // 保存到本地存储
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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