import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Search from '../components/Search';
import Loading from '../components/Loading';
import Moviecard from '../components/Moviecard';
import TrendingSection from '../components/TrendingSection';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";



const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`,
  },
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useDebounce(
    () => setDebounceSearch(searchTerm),
    500,
    [searchTerm]
  );

  // Fetch all movies
  const fetchMovies = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      setMovieList(data.results || []);
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies.');
    } finally {
      setLoading(false);
      console.log(movieList)
    }
  };

  // Fetch trending movies
  const fetchTrending = async () => {
    try {
      const response = await fetch('https://movieflix-backend-kkub.onrender.com/movies/trending');
      const data = await response.json();
      setTrendingMovies(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Update trending movie
  const updateTrendingMovie = async (movie) => {
    try {
      await fetch('https://movieflix-backend-kkub.onrender.com/movies/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      fetchTrending(); // refresh trending after update
    } catch (err) {
      console.error('Failed to update trending movie', err);
    }
  };

  // Fetch movies when search changes
  useEffect(() => {
    fetchMovies(debounceSearch);
  }, [debounceSearch]);

  // Fetch trending once on load
  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <main>
      <div className="pattern mt-3">
        <div className="wrapper">
          <header className="overflow-hidden">
            <img src="./hero.png" alt="" className="w-full" />
            <h1>
              Find <span className="text-gradient">Movies</span> You Will Enjoy Without Hassle!
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

       <div className="trending">
  <h1>Trending Movies</h1>

  <Swiper
  modules={[Autoplay]}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  loop={trendingMovies.length > 3}
  loopedSlides={trendingMovies.length}
  watchSlidesProgress
  speed={800}
  spaceBetween={16}
  slidesPerView={2}
  breakpoints={{
    1024: {
      slidesPerView: 3,
    },
  }}
  className="my-7"
>
  {trendingMovies.map((movie) => (
    <SwiperSlide key={movie._id} className="flex justify-center">
      <TrendingSection
        movie={movie}
        onClick={() =>
          updateTrendingMovie({
            movieId: movie.movieId,
            name: movie.name,
            posterUrl: movie.posterUrl,
          })
        }
      />
    </SwiperSlide>
  ))}
</Swiper>

</div>



          <div className="all-movies">
            <h1>All movies</h1>
            {loading ? (
              <Loading />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                 <Moviecard
  key={movie.id}
  movie={movie}
  onClick={() =>
    updateTrendingMovie({
      movieId: movie.id,  // TMDB ID
      name: movie.title,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/no-movie.png',
    })
  }
/>

                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
