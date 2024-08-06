import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const AddShow = () => {
  const [hallId, setHallId] = useState('');
  const [movieId, setMovieId] = useState('');
  const [showDateTime, setShowDateTime] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    const show = { hall_id: hallId, movie_id: movieId, show_date_time: showDateTime.toISOString() };

    axios.post('http://localhost:5500/shows', show)
      .then(response => {
        console.log('Show added:', response.data);
        setHallId('');
        setMovieId('');
        setShowDateTime(new Date());
      })
      .catch(error => {
        console.error('There was an error adding the show!', error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formHallId">
        <Form.Label>Hall ID</Form.Label>
        <Form.Control type="text" placeholder="Enter hall ID" value={hallId} onChange={(e) => setHallId(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formMovieId">
        <Form.Label>Movie ID</Form.Label>
        <Form.Control type="text" placeholder="Enter movie ID" value={movieId} onChange={(e) => setMovieId(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formShowDateTime">
        <Form.Label>Show Date & Time</Form.Label>
        <DatePicker
          selected={showDateTime}
          onChange={(date) => setShowDateTime(date)}
          showTimeSelect
          dateFormat="Pp"
          className="form-control"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Add Show
      </Button>
    </Form>
  );
};

export default AddShow;
