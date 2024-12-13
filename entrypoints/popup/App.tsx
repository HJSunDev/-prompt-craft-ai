import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import { Button } from '@/components/ui/button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Chrome 扩展的 popup 窗口默认最大高度为 600px，超出会出现滚动条 */}
      <main className='flex flex-col w-[320px] h-[600px] overflow-hidden'>
        {/* 图标 */}
        <div className='flex items-center justify-center space-x-4 mt-32'>
          <a href="https://wxt.dev" target="_blank">
            <img src={wxtLogo} className="logo w-16 h-16" alt="WXT logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react w-16 h-16" alt="React logo" />
          </a>
        </div>
        {/* 标题 */}
        <h1 className='text-2xl font-bold text-center text-blue-200 mt-4'>WXT + React</h1>
        {/* 按钮 */}
        <div className="rounded-lg flex flex-col items-center gap-2 w-auto mt-4">
          <Button variant="outline" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
        </div>
        {/* 提示 */}
        <p className='mt-4 text-center text-gray-600'>
          Edit <code className='bg-gray-200 px-1 rounded'>src/App.tsx</code> and save to test HMR
        </p>
        <p className='mt-4 text-center text-gray-500'>
          Click on the WXT and React logos to learn more
        </p>
      </main>
    </>
  );
}

export default App;
