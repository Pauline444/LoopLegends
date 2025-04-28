document.addEventListener("DOMContentLoaded", () => {
  // Lyssna på postsLoaded-händelsen som skickas från get-users-post.js
  document.addEventListener("postsLoaded", async (event) => {
    const { userId, postIds } = event.detail;
    console.log(
      "postsLoaded-händelse mottagen för användare",
      userId,
      "med inlägg",
      postIds
    );

    // Loopa igenom alla inläggs-ID för den aktuella användaren
    for (const postId of postIds) {
      // Lägg till en kommentarsknapp för varje inlägg
      addCommentToggleButton(postId);

      // Hämta kommentarer för det aktuella inlägget men visa dem inte direkt
      await fetchPostComments(postId, false);
    }
  });

  // Funktion för att lägga till en kommentarsknapp
  function addCommentToggleButton(postId) {
    const postCard = document.querySelector(
      `.post-card[data-post-id="${postId}"]`
    );

    if (!postCard) {
      console.error(`Kunde inte hitta inläggskortet för inlägg ${postId}`);
      return;
    }

    // Skapa en knapp för att visa/dölja kommentarer
    const toggleButton = document.createElement("button");
    toggleButton.classList.add("comment-toggle-btn");
    toggleButton.textContent = "Visa kommentarer";
    toggleButton.dataset.state = "hidden"; // För att hålla reda på aktuellt tillstånd

    // Lägga till händelselyssnare för knappen
    toggleButton.addEventListener("click", async () => {
      const state = toggleButton.dataset.state;
      const commentsContainer = postCard.querySelector(".comments-container");

      if (state === "hidden") {
        // Om kommentarerna inte finns, hämta dem först
        if (!commentsContainer) {
          await fetchPostComments(postId, true);
        } else {
          commentsContainer.style.display = "block";
        }
        toggleButton.textContent = "Dölj kommentarer";
        toggleButton.dataset.state = "visible";
      } else {
        // Dölj kommentarerna
        if (commentsContainer) {
          commentsContainer.style.display = "none";
        }
        toggleButton.textContent = "Visa kommentarer";
        toggleButton.dataset.state = "hidden";
      }
    });

    // Lägg till knappen till inläggskortet
    postCard.appendChild(toggleButton);
  }

  // Funktion för att hämta kommentarer för ett specifikt inlägg
  async function fetchPostComments(postId, showImmediately = false) {
    try {
      console.log(`Hämtar kommentarer för inlägg ${postId}`);

      // Kontrollera om kommentarer redan har hämtats
      const postCard = document.querySelector(
        `.post-card[data-post-id="${postId}"]`
      );
      const existingCommentsContainer = postCard.querySelector(
        ".comments-container"
      );

      // Om kommentarer redan finns och vi inte behöver visa dem, avsluta
      if (existingCommentsContainer && !showImmediately) {
        return;
      }

      // Hämta alla kommentarer från API:et
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allComments = await response.json();
      console.log(
        `Totalt antal kommentarer för inlägg ${postId}:`,
        allComments.length
      );

      // Ta endast de tre första kommentarerna
      const limitedComments = allComments.slice(0, 3);
      console.log(
        `Begränsat till ${limitedComments.length} kommentarer för inlägg ${postId}`
      );

      // Visa de tre första kommentarerna, med displayOption för att kontrollera synligheten
      displayComments(postId, limitedComments, showImmediately);
    } catch (error) {
      console.error(
        `Kunde inte hämta kommentarer för inlägg ${postId}:`,
        error
      );
    }
  }

  // Funktion för att visa kommentarer för ett inlägg
  function displayComments(postId, comments, showImmediately = true) {
    // Hitta det aktuella inläggskortet baserat på postId
    const postCard = document.querySelector(
      `.post-card[data-post-id="${postId}"]`
    );

    if (!postCard) {
      console.error(`Kunde inte hitta inläggskortet för inlägg ${postId}`);
      return;
    }

    // Kontrollera om det redan finns en kommentarscontainer
    let commentsContainer = postCard.querySelector(".comments-container");

    if (commentsContainer) {
      console.log(
        `Återanvänder befintlig kommentarscontainer för inlägg ${postId}`
      );
      commentsContainer.innerHTML = ""; // Töm den befintliga containern
    } else {
      // Skapa en container för kommentarerna
      commentsContainer = document.createElement("div");
      commentsContainer.classList.add("comments-container");

      // Ställ in synlighet baserat på showImmediately
      if (!showImmediately) {
        commentsContainer.style.display = "none";
      }
    }

    // Skapa en rubrik för kommentarerna
    const commentsHeading = document.createElement("h4");
    commentsHeading.textContent = "Comments:";
    commentsContainer.appendChild(commentsHeading);

    // Skapa en lista för kommentarerna (för att matcha .comments-list i CSS)
    const commentsList = document.createElement("ul");
    commentsList.classList.add("comments-list");
    commentsContainer.appendChild(commentsList);

    console.log(`Visar ${comments.length} kommentarer för inlägg ${postId}`);

    // Loopa igenom kommentarerna och visa dem
    comments.forEach((comment, index) => {
      console.log(`Skapar kommentar ${index + 1} för inlägg ${postId}`);

      // Skapa ett list-item element istället för div (för att matcha .comment-item i CSS)
      const commentItem = document.createElement("li");
      commentItem.classList.add("comment-item");

      // Visa endast kommentarens body/text
      commentItem.textContent = comment.body;

      commentsList.appendChild(commentItem);
    });

    // Lägg till kommentarerna till inläggskortet om de inte redan finns där
    if (!postCard.contains(commentsContainer)) {
      postCard.appendChild(commentsContainer);
      console.log(`Kommentarscontainer tillagd till inlägg ${postId}`);
    }

    // Uppdatera tillståndet för knappen om den finns
    const toggleButton = postCard.querySelector(".comment-toggle-btn");
    if (toggleButton && showImmediately) {
      toggleButton.textContent = "Dölj kommentarer";
      toggleButton.dataset.state = "visible";
    }
  }
});
