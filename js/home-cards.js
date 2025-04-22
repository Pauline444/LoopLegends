'use strict';


const userCardsContainer = document.createElement('div');
userCardsContainer.className = 'user-cards-container';

document.body.appendChild(userCardsContainer);

async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        showUsers(data);
    } catch (error) {
        console.error('Error fetching users: ', error);
        userCardsElement.innerHTML = '<h3>Ett fel inträffade vid hämtningen av användare.</h3>';
    }
}

async function showUsers(users) {
    userCardsContainer.innerHTML = '';
    try {
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            const userImageUrl = `https://robohash.org/${user.id}?size=150x150&set=set2`;

            userCard.innerHTML = `
                <div class="user-img">
                    <img src="${userImageUrl}" alt="${user.name}">
                </div>
                <div class="user-info">
                    <h3>${user.username}</h3>
                    <p>${user.name}</p>
                    <p><a href="mailto:${user.email}">${user.email}</a></p>
                </div>`;

            // Lägger till korten i containern
            userCardsContainer.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error displaying users: ', error);
        userCardsContainer.innerHTML = '<h3>Ett fel inträffade vid visning av användare.</h3>';
    }
}