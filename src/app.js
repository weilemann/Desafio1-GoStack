const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find((repository) => repository.id == id);

  const { likes } = repository;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found. Did you type the correct id?' });
  }

  const updatedRepository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id == id);

  let { title, url, techs, likes } = repository;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found. Did you type the correct id?' });
  }

  const updatedRepository = { id, title, url, techs, likes: likes + 1 };

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
