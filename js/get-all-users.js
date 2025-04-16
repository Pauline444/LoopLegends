import { saveUserId } from './userSession.js';

document.addEventListener("DOMContentLoaded", () => {
    async function fetchAllUsers() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");

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

        // Delete this row if we don't have previous html elements inside aside class="aside-container". Clear any existing content in the aside container
        asideContainer.innerHTML = "";

        if (users && users.length > 0) {
            users.forEach(user => {
                const asideUser = document.createElement("section");
                asideUser.classList.add("aside-user");

                // For saving userID
                asideUser.dataset.userid = user.id;

                const profileImg = document.createElement("img");
                profileImg.src = "assets/images/profile-image/profile_pic.jpg"; // Use default img from html if we don't find a profile-img from JSONPlaceholder
                profileImg.alt = `${user.username}'s profile`;

                const usernameHeading = document.createElement("h2");
                usernameHeading.textContent = user.username;

                asideUser.appendChild(profileImg);
                asideUser.appendChild(usernameHeading);
                asideContainer.appendChild(asideUser);

                //Click listener to know which userID each element is
                asideUser.addEventListener("click", () => {
                    console.log("Clicked user:", user.username, user.id);
                    saveUserId(user.id);
                });

            });
        } else {
            asideContainer.textContent = "No users found.";
        }
    }

    fetchAllUsers(); // Call the function to initiate the API request
});