const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookshow',
  password: 'codeworld',
  port: 6500, // Default PostgreSQL port
});

// Connect to PostgreSQL
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
});

// Fetch all movie details
exports.getAllMovies = (req, res) => {
  const selectQuery = `SELECT * FROM movies`;

  pool.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving movies");
    } else {
      res.json(results.rows); // Assuming you want to send JSON response
    }
  });
};

// Create a movie
exports.createMovie = (req, res) => {
  const { name, description, language, rating } = req.body;
  const insertMovieQuery = `INSERT INTO movies (name, description, language, rating) VALUES ($1, $2, $3, $4) RETURNING movie_id`;

  pool.query(insertMovieQuery, [name, description, language, rating], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating movie");
    } else {
      const movieId = result.rows[0].movie_id;
      console.log("Movie created successfully with ID:", movieId);
      res.status(201).send("Movie created successfully");
    }
  });
};
exports.createHall = (req, res) => {
  const { hall_name, location } = req.body;
  const insertMovieQuery = `INSERT INTO halls (hall_name, location) VALUES ($1, $2 ) RETURNING hall_id`;

  pool.query(insertMovieQuery, [hall_name, location], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating hall");
    } else {
      const hall_id = result.rows[0].hall_id;
      console.log("Hall created successfully with ID:", hall_id);
      res.status(201).send("Hall created successfully");
    }
  });
};


exports.createShow = (req, res) => {
  const { hall_id, movie_id, show_date_time } = req.body;
  const insertShowQuery = `INSERT INTO hall_movies (hall_id, movie_id, show_date_time) VALUES ($1, $2, $3) RETURNING serial_no`;

  pool.query(insertShowQuery, [hall_id, movie_id, show_date_time], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating show");
    } else {
      const serial_no = result.rows[0].serial_no;
      console.log("Show created successfully with Serial No:", serial_no);
      res.status(201).send("Show created successfully");
    }
  });
};

// Fetch all hall details
exports.getAllHalls = (req, res) => {
  const selectQuery = `SELECT * FROM halls`;

  pool.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving halls");
    } else {
      res.json(results.rows); // Send JSON response with halls data
    }
  });
};
// Fetch all movie details with search by name (substring match)
exports.searchAllMovies = (req, res) => {
  const { searchQuery } = req.query; // Assuming search query is provided as a query parameter

  let selectQuery = `SELECT * FROM movies`;
  const queryParams = [];

  // Check if searchQuery is provided
  if (searchQuery) {
    selectQuery += ` WHERE name ILIKE $1`; // ILIKE for case-insensitive match
    queryParams.push(`%${searchQuery}%`);
  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving movies");
    } else {
      res.json(results.rows); // Send JSON response with movies data
    }
  });
};

// Fetch all hall details with search by location (substring match)
exports.searchAllHalls = (req, res) => {
  const { searchQuery } = req.query; // Assuming search query is provided as a query parameter

  let selectQuery = `SELECT * FROM halls`;
  const queryParams = [];

  // Check if searchQuery is provided
  if (searchQuery) {
    selectQuery += ` WHERE location ILIKE $1 `; // ILIKE for case-insensitive match
    queryParams.push(`%${searchQuery}%`);

  }

  pool.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving halls");
    } else {
      res.json(results.rows); // Send JSON response with halls data
    }
  });
};

exports.getHallsByMovieId = async (req, res) => {
  const { movie_id } = req.params; // Assuming movie_id is provided as a URL parameter

  if (!movie_id) {
    return res.status(400).send("movie_id parameter is required");
  }

  const selectQuery = `
    SELECT
      halls.hall_id,
      halls.hall_name,
      halls.location,
      hall_movies.show_date_time
    FROM
      halls
    INNER JOIN
      hall_movies ON halls.hall_id = hall_movies.hall_id
    WHERE
      hall_movies.movie_id = $1
  `;

  try {
    const results = await pool.query(selectQuery, [movie_id]);
    res.json(results.rows);
  } catch (err) {
    console.error('Error retrieving halls for the given movie:', err);
    res.status(500).send("Error retrieving halls for the given movie");
  }
};
