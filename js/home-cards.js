'use strict';

// Listen for DOMContentLoaded or when the showHomepage event is fired
document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
    
    // Also listen for the showHomepage event to refresh data when returning to home
    document.addEventListener('showHomepage', fetchUsers);
    
    // Add listener for the new loadHomeCards event
    document.addEventListener('loadHomeCards', fetchUsers);
});

async function fetchUsers() {
    // Find the user cards container which is now inside the interactive-content-container
    const userCardsContainer = document.querySelector('.interactive-content-container .main-content-cards');
    
    if (!userCardsContainer) {
        console.error('Could not find .main-content-cards container');
        return;
    }
    
    try {
        const [usersResponse, postsResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users'),
            fetch('https://jsonplaceholder.typicode.com/posts')
        ]);

        const users = await usersResponse.json();
        const posts = await postsResponse.json();

        showUsers(users, posts, userCardsContainer);
    } catch (error) {
        console.error('Error fetching users: ', error);
        userCardsContainer.innerHTML = '<h3>Ett fel inträffade vid hämtningen av användare.</h3>';
    }
}

function showUsers(users, posts, userCardsContainer) {
    userCardsContainer.innerHTML = '';
    try {
        users.forEach(user => {

            const userFirstPost = posts.find(post => post.userId === user.id);
            const postPreview = userFirstPost
                ? userFirstPost.title.substring(0, 100) + (userFirstPost.title.length > 100 ? '...' : '')
                : 'Ingen bloggpost tillgänglig';

            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            userCard.innerHTML = `
                <div class="user-info">
                    <h3>${user.username}</h3>
                    <p>${user.name}</p>
                    <p><a href="mailto:${user.email}">${user.email}</a></p>
                    <p class="post-preview">${postPreview}</p>
                </div>`;

            userCard.addEventListener('click', function () {
                window.currentUser = {
                    id: user.id,
                    username: user.username
                };

                const postLink = document.getElementById('post.link');
                if (postLink) {
                    postLink.click();
                } else {
                    console.error('Kunde inte hitta elementet med ID post.link');
                }
            });

            // Lägger till korten i containern
            userCardsContainer.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error displaying users: ', error);
        userCardsContainer.innerHTML = '<h3>Ett fel inträffade vid visning av användare.</h3>';
    }
}