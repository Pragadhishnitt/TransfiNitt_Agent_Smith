import { Bell, Search } from 'lucide-react';

const Header = () => {
  console.log('🔝 Header component rendering...');
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">R</span>
            </div>
            <div>
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
