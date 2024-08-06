// SearchHall.js
import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const SearchHall = ({ onSelectHall }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [halls, setHalls] = useState([]);
  const fetchMovies = async () => {
    if(searchQuery!=="")
    {
    try {
      console.warn("Entered");
      const response = await axios.get('http://localhost:5500/halls');
      setHalls(response.data); // Assuming response.data is an array of movie objects
      console.warn("Done");
      
    } catch (error) {
      console.error('Error fetching movies:', error);
     
      // You can show an error message to the user
    }}
    else
    {
      try {
        console.warn("Entered");
        const response = await axios.get(`http://localhost:5500/searchhalls?searchQuery=${searchQuery}`);
        setHalls(response.data); // Assuming response.data is an array of movie objects
        console.warn("Done");
      } catch (error) {
        console.error('Error fetching movies:', error);
       
        // You can show an error message to the user
      }}

  };
  const fetchMovies2 = async () => {
    
    try {
      console.warn("Entered");
      const response = await axios.get(`http://localhost:5500/searchhalls?searchQuery=${searchQuery}`);
      setHalls(response.data); // Assuming response.data is an array of movie objects
      console.warn("Done");
     
    } catch (error) {
      console.error('Error fetching halls:', error);
     
      // You can show an error message to the user
    }
}
  useEffect(() => {
    

    fetchMovies(); // Call the fetchMovies function when the component mounts
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    fetchMovies2();
    // Logic to search for halls based on searchQuery
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">Search Hall</div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search by hall name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary">Search</button>
                  </div>
                </div>
              </form>
              <div className="mt-3 row">
                {halls.map(hall => (
                  <div key={hall.hall_id} className="col mb-3">
                    <div className="card" style={{ minWidth: '300px' }}>
                      <div className="card-body">
                        <h5 className="card-title">{hall.hall_name}</h5>
                        <p className="card-text">{hall.location}</p>
                        <Link to={`/hall/${hall.hall_id}`} className="btn btn-primary">Book Tickets</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHall;
