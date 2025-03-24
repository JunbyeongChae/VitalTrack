import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <img src="images/NoLoginState2.png" alt="No login state" />
      </div>
      <div className="flex justify-center mt-10 mb-20">
        <button
          onClick={() => navigate('/login')}
          className="
            flex items-center justify-center gap-4
            px-10 py-5 
            bg-gradient-to-r from-blue-500 to-indigo-500 
            text-white 
            text-2xl 
            font-bold 
            rounded-full 
            shadow-2xl
            hover:from-blue-600 hover:to-indigo-600 
            hover:scale-110 hover:shadow-3xl
            active:scale-95 active:shadow-inner
            transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-blue-300
          ">
          로그인 하기
          <FontAwesomeIcon icon={faArrowRight} className="text-2xl transition-transform group-hover:translate-x-2" />
        </button>
      </div>
    </div>
  );
};

export default Home;
