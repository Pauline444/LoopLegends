// make function global so it can be called from get-all-users.js
function showUserTodoList(userId, username) {
  const contentContainer = document.querySelector(
    ".interactive-content-container"
  );
  //
  contentContainer.innerHTML = "";

  // create container for todo-list
  const todoWrapper = document.createElement("div");
  todoWrapper.classList.add("todo-wrapper");
  todoWrapper.innerHTML = `<h2>Todo-lista för ${username}</h2><ul class="todo-list"></ul>`;
  contentContainer.appendChild(todoWrapper);

  const todoList = todoWrapper.querySelector(".todo-list");

  // get todos
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((todos) => {
      const filteredTodos = todos.filter((todo) => todo.userId == userId);

      if (filteredTodos.length === 0) {
        todoList.innerHTML =
          "<li>Inga todo-uppgifter hittades för denna användare.</li>";
        return;
      }

      filteredTodos.forEach((todo) => {
        const li = document.createElement("li");

        // create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
          li.classList.toggle("checked", checkbox.checked);
        });

        const label = document.createElement("label");
        label.textContent = todo.title;

        li.appendChild(checkbox);
        li.appendChild(label);
        todoList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Fel vid hämtning av todo-uppgifter:", error);
      todoList.innerHTML =
        "<li>Ett fel uppstod vid hämtning av todo-uppgifter.</li>";
    });
}

// add eventlistener on to-do-link
document.addEventListener("DOMContentLoaded", () => {
  const todoLink = document.getElementById("todo-link");

  todoLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.currentUser) {
      // show personal todo-listan for the active user
      showUserTodoList(window.currentUser.id, window.currentUser.username);
    } else {
      // If no user chosen, show message.
      const contentContainer = document.querySelector(
        ".interactive-content-container"
      );
      contentContainer.innerHTML =
        "<p>Vänligen välj en användare för att visa deras todo-lista.</p>";
    }
  });
});
