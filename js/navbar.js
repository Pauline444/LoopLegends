'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Get navbar elements
    const homeLink = document.getElementById('home-link');
    const postLink = document.getElementById('post.link');
    const todoLink = document.getElementById('todo-link');
    
    // Get content containers
    const interactiveContentContainer = document.querySelector('.interactive-content-container');
    
    // Function to set active nav item
    function setActiveNavItem(activeElement) {
        // Remove active class from all nav items
        const navItems = document.querySelectorAll('.nav-tab');
        navItems.forEach(item => item.classList.remove('nav-active'));
        
        // Add active class to the clicked item
        if (activeElement) {
            activeElement.parentElement.classList.add('nav-active');
        }
    }
    
    // Function to hide all content containers
    function hideAllContent() {
        // Clear the interactive content container
        if (interactiveContentContainer) {
            // Keep the container but clear its child elements
            while (interactiveContentContainer.firstChild) {
                interactiveContentContainer.firstChild.remove();
            }
        }
    }
    
    // Function to show homepage content
    function showHomepage() {
        // First hide all content
        hideAllContent();
        
        // Set active nav item
        setActiveNavItem(homeLink);
        
        // Create home page content directly in the interactive content container
        const homePageDiv = document.createElement('div');
        homePageDiv.className = 'home-page-container';
        interactiveContentContainer.appendChild(homePageDiv);
        
        // Create cards container for user cards
        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'main-content-cards';
        interactiveContentContainer.appendChild(cardsDiv);
        
        // Clear active user when showing homepage
        document.querySelectorAll('.aside-user').forEach(userEl => {
            userEl.classList.remove('aside-user-active');
        });
        
        // Dispatch a custom event to notify other modules to refresh data
        document.dispatchEvent(new CustomEvent('showHomepage'));
    }
    
    // Function to show posts content
    function showPosts() {
        // First hide all content
        hideAllContent();
        
        // Set active nav item
        setActiveNavItem(postLink);
        
        // If a user is selected (from window.currentUser), highlight that user
        if (window.currentUser && window.currentUser.id) {
            // First clear all active users
            document.querySelectorAll('.aside-user').forEach(userEl => {
                userEl.classList.remove('aside-user-active');
            });
            
            // Then highlight the current user
            const currentUserElement = document.querySelector(`.aside-user[data-user-id="${window.currentUser.id}"]`);
            if (currentUserElement) {
                currentUserElement.classList.add('aside-user-active');
            }
        }
        
        // Dispatch a custom event to notify other modules
        document.dispatchEvent(new CustomEvent('showPosts'));
    }
    
    // Function to show todo content
    function showTodo() {
        // First hide all content
        hideAllContent();
        
        // Set active nav item
        setActiveNavItem(todoLink);
        
        // If a user is selected (from window.currentUser), highlight that user
        if (window.currentUser && window.currentUser.id) {
            // First clear all active users
            document.querySelectorAll('.aside-user').forEach(userEl => {
                userEl.classList.remove('aside-user-active');
            });
            
            // Then highlight the current user
            const currentUserElement = document.querySelector(`.aside-user[data-user-id="${window.currentUser.id}"]`);
            if (currentUserElement) {
                currentUserElement.classList.add('aside-user-active');
            }
        }
        
        // Dispatch a custom event to notify other modules
        document.dispatchEvent(new CustomEvent('showTodo'));
    }
    
    // Add click event listener for home link
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            showHomepage();
        });
    }
    
    // Add click event listener for posts link
    if (postLink) {
        postLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPosts();
        });
    }
    
    // Add click event listener for todo link
    if (todoLink) {
        todoLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTodo();
        });
    }
    
    // Check if the container is empty and show homepage
    if (interactiveContentContainer && (!interactiveContentContainer.children.length || interactiveContentContainer.children.length === 0)) {
        showHomepage();
    } else {
        // Set home as active by default if we have existing content
        setActiveNavItem(homeLink);
    }
});