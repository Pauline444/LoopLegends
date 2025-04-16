import { getSavedUserId } from './userSession.js';

const userId = getSavedUserId();
if (userId) {
    fetch(`https://your.api/endpoint/users/${userId}`)
        .then(res => res.json())
        .then(data => console.log("Data for user:", data));
}