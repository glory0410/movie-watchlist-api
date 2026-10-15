
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow the API to receive JSON data
app.use(express.json());

// Initial movie data
let movies = [
  {
    id: 1,
    title: "The Avengers",
    genre: "Action",
    watched: true
  },
  {
    id: 2,
    title: "Interstellar",
    genre: "Sci-Fi",
    watched: false
  },
  {
    id: 3,
    title: "The Conjuring",
    genre: "Horror",
    watched: false
  }
];

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Movie Watchlist API!"
  });
});

// GET: Retrieve all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// GET: Retrieve one movie by ID
app.get("/movies/:id", (req, res) => {
  const movie = movies.find(
    (m) => m.id === Number(req.params.id)
  );

  if (!movie) {
    return res.status(404).json({
      message: "Movie not found"
    });
  }

  res.json(movie);
});

// POST: Add a new movie
app.post("/movies", (req, res) => {
  const { title, genre, watched } = req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof genre !== "string" ||
    !genre.trim() ||
    typeof watched !== "boolean"
  ) {
    return res.status(400).json({
      message: "Provide title, genre, and watched (true or false)."
    });
  }

  const newMovie = {
    id: Math.max(0, ...movies.map((m) => m.id)) + 1,
    title: title.trim(),
    genre: genre.trim(),
    watched
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// PUT: Replace all editable fields of a movie
app.put("/movies/:id", (req, res) => {
  const index = movies.findIndex(
    (m) => m.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Movie not found"
    });
  }

  const { title, genre, watched } = req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof genre !== "string" ||
    !genre.trim() ||
    typeof watched !== "boolean"
  ) {
    return res.status(400).json({
      message: "Provide title, genre, and watched (true or false)."
    });
  }

  movies[index] = {
    id: movies[index].id,
    title: title.trim(),
    genre: genre.trim(),
    watched
  };

  res.json(movies[index]);
});

// PATCH: Update selected fields only
app.patch("/movies/:id", (req, res) => {
  const movie = movies.find(
    (m) => m.id === Number(req.params.id)
  );

  if (!movie) {
    return res.status(404).json({
      message: "Movie not found"
    });
  }

  const allowedFields = ["title", "genre", "watched"];
  const updates = Object.keys(req.body);

  if (
    updates.length === 0 ||
    updates.some((field) => !allowedFields.includes(field))
  ) {
    return res.status(400).json({
      message: "Provide at least one valid field to update."
    });
  }

  if (
    ("title" in req.body &&
      (typeof req.body.title !== "string" ||
        !req.body.title.trim())) ||
    ("genre" in req.body &&
      (typeof req.body.genre !== "string" ||
        !req.body.genre.trim())) ||
    ("watched" in req.body &&
      typeof req.body.watched !== "boolean")
  ) {
    return res.status(400).json({
      message: "Invalid field value."
    });
  }

  if ("title" in req.body) movie.title = req.body.title.trim();
  if ("genre" in req.body) movie.genre = req.body.genre.trim();
  if ("watched" in req.body) movie.watched = req.body.watched;

  res.json(movie);
});

// DELETE: Remove a movie
app.delete("/movies/:id", (req, res) => {
  const index = movies.findIndex(
    (m) => m.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Movie not found"
    });
  }

  const deletedMovie = movies.splice(index, 1)[0];

  res.json({
    message: "Movie deleted successfully",
    movie: deletedMovie
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Movie Watchlist API running on port ${PORT}`);
});
