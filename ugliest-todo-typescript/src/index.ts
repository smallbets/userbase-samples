import userbase, { DatabaseChangeHandler } from 'userbase-js';

interface Todo {
  itemId: string
  todo: string
  complete: boolean
}

const handleLogout = () => {
  userbase.signOut()
    .then(() => showAuth())
    .catch((e: string) => document.getElementById('logout-error').innerText = e);
}

const showTodos = (username: string) => {
  document.getElementById('auth-view').style.display = 'none';
  document.getElementById('todo-view').style.display = 'block';

  // reset the todos view
  document.getElementById('username').innerHTML = username;
  document.getElementById('todos').innerText = '';
  document.getElementById('db-loading').style.display = 'block';
  document.getElementById('db-error').innerText = '';

  userbase.openDatabase({ databaseName: 'todos', changeHandler: handleDatabaseChange })
    .catch((e: string) => document.getElementById('db-error').innerText = e);
}

const showAuth = () => {
  document.getElementById('todo-view').style.display = 'none';
  document.getElementById('auth-view').style.display = 'block';
  (document.getElementById('login-username') as HTMLInputElement).value = '';
  (document.getElementById('login-password') as HTMLInputElement).value = '';
  document.getElementById('login-error').innerText = '';
  (document.getElementById('signup-username') as HTMLInputElement).value = '';
  (document.getElementById('signup-password') as HTMLInputElement).value = '';
  document.getElementById('signup-error').innerText = '';
}

const handleDatabaseChange: DatabaseChangeHandler = (items) => {
  document.getElementById('db-loading').style.display = 'none';

  const todosList = document.getElementById('todos');

  if (items.length === 0) {
    todosList.innerText = 'Empty';
  } else {
    // clear the list
    todosList.innerHTML = '';

    // render all the to-do items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const todo = item.item as Todo

      // build the todo delete button
      const todoDelete = document.createElement('button');
      todoDelete.innerHTML = 'X';
      todoDelete.style.display = 'inline-block';
      todoDelete.onclick = () => {
        userbase.deleteItem({ databaseName: 'todos', itemId: item.itemId })
          .catch((e: string) => document.getElementById('add-todo-error').innerHTML = e);
      }

      // build the todo checkbox
      const todoBox = document.createElement('input');
      todoBox.type = 'checkbox';
      todoBox.id = item.itemId;
      todoBox.checked = todo.complete ? true : false;
      todoBox.onclick = (e) => {
        e.preventDefault();
        userbase.updateItem({ databaseName: 'todos', item: {
          'todo': todo.todo,
          'complete': !todo.complete
        }, itemId: item.itemId })
          .catch((e: string) => document.getElementById('add-todo-error').innerHTML = e);
      }

      // build the todo label
      const todoLabel = document.createElement('label');
      todoLabel.innerHTML = todo.todo;
      todoLabel.style.textDecoration = todo.complete ? 'line-through' : 'none';

      // append the todo item to the list
      const todoItem = document.createElement('div');
      todoItem.appendChild(todoDelete);
      todoItem.appendChild(todoBox);
      todoItem.appendChild(todoLabel);
      todosList.appendChild(todoItem);
    }
  }
}

const handleLogin = (e: Event) => {
  e.preventDefault();

  const username = (document.getElementById('login-username') as HTMLInputElement).value;
  const password = (document.getElementById('login-password') as HTMLInputElement).value;

  userbase.signIn({ username, password, rememberMe: 'local' })
    .then((user) => showTodos(user.username))
    .catch((e: string) => document.getElementById('login-error').innerHTML = e);
}

const handleSignUp = (e: Event) => {
  e.preventDefault();

  const username = (document.getElementById('signup-username') as HTMLInputElement).value;
  const password = (document.getElementById('signup-password') as HTMLInputElement).value;

  userbase.signUp({ username, password, rememberMe: 'local' })
    .then((user) => showTodos(user.username))
    .catch((e: string) => document.getElementById('signup-error').innerHTML = e);
}

const addTodoHandler = (e: Event) => {
  e.preventDefault();

  const todo = (document.getElementById('add-todo') as HTMLInputElement).value;

  userbase.insertItem({ databaseName: 'todos', item: { 'todo': todo } })
    .then(() => (document.getElementById('add-todo') as HTMLInputElement).value = '')
    .catch((e: string) => document.getElementById('add-todo-error').innerHTML = e);
}

document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('signup-form').addEventListener('submit', handleSignUp);
document.getElementById('add-todo-form').addEventListener('submit', addTodoHandler);
document.getElementById('logout-button').addEventListener('click', handleLogout);
document.getElementById('todo-view').style.display = 'none';
document.getElementById('auth-view').style.display = 'none';

userbase.init({ appId: '507612d6-3cd8-489d-9eb0-7c9f0a19411c'})
  .then((session) => session.user ? showTodos(session.user.username) : showAuth())
  .catch(() => showAuth())
  .then(() => document.getElementById('loading-view').style.display = 'none');

