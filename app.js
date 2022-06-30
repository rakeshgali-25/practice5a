const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();

module.exports = app;

app.use(express.json());

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
  response.send(moviesArray);
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
  const movieId = request.params;
  const movieQuery = `
    SELECT *
    FROM MOVIE
    WHERE movie_id=${movieId}`;

  const movie = await dataBase.get(movieQuery);

  response.send(convertMovieDbObjectToResponseObject(movie));
});
