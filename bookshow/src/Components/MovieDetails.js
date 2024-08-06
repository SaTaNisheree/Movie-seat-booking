import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [hallsAndTimings, setHallsAndTimings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchHalls = async () => {
    try {
      const response = await axios.get(`http://localhost:5500/halls/movie/${movieId}`);
      return response.data; // This should return [{hall_id, hall_name, location}]
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchShowTimes = async () => {
    try {
      const response = await axios.get(`http://localhost:5500/halls/movietime/${movieId}`);
      return response.data; // This should return [{hall_id, serial_no, show_date_time}]
    } catch (err) {
      console.error(err);
      return [];
    }
  };


  const fetchMoviedetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5500/movie/${movieId}`);
      if(response.data)
        setMovie( response.data[0]); // This should return [{hall_id, serial_no, show_date_time}]
    } catch (err) {
      console.error(err);
    }
  };

  const processShowTimes = (halls, showTimes) => {
    const hallsWithTimings = halls.map(hall => ({
      ...hall,
      dates: []
    }));

    showTimes.forEach(showTime => {
      const hall = hallsWithTimings.find(h => h.hall_id === showTime.hall_id);
      if (hall) {
        const date = showTime.show_date_time.split('T')[0]; // Extract the date part
        const time = showTime.show_date_time.split('T')[1].slice(0, 5); // Extract the time part (HH:MM)

        let dateEntry = hall.dates.find(d => d.date === date);
        if (!dateEntry) {
          dateEntry = { date, times: [] };
          hall.dates.push(dateEntry);
        }
        dateEntry.times.push({ time, serial_no: showTime.serial_no }); // Include serial_no
      }
    });

    return hallsWithTimings;
  };

  useEffect(() => {
    const fetchData = async () => {
      const halls = await fetchHalls();
      const showTimes = await fetchShowTimes();
      const processedData = processShowTimes(halls, showTimes);
      setHallsAndTimings(processedData);
      if (processedData.length > 0 && processedData[0].dates.length > 0) {
        setSelectedDate(processedData[0].dates[0].date); // Set the first date as default selected date
      }
    };

    const fetchedMovie = {
      id: movieId,
      title: `Movie ${movieId}`,
      description: `Description for Movie ${movieId}`,
      rating: 4.5,
      language: 'English',
    };
    fetchMoviedetails();
    fetchData();
  }, [movieId]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {movie && (
            <div className="card">
              <div className="card-header bg-primary text-white">{"Movie "+ movie.movie_id}</div>
              <div className="card-body">
                <h5 className="card-title">{movie.name}</h5>
                <p className="card-text">{"Description: "+ movie.description}</p>
                <p className="card-text"><small className="text-muted">Rating: {movie.rating} | Language: {movie.language}</small></p>
                <h6 className="mt-4">Select Date:</h6>
                <div className="d-flex flex-wrap mb-3">
                  {hallsAndTimings.length > 0 && hallsAndTimings[0].dates.map((date, index) => (
                    <button
                      key={index}
                      className={`btn mb-2 ${selectedDate === date.date ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ marginRight: '10px' }}
                      onClick={() => handleDateClick(date.date)}
                    >
                      {date.date}
                    </button>
                  ))}
                </div>
                <h6 className="mt-4">Halls and Timings:</h6>
                {hallsAndTimings.map(hall => (
                  <div key={hall.hall_id} className="mb-3">
                    <h6>{hall.hall_name}</h6>
                    <div>
                      {hall.dates.filter(date => date.date === selectedDate).map((date, index) => (
                        <div key={index}>
                          <div className="d-flex flex-wrap">
                            {date.times.map((time, timeIndex) => (
                              <Link key={timeIndex} to={`/bookseat/${movieId}/${hall.hall_id}/${time.serial_no}`} className="btn btn-primary mb-2" style={{ marginRight: '20px' }}>
                                <small>{time.time}</small>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
