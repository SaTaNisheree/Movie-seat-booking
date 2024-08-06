import React from 'react';
import './App.css';
import MainBody from './Components/MainBody';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchMovie from './Components/SearchMovie';
import MovieDetails from './Components/MovieDetails';
import SeatSelection from './Components/SeatSelection'; // Import SeatSelection component
import HallDetails from './Components/HallDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MainBody />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/hall/:hall_id" element={<HallDetails />} />
        <Route path="/bookseat/:movieId/:hallId/:serialNo" element={<SeatSelection />} /> {/* Render SeatSelection component */}
      </Routes>
    </Router>
  );
}

export default App;
