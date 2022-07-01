const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();

let dataBase = null;

const initializeDbAndServer = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at https//localhost:3000/");
    });
  } catch (e) {
    console.log(`DB ERROR:${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
app.use(express.json());

const convertMovieDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const dbQuery = `
    select *
    from movie;`;

  const moviesArray = await dataBase.all(dbQuery);
  response.send(movieArray);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie ( director_id, movie_name, lead_actor)
  VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuery = `
    SELECT *
    FROM MOVIE
    WHERE movie_id=${movieId}`;

  const movie = await dataBase.get(movieQuery);

  response.send(movie);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;

  const updateQuery = `update movie
    set 
    director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    where
    movie_id=${movieId};`;

  await dataBase.run(updateQuery);
  respond.send("updated successfully");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `delete *
        from movie
        where movie_id=${movieId}`;

  await dataBase.run(deleteQuery);
  response.send("movie deleted");
});

app.get("/directors/", async (request, response) => {
  const dbQuery = `
    select *
    from director;`;

  const directorsArray = await dataBase.all(dbQuery);
  response.send(directorsArray);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const dirQuery = `
    select 
        movie_name
    from
    movie 
    where 
    director_id=${directorId}`;

  const movieName = await dataBase.get(dirQuery);
  response.send({ movie_name: movieName });
});

module.exports = app;
