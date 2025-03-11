import React from 'react';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import {Route, Routes} from "react-router";
import WorkoutPage from "./pages/WorkoutPage";

const App = () => {
  return (
    <>
        <Routes>
            <Route path="/" exact={true} element={<Home/>}/>
            <Route path="/workout" exact={true} element={<WorkoutPage/>}/>
        </Routes>
    </>
  );
};

export default App;
