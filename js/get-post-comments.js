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
      // Hämta kommentarer för det aktuella inlägget
      await fetchPostComments(postId);
    }
  });

  // Funktion för att hämta kommentarer för ett specifikt inlägg
  async function fetchPostComments(postId) {
    try {
      console.log(`Hämtar kommentarer för inlägg ${postId}`);

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

      // Visa de tre första kommentarerna
      displayComments(postId, limitedComments);
    } catch (error) {
      console.error(
        `Kunde inte hämta kommentarer för inlägg ${postId}:`,
        error
      );
    }
  }

  // Funktion för att visa kommentarer för ett inlägg
  function displayComments(postId, comments) {
    // Hitta det aktuella inläggskortet baserat på postId
    const postCard = document.querySelector(
      `.post-card[data-post-id="${postId}"]`
    );

    if (!postCard) {
      console.error(`Kunde inte hitta inläggskortet för inlägg ${postId}`);
      return;
    }

    // Kontrollera om det redan finns en kommentarscontainer
    const existingCommentsContainer = postCard.querySelector(
      ".comments-container"
    );
    if (existingCommentsContainer) {
      console.log(
        `Tar bort befintlig kommentarscontainer för inlägg ${postId}`
      );
      existingCommentsContainer.remove();
    }

    // Skapa en container för kommentarerna
    const commentsContainer = document.createElement("div");
    commentsContainer.classList.add("comments-container");

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

    // Lägg till kommentarerna till inläggskortet
    postCard.appendChild(commentsContainer);
    console.log(`Kommentarscontainer tillagd till inlägg ${postId}`);
  }
});
