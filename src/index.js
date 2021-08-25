const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const error = {
  error: "Mensagem do erro",
};

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) return response.status(400).json(error);

  console.log(user);
  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const checkUserExists = users.some((user) => user.username === username);

  if (checkUserExists) return response.status(400).json(error);

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json(error);

  todo.title = title;
  todo.done = false;
  todo.deadline = new Date(deadline);

  return response.json({
    title,
    done: false,
    deadline: todo.deadline,
  });
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json(error);

  todo.done = true;

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json(error);

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;
