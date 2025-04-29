// make function global so it can be called from get-all-users.js
async function showUserTodoList(userId, username) {
  const contentContainer = document.querySelector(
    ".interactive-content-container"
  );

  // Check if we already have a header for the current user
  let headerExists = false;
  let userHeader = null;

  if (window.UserHeaderCreator) {
    const headerState =
      window.UserHeaderCreator.checkExistingHeader(contentContainer);
    headerExists =
      headerState.exists && headerState.userId === parseInt(userId, 10);

    if (headerExists) {
      userHeader = contentContainer.querySelector(".user-header-container");
    }
  }

  // Clear the entire container but save the header if it exists
  if (headerExists && userHeader) {
    // Store the header temporarily
    userHeader = userHeader.cloneNode(true);
    contentContainer.innerHTML = "";
    // Put the header back as the first element
    contentContainer.appendChild(userHeader);
  } else {
    // Clear everything and create a new header
    contentContainer.innerHTML = "";

    // If we have the user header creator module, use it to create a detailed header
    if (window.UserHeaderCreator) {
      const loadingIndicator = document.createElement("p");
      loadingIndicator.textContent = "Laddar användarinformation...";
      contentContainer.appendChild(loadingIndicator);

      try {
        userHeader = await window.UserHeaderCreator.createUserHeader(
          userId,
          username
        );
        // Replace loading indicator with the user header
        contentContainer.replaceChild(userHeader, loadingIndicator);
      } catch (error) {
        console.error("Failed to create user header:", error);
        const fallbackHeader = document.createElement("h2");
        fallbackHeader.textContent = `Todo-lista för ${username}`;
        // Replace loading indicator with fallback header
        contentContainer.replaceChild(fallbackHeader, loadingIndicator);
      }
    } else {
      // Fall back to simple header if module isn't available
      const simpleHeader = document.createElement("h2");
      simpleHeader.textContent = `Todo-lista för ${username}`;
      contentContainer.appendChild(simpleHeader);
    }
  }

  // Now create the todo wrapper as a separate container
  const todoWrapper = document.createElement("div");
  todoWrapper.classList.add("todo-wrapper");
  contentContainer.appendChild(todoWrapper);

  // Create a new todo list element
  const todoList = document.createElement("ul");
  todoList.classList.add("todo-list");
  todoList.innerHTML = "Laddar todo-lista...";
  todoWrapper.appendChild(todoList);

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

      // Clear loading message
      todoList.innerHTML = "";

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

        // Add checked class if completed
        if (todo.completed) {
          li.classList.add("checked");
        }
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
