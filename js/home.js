'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Function to create the home page content
    function createHomePageContent() {
        // Find the home page container that was created in navbar.js
        const homePageContainer = document.querySelector('.interactive-content-container .home-page-container');
        
        // If the container doesn't exist, create it first
        if (!homePageContainer) {
            const interactiveContainer = document.querySelector('.interactive-content-container');
            if (interactiveContainer) {
                // Clear any existing content
                interactiveContainer.innerHTML = '';
                
                // Create the home page container
                const newHomePageContainer = document.createElement('div');
                newHomePageContainer.className = 'home-page-container';
                interactiveContainer.appendChild(newHomePageContainer);
                
                // Create cards container for user cards
                const cardsDiv = document.createElement('div');
                cardsDiv.className = 'main-content-cards';
                interactiveContainer.appendChild(cardsDiv);
                
                // Now call createHomePageContent again to populate the new container
                setTimeout(createHomePageContent, 0);
                return;
            }
        } else {
            // Clear any existing content
            homePageContainer.innerHTML = '';
            
            // Create the home card
            const homeCard = document.createElement('div');
            homeCard.className = 'home-card';
            
            // Create image container
            const imageContainer = document.createElement('div');
            
            // Create and setup image
            const logoImage = document.createElement('img');
            logoImage.src = 'assets/images/image.png';
            logoImage.alt = 'Logo';
            
            // Create heading
            const heading = document.createElement('h1');
            heading.textContent = 'Social Looping Legends';
            
            // Create paragraph
            const paragraph = document.createElement('p');
            paragraph.textContent = 'This is where the main content will go.';
            
            // Assemble the components
            imageContainer.appendChild(logoImage);
            homeCard.appendChild(imageContainer);
            homeCard.appendChild(heading);
            homeCard.appendChild(paragraph);
            
            // Add the card to the container
            homePageContainer.appendChild(homeCard);
        }
    }
    
    // Listen for the showHomepage event to refresh the home page
    document.addEventListener('showHomepage', () => {
        createHomePageContent();
    });
    
    // Also check on page load if we need to show the home page
    window.addEventListener('load', () => {
        const interactiveContainer = document.querySelector('.interactive-content-container');
        if (interactiveContainer && (!interactiveContainer.children.length || !interactiveContainer.innerHTML.trim())) {
            createHomePageContent();
        }
    });
    
    // Call immediately on DOMContentLoaded as well
    setTimeout(createHomePageContent, 100);
});