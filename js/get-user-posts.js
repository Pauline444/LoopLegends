document.addEventListener("DOMContentLoaded", () => {
  const postsLink = document.getElementById("post.link");
  const contentContainer = document.querySelector(
    ".interactive-content-container"
  );

  const userPostsIds = {}; // Object to store post IDs linked to user IDs and get comments for every post

  postsLink.addEventListener("click", handlePostsClick);

  function handlePostsClick(e) {
    e.preventDefault();

    if (window.currentUser) {
      const userId = window.currentUser.id;
      const username = window.currentUser.username;
      fetchUserPosts(userId, username);
    } else {
      contentContainer.innerHTML =
        "<p>Vänligen välj en användare från listan för att se deras inlägg.</p>";
    }
  }

  async function fetchUserPosts(userId, username) {
    // Check if user header already exists for this user
    let headerExists = false;
    let userHeader = null;
    
    if (window.UserHeaderCreator) {
      const headerState = window.UserHeaderCreator.checkExistingHeader(contentContainer);
      headerExists = headerState.exists && headerState.userId === parseInt(userId, 10);
      
      if (headerExists) {
        userHeader = contentContainer.querySelector('.user-header-container');
      }
    }
    
    // Clear the interactive content container
    contentContainer.innerHTML = "";
    
    // If header existed for this user, put it back first
    if (headerExists && userHeader) {
      contentContainer.appendChild(userHeader);
    } else {
      // Create a loading indicator
      const loadingIndicator = document.createElement("p");
      loadingIndicator.textContent = "Laddar användarinformation...";
      contentContainer.appendChild(loadingIndicator);
      
      // Use the UserHeaderCreator module to create a detailed user header
      if (window.UserHeaderCreator) {
        try {
          userHeader = await window.UserHeaderCreator.createUserHeader(userId, username);
          // Replace loading indicator with user header
          contentContainer.replaceChild(userHeader, loadingIndicator);
        } catch (error) {
          console.error('Failed to create user header:', error);
          const fallbackHeader = document.createElement('h2');
          fallbackHeader.textContent = `Inlägg för ${username}`;
          // Replace loading indicator with fallback header
          contentContainer.replaceChild(fallbackHeader, loadingIndicator);
        }
      } else {
        // Fallback if module is not available
        const heading = document.createElement("h2");
        heading.textContent = `Inlägg för ${username}`;
        contentContainer.replaceChild(heading, loadingIndicator);
        console.error('UserHeaderCreator module not found');
      }
    }
    
    // Create the posts-wrapper div
    const postsWrapper = document.createElement("div");
    postsWrapper.classList.add("posts-wrapper");
    contentContainer.appendChild(postsWrapper);

    // Create the posts-container div
    const postsContainer = document.createElement("div");
    postsContainer.classList.add("posts-container");
    postsContainer.textContent = "Laddar inlägg...";
    postsWrapper.appendChild(postsContainer);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      displayPosts(userId, posts, postsContainer); // Pass userId to displayPosts
    } catch (error) {
      console.error("Kunde inte hämta inlägg:", error);
      postsContainer.innerHTML =
        "<p>Kunde inte hämta inlägg för den här användaren.</p>";
    }
  }

  function displayPosts(userId, posts, container) {
    container.innerHTML = "";

    // Initialize the array for the current user if it doesn't exist
    if (!userPostsIds[userId]) {
      userPostsIds[userId] = [];
    } else {
      userPostsIds[userId] = []; // Reset the array for the current user's posts
    }

    if (posts.length === 0) {
      container.innerHTML =
        "<p>Inga inlägg hittades för den här användaren.</p>";
      return;
    }

    posts.forEach((post) => {
      // Store the post ID in the object, linked to the userId
      userPostsIds[userId].push(post.id);

      const postCard = document.createElement("div");
      postCard.classList.add("post-card");
      postCard.dataset.postId = post.id;

      const title = document.createElement("h3");
      title.textContent = post.title;

      const body = document.createElement("p");
      body.classList.add("post-body");
      body.textContent = post.body;

      postCard.appendChild(title);
      postCard.appendChild(body);
      container.appendChild(postCard);
    });

    // Trigga en event för att signalera att poster har laddats
    // Detta kommer att fånga upp av vår get-post-comments.js
    const event = new CustomEvent("postsLoaded", {
      detail: {
        userId: userId,
        postIds: userPostsIds[userId],
      },
    });
    document.dispatchEvent(event);
  }
});
