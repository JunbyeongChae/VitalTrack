import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">영양상담</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/counseladivsor" className="block p-2 bg-green-500 text-white rounded hover:bg-green-400">
            상담사 소개
          </Link>
        </li>
        <li>
          <Link to="/counsel" className="block p-2 bg-green-500 text-white rounded hover:bg-green-400">
            1:1 상담
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
