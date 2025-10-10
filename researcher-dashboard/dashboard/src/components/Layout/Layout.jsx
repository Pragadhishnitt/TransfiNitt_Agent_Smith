import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({children}) => {
  console.log('🏗️ Layout component rendering...');
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm">
          <div className="animate-fadeInUp">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
