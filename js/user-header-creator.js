'use strict';

/**
 * User Header Creator Module
 * This module creates a detailed user header with name, username, email, and phone number
 */

const UserHeaderCreator = {
    /**
     * Create a detailed user header with complete user information
     * @param {Object} user - The user object containing all user details
     * @returns {HTMLElement} - The user header element
     */
    createUserHeader: async function(userId, username) {
        // Fetch complete user information
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const user = await response.json();
            
            // Create the header container
            const headerContainer = document.createElement('div');
            headerContainer.classList.add('user-header-container');
            headerContainer.dataset.userId = user.id; // Add user ID as data attribute
            
            // Create the user info section
            const userInfo = document.createElement('div');
            userInfo.classList.add('user-header-info');
            
            // Create the user avatar (future enhancement: add user avatar)
            const userAvatar = document.createElement('div');
            userAvatar.classList.add('user-avatar');
            
            // Add profile image
            const profileImg = document.createElement('img');
            profileImg.src = this.getProfileImageSrc(user.id);
            profileImg.alt = `${user.username}'s profile`;
            profileImg.classList.add('profile-image');
            
            // Add error handling for missing images
            profileImg.onerror = function() {
                this.src = "assets/images/profile-image/img1.jpg"; // Fallback
                console.log(`Image for user ${user.id} not found, using fallback`);
            };
            
            userAvatar.appendChild(profileImg);
            
            // Create the user details
            const userDetails = document.createElement('div');
            userDetails.classList.add('user-details');
            
            // Add user name
            const userName = document.createElement('h2');
            userName.textContent = user.name;
            userDetails.appendChild(userName);
            
            // Add username
            const userUsername = document.createElement('p');
            userUsername.classList.add('user-username');
            userUsername.textContent = `@${user.username}`;
            userDetails.appendChild(userUsername);
            
            // Add email
            const userEmail = document.createElement('p');
            userEmail.classList.add('user-email');
            const emailLink = document.createElement('a');
            emailLink.href = `mailto:${user.email}`;
            emailLink.textContent = user.email;
            userEmail.appendChild(emailLink);
            userDetails.appendChild(userEmail);
            
            // Add phone number
            const userPhone = document.createElement('p');
            userPhone.classList.add('user-phone');
            userPhone.textContent = user.phone;
            userDetails.appendChild(userPhone);
            
            // Assemble the header
            userInfo.appendChild(userAvatar);
            userInfo.appendChild(userDetails);
            headerContainer.appendChild(userInfo);
            
            return headerContainer;
        } catch (error) {
            console.error('Error fetching user details:', error);
            // Create a simple header as fallback
            const fallbackHeader = document.createElement('h2');
            fallbackHeader.textContent = `Inlägg för ${username}`;
            return fallbackHeader;
        }
    },
    
    /**
     * Get profile image based on user ID
     * @param {number} userId - The user ID
     * @returns {string} - The profile image source URL
     */
    getProfileImageSrc: function(userId) {
        const imageNumber = ((userId - 1) % 10) + 1; // Cycle through images 1-10
        return `assets/images/profile-image/img${imageNumber}.jpg`;
    },
    
    /**
     * Check if a user header exists in the container and get the displayed user ID
     * @param {HTMLElement} container - The container element to check for existing header
     * @returns {Object} - Object with exists (boolean) and userId (number or null) properties
     */
    checkExistingHeader: function(container) {
        const result = { exists: false, userId: null };
        
        // Check if header exists
        const existingHeader = container.querySelector('.user-header-container');
        if (!existingHeader) return result;
        
        result.exists = true;
        
        // Try to find a data attribute with user ID
        if (existingHeader.dataset.userId) {
            result.userId = parseInt(existingHeader.dataset.userId, 10);
        }
        
        return result;
    }
};

// Make the module available globally
window.UserHeaderCreator = UserHeaderCreator;