import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrendingSection({ movie, onClick }) {
  const navigate = useNavigate();

  return (
    <div
      className="movie-card"
      onClick={() => {
        if (onClick) onClick(); // update trending if needed
        if (movie.movieId) navigate(`/movie/${movie.movieId}`); // navigate to details
      }}
    >
      <img
        src={movie.posterUrl || '/no-movie.png'}
        alt={movie.name}
      />
      <div className="mt-4">
        <h3>{movie.name}</h3>
      </div>
    </div>
  );
}

export default TrendingSection;
