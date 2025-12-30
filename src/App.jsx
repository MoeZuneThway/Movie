import React from 'react'
import {useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Search from './components/Search'
import Loading from './components/Loading'
import Moviecard from './components/Moviecard'
import { useDebounce } from 'react-use'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method : 'GET',
  headers :{
    accept : 'application/json',
    authorization : `Bearer ${API_KEY}`
  }
}
console.log(API_KEY);
const App=()=>{
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState('');
  useDebounce(()=>{
    setDebounceSearch(searchTerm)
  },500,[searchTerm])
  const fetchMovies =async(query="")=>{
    setLoading(true);
    try{
      
      const endpoint = query? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS);
      const data = await response.json();
      console.log(data);
      if(data.Response === false){
        setError(data.Error || "Failed to fetch movies.");
        setMovieList([]);
      }
      setMovieList(data.results||[]);
    }catch(error){
      console.error(`Error returning movies : ${error}`);
      setError('Error returning movies. Try again later');
    }finally{
      setLoading(false);
    }
  }
useEffect(()=>{
fetchMovies(debounceSearch);
},[debounceSearch])
  return(
    <main>
        <div className='pattern '>
          <div className="wrapper">
            <header className='overflow-hidden'>
              <img src="./hero.png" alt="" className='w-full'/>
            <h1>Find <span className='text-gradient'>Movies</span> You Will Enjoy Without Hassle!</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

            </header>
            <div className="all-movies">
              <h1 className=''>All movies</h1>
              {loading? <Loading/>: error?(
                <p className='text-red-500'>{error}</p>
              ): (
                <ul>
                  {movieList.map((movie)=>(
                    <Moviecard movie={movie} key={movie.id}/>
                  ))}
                </ul>
              )
              }
            </div>
          </div>
        </div>
    </main>
  )
}

export default App
