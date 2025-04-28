document.addEventListener("DOMContentLoaded", () => {
  // Listen for postsLoaded event sent from get-user-posts.js
  document.addEventListener("postsLoaded", async (event) => {
    const { userId, postIds } = event.detail;

    // Add a larger delay to ensure DOM is fully updated
    setTimeout(async () => {
      // Loop through all post IDs for the current user
      for (const postId of postIds) {
        const postCard = document.querySelector(
          `.post-card[data-post-id="${postId}"]`
        );

        if (postCard) {
          addCommentToggleButton(postId);
          await fetchPostComments(postId, false);
        } else {
          console.log(`Post card for post ${postId} not found yet, skipping`);
          // Don't try to add comment buttons to posts that don't exist
        }
      }
    }, 300); // Increased delay to give more time for DOM updates
  });

  // Function to add a comment toggle button
  function addCommentToggleButton(postId) {
    const postCard = document.querySelector(
      `.post-card[data-post-id="${postId}"]`
    );

    if (!postCard) {
      // Instead of error logging, just return silently
      return;
    }

    // Check if button already exists to prevent duplicates
    if (postCard.querySelector(".comment-toggle-btn")) {
      return;
    }

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("comment-toggle-btn");
    toggleButton.textContent = "Visa kommentarer";
    toggleButton.dataset.state = "hidden";

    toggleButton.addEventListener("click", async () => {
      const state = toggleButton.dataset.state;
      const commentsContainer = postCard.querySelector(".comments-container");

      if (state === "hidden") {
        if (!commentsContainer) {
          await fetchPostComments(postId, true);
        } else {
          commentsContainer.style.display = "block";
        }
        toggleButton.textContent = "Dölj kommentarer";
        toggleButton.dataset.state = "visible";
      } else {
        if (commentsContainer) {
          commentsContainer.style.display = "none";
        }
        toggleButton.textContent = "Visa kommentarer";
        toggleButton.dataset.state = "hidden";
      }
    });

    postCard.appendChild(toggleButton);
  }

  // Function to fetch comments for a specific post
  async function fetchPostComments(postId, showImmediately = false) {
    try {
      const postCard = document.querySelector(
        `.post-card[data-post-id="${postId}"]`
      );

      if (!postCard) {
        return; // Silently return if post card not found
      }

      const existingCommentsContainer = postCard.querySelector(
        ".comments-container"
      );

      if (existingCommentsContainer && !showImmediately) {
        return;
      }

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allComments = await response.json();
      const limitedComments = allComments.slice(0, 3);

      displayComments(postId, limitedComments, showImmediately);
    } catch (error) {
      console.log(`Issue with comments for post ${postId}`);
    }
  }

  // Function to display comments for a post
  function displayComments(postId, comments, showImmediately = true) {
    const postCard = document.querySelector(
      `.post-card[data-post-id="${postId}"]`
    );

    if (!postCard) {
      return; // Silently return if post card not found
    }

    let commentsContainer = postCard.querySelector(".comments-container");

    if (commentsContainer) {
      commentsContainer.innerHTML = "";
    } else {
      commentsContainer = document.createElement("div");
      commentsContainer.classList.add("comments-container");

      if (!showImmediately) {
        commentsContainer.style.display = "none";
      }
    }

    const commentsHeading = document.createElement("h4");
    commentsHeading.textContent = "Comments:";
    commentsContainer.appendChild(commentsHeading);

    const commentsList = document.createElement("ul");
    commentsList.classList.add("comments-list");
    commentsContainer.appendChild(commentsList);

    comments.forEach((comment) => {
      const commentItem = document.createElement("li");
      commentItem.classList.add("comment-item");
      commentItem.textContent = comment.body;
      commentsList.appendChild(commentItem);
    });

    if (!postCard.contains(commentsContainer)) {
      postCard.appendChild(commentsContainer);
    }

    const toggleButton = postCard.querySelector(".comment-toggle-btn");
    if (toggleButton && showImmediately) {
      toggleButton.textContent = "Dölj kommentarer";
      toggleButton.dataset.state = "visible";
    }
  }
});
