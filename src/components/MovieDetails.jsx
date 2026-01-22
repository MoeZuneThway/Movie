import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-details my-7 overflow-hidden">
      <h3 className='text-white text-4xl text-center font-bold my-5'>{movie.title}</h3>
      <div className="flex justify-center">
        <Link to="/" className='bg-transparent text-white border-1 border-[#AB8BFF] rounded shadow px-3 py-1'>Back</Link>
      </div>
      <div className='flex items-center justify-center bg-transparent p-16 '>
        <video width="400" controls="controls" src={`https://image.tmdb.org/t/p/w500${movie.video}`} poster={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} className='w-screen'></video>
      </div>
     <div className="md:flex space-x-3 space-y-2 justify-center items-center mb-8 px-3">
       <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
        alt={movie.title} className='max-w-30'
      />
      <div className='text-white flex flex-col space-y-2'>

      <p className='text-white text-xl '>{movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
      </div>
     </div>
    </div>
  );
};

export default MovieDetails;
