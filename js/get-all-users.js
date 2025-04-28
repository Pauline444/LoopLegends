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

    // Function to get the next profile image in sequence
    function getProfileImageSrc(userId) {
      // Start from image 1 (assuming images are named img1.jpg, img2.jpg, etc.)
      // Get the image number based on user ID, cycling back to 1 when needed
      const imageNumber = ((userId - 1) % 10) + 1; // Using modulo 10 to cycle through images 1-10
      return `assets/images/profile-image/img${imageNumber}.jpg`;
    }

    if (users && users.length > 0) {
      users.forEach((user) => {
        const asideUser = document.createElement("section");
        asideUser.classList.add("aside-user");

        // Save userId i dataset for later purpose /Mikaela
        asideUser.dataset.userId = user.id;
        
        // Create profile image element with dynamic image source
        const profileImg = document.createElement("img");
        profileImg.src = getProfileImageSrc(user.id);
        profileImg.alt = `${user.username}'s profile`;
        profileImg.classList.add("profile-image");
        
        // Add error handling for missing images, fallback to default
        profileImg.onerror = function() {
          this.src = "assets/images/profile-image/img1.jpg"; // Fallback to img1 if the sequence image isn't found
          console.log(`Image for user ${user.id} not found, using fallback`);
        };
        
        const usernameHeading = document.createElement("h2");
        usernameHeading.textContent = user.username;

        // Add the profile image before the username
        asideUser.appendChild(profileImg);
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
