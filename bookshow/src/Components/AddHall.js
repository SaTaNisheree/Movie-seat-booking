import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddHall = () => {
  const [hallName, setHallName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const hall = { hall_name: hallName, location };

    axios.post('http://localhost:5500/halls', hall)
      .then(response => {
        console.log('Hall added:', response.data);
        setHallName('');
        setLocation('');
      })
      .catch(error => {
        console.error('There was an error adding the hall!', error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formHallName">
        <Form.Label>Hall Name</Form.Label>
        <Form.Control type="text" placeholder="Enter hall name" value={hallName} onChange={(e) => setHallName(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formHallLocation">
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Add Hall
      </Button>
    </Form>
  );
};

export default AddHall;
