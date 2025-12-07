import { Smartphone, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Solutions', path: '/' },
    { name: 'Compare prices', path: '/compare' },
    { name: 'AI picks', path: '/ai-picks' },
    { name: 'About', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <nav className="bg-[#0a0a1f] border-b border-indigo-900/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white p-1.5 rounded-lg">
              <Smartphone className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              PRICERA
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
            >
              Admin Panel
            </Link>
          </div>
          
          <button className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
