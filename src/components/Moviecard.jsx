import { useNavigate } from 'react-router-dom';

const Moviecard = ({ movie, onClick }) => {
  const navigate = useNavigate();

  return (
    <li
      className="movie-card"
      onClick={() => {
        if (onClick) onClick();
        navigate(`/movie/${movie.id}`);
      }}
    >
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : ''
        }
        alt={movie.title}
      />

      <div className="mt-4">
        <h3>{movie.title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{movie.vote_average?.toFixed(1)}</p>
          </div>

          <span>•</span>
          <p className="year">{movie.release_date?.split('-')[0]}</p>
        </div>
      </div>
    </li>
  );
};

export default Moviecard;
