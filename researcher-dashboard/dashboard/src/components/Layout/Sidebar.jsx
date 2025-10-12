import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  BarChart3,
  FileSpreadsheet,
  DollarSign,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  console.log('📱 Sidebar component rendering...');
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Sessions', href: '/sessions', icon: Users },
    { name: 'Respondents', href: '/respondents', icon: UserCheck },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
    { name: 'Survey Generator', href: '/survey', icon: FileSpreadsheet },
    { name: 'Incentives', href: '/incentives', icon: DollarSign },
  ];

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-white duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-8">
        <NavLink to="/">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-black">Research Hub</span>
          </div>
        </NavLink>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      {/* SIDEBAR MENU */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="px-4">
          <ul className="flex flex-col gap-0.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200
                      ${isActive ? 
                        'bg-gray-100 text-black' : 
                        'text-gray-600 hover:bg-gray-50 hover:text-black'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="mb-auto px-4 pb-8 pt-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-black"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;