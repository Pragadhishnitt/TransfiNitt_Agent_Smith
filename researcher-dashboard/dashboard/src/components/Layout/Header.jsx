import { Bell, Search } from 'lucide-react';

const Header = () => {
  console.log('🔝 Header component rendering...');
  
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search interviews, templates, respondents..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">3 Active</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">47 Total</span>
            </div>
          </div>
          
          {/* Notifications */}
          <button className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all duration-200 hover:scale-105">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              3
            </span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-white/30">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Researcher</p>
              <p className="text-xs text-gray-500">researcher@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
