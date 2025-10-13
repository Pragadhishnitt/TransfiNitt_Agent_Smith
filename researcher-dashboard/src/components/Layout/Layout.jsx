import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({children}) => {
  console.log('🏗️ Layout component rendering...');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  return (
    <div className="layout-container bg-gray-50 dark:bg-boxdark">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDark={isDark}
          setIsDark={setIsDark}
        />
        <main className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="opacity-100 transition-opacity duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
