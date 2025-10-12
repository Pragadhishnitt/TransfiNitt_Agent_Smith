import { Menu, X, Bell, Search, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  console.log('🔝 Header component rendering...');
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const mockNotifications = [
          { id: 1, message: 'New interview completed', type: 'success', time: '2 min ago' },
          { id: 2, message: 'Template published successfully', type: 'info', time: '1 hour ago' },
          { id: 3, message: 'Survey generated', type: 'success', time: '3 hours ago' },
        ];
        setNotifications(mockNotifications);
        setNotificationCount(mockNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="flex flex-grow items-center justify-between px-6 py-3 md:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden rounded-lg p-2 hover:bg-gray-50 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Search Bar */}
          <div className="hidden sm:block">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-50 rounded-lg pl-10 pr-4 py-2 text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all xl:w-96"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-xl">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h5 className="text-sm font-semibold text-gray-900">Notifications</h5>
                </div>

                <ul className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <a className="flex flex-col gap-1 px-4 py-3 hover:bg-gray-50 transition-colors" href="#">
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <span className="hidden lg:block">
              <span className="block text-sm font-medium text-gray-900">
                {user?.name || 'User'}
              </span>
            </span>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;