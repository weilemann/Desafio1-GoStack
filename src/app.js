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

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found. Did you type the correct id?' });
  }

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title: title ? title : repositories[repositoryIndex].title,
    url: url ? url : repositories[repositoryIndex].url,
    techs: techs ? techs : repositories[repositoryIndex].techs,
  };

  return response.json(repositories[repositoryIndex]);
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

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found. Did you type the correct id?' });
  }

  let { title, url, techs, likes } = repository;

  const updatedRepository = { id, title, url, techs, likes: likes + 1 };

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
