// Global variabel för att spara den aktuella användaren /Mikaela
window.currentUser = null;

import { saveUserId } from "./userSession.js"; //för att spara userID per användare (dynamiskt)

document.addEventListener("DOMContentLoaded", () => {
  async function fetchAllUsers() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      const allUsers = await response.json();
      displayUsersInAside(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      const asideContainer = document.querySelector(".aside-container");
      if (asideContainer) {
        asideContainer.textContent = "Failed to load users.";
      }
    }
  }

  function displayUsersInAside(users) {
    const asideContainer = document.querySelector(".aside-container");

    if (!asideContainer) {
      console.error("class:'aside-container' was not found in the HTML.");
      return;
    }

    asideContainer.innerHTML = "";

    if (users && users.length > 0) {
      users.forEach((user) => {
        const asideUser = document.createElement("section");
        asideUser.classList.add("aside-user");

        // Save userId i dataset for later purpose /Mikaela
        asideUser.dataset.userId = user.id;

        const usernameHeading = document.createElement("h2");
        usernameHeading.textContent = user.username;

        asideUser.appendChild(usernameHeading);
        asideContainer.appendChild(asideUser);

        // onclick on user-element /Mikaela
        asideUser.addEventListener("click", () => {
          // Remove active class from all users first
          document.querySelectorAll('.aside-user').forEach(userEl => {
            userEl.classList.remove('aside-user-active');
          });
          
          // Add active class to the clicked user
          asideUser.classList.add('aside-user-active');
          
          // Save current user in a global variable
          window.currentUser = { id: user.id, username: user.username };

          // Save user ID to session
          saveUserId(user.id);

          // Spara användaren globalt
          window.currentUser = { id: user.id, username: user.username };

          // Spara användar-ID i sessionStorage
          saveUserId(user.id);

          // Simulera klick på länken som visar posts
          const postLink = document.getElementById("post.link");
          if (postLink) {
            postLink.click();
          } else {
            console.warn("post.link hittades inte i DOM:en");
          }

          console.log("Clicked user:", user.username, user.id);
        });
      });
    } else {
      asideContainer.textContent = "No users found.";
    }
  }

  fetchAllUsers(); // Call the function to initiate the API request
});
