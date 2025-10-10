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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  console.log('📱 Sidebar component rendering...');
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, gradient: 'from-blue-500 to-purple-600' },
    { name: 'Templates', href: '/templates', icon: FileText, gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Sessions', href: '/sessions', icon: Users, gradient: 'from-orange-500 to-pink-600' },
    { name: 'Respondents', href: '/respondents', icon: UserCheck, gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Insights', href: '/insights', icon: BarChart3, gradient: 'from-violet-500 to-purple-600' },
    { name: 'Survey Generator', href: '/survey', icon: FileSpreadsheet, gradient: 'from-green-500 to-emerald-600' },
    { name: 'Incentives', href: '/incentives', icon: DollarSign, gradient: 'from-yellow-500 to-orange-600' },
  ];

  return (
    <div className="flex flex-col w-72 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-xl h-full">
      {/* Header with gradient */}
      <div className="flex items-center h-20 px-6 border-b border-white/20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Research Hub</h1>
            <p className="text-xs text-white/80">AI Interview Platform</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-105'
                }`
              }
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
                'group-hover:bg-white/20'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="flex-1">{item.name}</span>
              {item.name === 'Sessions' && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full animate-pulse">
                  3
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* User section */}
      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Researcher</p>
            <p className="text-xs text-gray-500">researcher@example.com</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white/50 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
