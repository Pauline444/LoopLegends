// Save user ID for later use
export function saveUserId(userId) {
    localStorage.setItem("selectedUserId", userId);
}

// Optional: Get user ID later from another script
export function getSavedUserId() {
    return localStorage.getItem("selectedUserId");
}