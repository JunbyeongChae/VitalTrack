import React from 'react';

const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-12 w-auto" src="../images/logo.png" alt="Logo" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button className="border-custom text-custom inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</button>
              <a href="/progress" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Progress
              </a>
              <a href="/nutrition" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Nutrition
              </a>
              <a href="/community" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Community
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <button type="button" className="p-2 rounded-full text-gray-400 hover:text-gray-500">
              <i className="fas fa-bell text-xl"></i>
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full" src="../images/avatar.png" alt="Profile" />
                <span className="ml-2 text-sm font-medium text-gray-700">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
