import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddMovie = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const movie = { name, description, language, rating };

    axios.post('http://localhost:5500/movies', movie)
      .then(response => {
        console.log('Movie added:', response.data);
        setName('');
        setDescription('');
        setLanguage('');
        setRating('');
      })
      .catch(error => {
        console.error('There was an error adding the movie!', error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formMovieName">
        <Form.Label>Movie Name</Form.Label>
        <Form.Control type="text" placeholder="Enter movie name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formMovieDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formMovieLanguage">
        <Form.Label>Language</Form.Label>
        <Form.Control type="text" placeholder="Enter language" value={language} onChange={(e) => setLanguage(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formMovieRating">
        <Form.Label>Rating</Form.Label>
        <Form.Control type="number" step="0.1" placeholder="Enter rating" value={rating} onChange={(e) => setRating(e.target.value)} required />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Add Movie
      </Button>
    </Form>
  );
};

export default AddMovie;
