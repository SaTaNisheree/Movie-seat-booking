import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchMovie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state is true
  const fetchMovies = async () => {
    if(searchQuery!=="")
    {
    try {
      console.warn("Entered");
      const response = await axios.get('http://localhost:5500/movies');
      setMovies(response.data); // Assuming response.data is an array of movie objects
      console.warn("Done");
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false); // Handle error and set loading to false
      // You can show an error message to the user
    }}
    else
    {
      try {
        console.warn("Entered");
        const response = await axios.get(`http://localhost:5500/searchmovies?searchQuery=${searchQuery}`);
        setMovies(response.data); // Assuming response.data is an array of movie objects
        console.warn("Done");
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false); // Handle error and set loading to false
        // You can show an error message to the user
      }}

  };
  useEffect(() => {
  
    fetchMovies(); // Call the fetchMovies function when the component mounts
  }, []); // Empty dependency array ensures useEffect runs once on component mount


  const fetchMovies2 = async () => {
    
      try {
        console.warn("Entered");
        const response = await axios.get(`http://localhost:5500/searchmovies?searchQuery=${searchQuery}`);
        setMovies(response.data); // Assuming response.data is an array of movie objects
        console.warn("Done");
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false); // Handle error and set loading to false
        // You can show an error message to the user
      }
  }
  

  const handleSearch = (e) => {
    e.preventDefault();

    // Logic to search for movies based on searchQuery
    // You can implement search logic here or make another API call for search
  };
const handleSearchmovie = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    fetchMovies2();
    // Logic to search for movies based on searchQuery
    // You can implement search logic here or make another API call for search
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">Search Movie</div>
            <div className="card-body">
              <form onSubmit={handleSearchmovie}>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search by movie name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary">Search</button>
                  </div>
                </div>
              </form>
              {loading ? (
                <div className="text-center mt-3">Loading...</div>
              ) : (
                <div className="mt-3 row">
                  {movies.map(movie => (
                    <div key={movie.movie_id} className="col mb-3">
                      <div className="card" style={{ minWidth: '300px' }}>
                        <div className="card-body">
                          <h5 className="card-title">{movie.name}</h5>
                          <p className="card-text">{movie.description}</p>
                          <p className="card-text"><small className="text-muted">Rating: {movie.rating} | Language: {movie.language}</small></p>
                          <Link to={`/movie/${movie.movie_id}`} className="btn btn-primary">Book Tickets</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMovie;
