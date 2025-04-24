'use strict';


const userCardsContainer = document.querySelector('.main-content-cards');

async function fetchUsers() {
    try {
        const [usersResponse, postsResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users'),
            fetch('https://jsonplaceholder.typicode.com/posts')
        ]);

        const users = await usersResponse.json();
        const posts = await postsResponse.json();

        showUsers(users, posts);
    } catch (error) {
        console.error('Error fetching users: ', error);
        userCardsContainer.innerHTML = '<h3>Ett fel inträffade vid hämtningen av användare.</h3>';
    }
}

async function showUsers(users, posts) {
    userCardsContainer.innerHTML = '';
    try {
        users.forEach(user => {

            const userFirstPost = posts.find(post => post.userId === user.id);
            const postPreview = userFirstPost
                ? userFirstPost.title.substring(0, 15) + (userFirstPost.title.length > 15 ? '...' : '')
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

            // Lägger till korten i containern
            userCardsContainer.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error displaying users: ', error);
        userCardsContainer.innerHTML = '<h3>Ett fel inträffade vid visning av användare.</h3>';
    }
}
document.addEventListener('DOMContentLoaded', fetchUsers);