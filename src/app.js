const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', validateId);

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID' });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repositorie => repositorie.id === id);

  if(index < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  const likes = repositories[index].likes;

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[index] = repositorie;

  return response.json(repositorie);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repositorie => repositorie.id === id);

  if(index < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repositorie => repositorie.id === id);

  if(index < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  const {
    title,
    url,
    techs,
    likes,
  } = repositories[index];

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: likes + 1,
  }

  repositories[index] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
