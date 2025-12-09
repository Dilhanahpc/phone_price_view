import { Smartphone, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Solutions', path: '/' },
    { name: 'Compare prices', path: '/compare' },
    { name: 'AI picks', path: '/ai-picks' },
    { name: 'About', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
          
          <button 
            onClick={toggleMobileMenu}
            onTouchStart={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.opacity = '1';
              e.preventDefault();
              toggleMobileMenu();
            }}
            style={{ WebkitTapHighlightColor: 'transparent', cursor: 'pointer' }}
            className="md:hidden text-white p-2 active:scale-95 transition-transform"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-900/20">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    onTouchStart={(e) => {
                      e.currentTarget.style.opacity = '0.7';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className={`text-sm font-medium transition-all duration-200 py-2 px-4 rounded-lg active:scale-95 ${
                      isActive
                        ? 'text-white bg-indigo-600/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                onTouchStart={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 text-center active:scale-95"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
