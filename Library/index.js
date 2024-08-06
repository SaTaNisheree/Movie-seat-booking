const express = require('express');
const app = express();
const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookshow',
  password: 'codeworld',
  port: 6500, // Default PostgreSQL port
});
const bookController = require('./bookController'); // Update the path based on your project structure
const cors = require('cors'); // Import cors module
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Route to fetch all movies
app.get('/movies', bookController.getAllMovies);
// Route to fetch all halls
app.get('/halls',  bookController.getAllHalls);
// Route to create a movie
app.post('/movies', bookController.createMovie);
app.post('/halls', bookController.createHall);
app.post('/shows', bookController.createShow);
app.get('/searchmovies', (req, res) => {
  const { searchQuery } = req.query;

  let selectQuery = `SELECT * FROM movies`;
  const queryParams = [];

  if (searchQuery) {
    selectQuery += ` WHERE name ILIKE $1`;
    queryParams.push(`%${searchQuery}%`);
  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving movies");
    } else {
      res.json(results.rows);
    }
  });
});

// Fetch all hall details with search by location (substring match)
app.get('/searchhalls', (req, res) => {
  const { searchQuery } = req.query;

  let selectQuery = `SELECT * FROM halls`;
  const queryParams = [];

  if (searchQuery) {
    selectQuery += ` WHERE location ILIKE $1 OR hall_name ILIKE $1`;
    queryParams.push(`%${searchQuery}%`);
  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving halls");
    } else {
      res.json(results.rows);
    }
  });
});


app.get('/movie/:movie_id', (req, res) => {
  const { movie_id } = req.params;

  let selectQuery = `SELECT * FROM movies`;
  const queryParams = [];

  if (movie_id) {
    selectQuery += ` WHERE movie_id = $1`;
    queryParams.push(`${movie_id}`);
  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving movie");
    } else {
      res.json(results.rows);
    }
  });
});


app.get('/hall/:hall_id', (req, res) => {
  const { hall_id } = req.params;

  let selectQuery = `SELECT * FROM halls`;
  const queryParams = [];

  if (hall_id) {
    selectQuery += ` WHERE hall_id = $1`;
    queryParams.push(`${hall_id}`);
  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving hall");
    } else {
      res.json(results.rows);
    }
  });
});



app.get('/halls/movie/:movie_id', async (req, res) => {
  const { movie_id } = req.params; // Assuming movie_id is provided as a URL parameter

  if (!movie_id) {
    return res.status(400).send("movie_id parameter is required");
  }
  const selectQuery = `
  SELECT DISTINCT ON (halls.hall_id, halls.hall_name, halls.location)
    halls.hall_id,
    halls.hall_name,
    halls.location
  FROM
    halls
  INNER JOIN
    hall_movies ON halls.hall_id = hall_movies.hall_id
  WHERE
    hall_movies.movie_id = $1
`;

  try {
    const { rows } = await pool.query(selectQuery, [movie_id]); // Await the query execution
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving halls for the given movie:', err);
    res.status(500).send("Error retrieving halls for the given movie");
  }
});


app.get('/movie/halls/:hall_id', async (req, res) => {
  const { hall_id } = req.params; // Assuming movie_id is provided as a URL parameter

  if (!hall_id) {
    return res.status(400).send("movie_id parameter is required");
  }
  const selectQuery = `
  SELECT DISTINCT ON (movies.movie_id,
    movies.name,
    movies.description)
  movies.movie_id,
  movies.name,
  movies.description
  FROM
    movies
  INNER JOIN
    hall_movies ON movies.movie_id = hall_movies.movie_id
  WHERE
    hall_movies.hall_id = $1
`;

  try {
    const { rows } = await pool.query(selectQuery, [hall_id]); // Await the query execution
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving halls for the given movie:', err.message);
    res.status(500).send("Error retrieving halls for the given movie");
  }
});





app.get('/halls/movietime/:movie_id', async (req, res) => {
  const { movie_id } = req.params; // Assuming movie_id is provided as a URL parameter
  if (!movie_id) {
    return res.status(400).send("movie_id parameter is required");
  }
  const selectQuery = `
  SELECT 
   serial_no,
    hall_id,
    show_date_time
  FROM
    hall_movies
  WHERE movie_id = $1
`;
  try {
    const { rows } = await pool.query(selectQuery, [movie_id]); // Await the query execution
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving halls for the given movie:', err);
    res.status(500).send("Error retrieving halls for the given movie");
  }
});



app.get('/movie/movietime/:hall_id', async (req, res) => {
  const { hall_id } = req.params; // Assuming movie_id is provided as a URL parameter
  if (!hall_id) {
    return res.status(400).send("movie_id parameter is required");
  }
  const selectQuery = `
  SELECT 
   serial_no,
    movie_id,
    show_date_time
  FROM
    hall_movies
  WHERE hall_id = $1
`;
  try {
    const { rows } = await pool.query(selectQuery, [hall_id]); // Await the query execution
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving halls for the given movie:', err);
    res.status(500).send("Error retrieving halls for the given movie");
  }
});



app.get('/seats/:serial_no', async (req, res) => {
  const { serial_no } = req.params;

  let selectQuery = `SELECT 
  seat_status
 FROM
 seats`;
  const queryParams = [];

  if (serial_no) {
    selectQuery += ` WHERE serial_no = $1`;
    queryParams.push(`${serial_no}`);
  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving movie");
    } else {
      res.json(results.rows);
    }
  });
});

app.post('/bookseats', async (req, res) => {
  const { serialNo, selectedSeats } = req.body;

  // Check if all selected seats are empty
  let selectQuery = `
    SELECT seat_status
    FROM seats
    WHERE serial_no = $1
  `;

  pool.query(selectQuery, [serialNo], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking seat status");
    }

    const seatStatus = result.rows[0]?.seat_status;
    console.log("Seat Status:", seatStatus); // Log the fetched seat status

    // Ensure seatStatus is an array of strings
    const seatStatusArray = seatStatus || [];

    const allSeatsEmpty = selectedSeats.every(seatIndex => seatStatusArray[seatIndex] == '' );

    if (!allSeatsEmpty) {
      return res.status(400).send("Selected seats are not empty");
    }

    // Construct the UPDATE query to book the selected seats
    let updateQuery = `
      UPDATE seats
      SET seat_status = $1
      WHERE serial_no = $2
    `;

    // Construct the new seat status array with selected seats marked as 'booked'
    const newSeatStatusArray = [...seatStatusArray];
    selectedSeats.forEach(index => {
      newSeatStatusArray[index] = 'booked';
    });

    pool.query(updateQuery, [newSeatStatusArray, serialNo], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error booking seats");
      }
      res.json({ success: true });
    });
  });
});





// app.get('/gethalls', bookController.searchAllHalls); // Fetch all movies
// Start the server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
