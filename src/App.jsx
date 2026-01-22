import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MovieDetails from './components/MovieDetails';
import Home from './pages/home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
};

export default App;
