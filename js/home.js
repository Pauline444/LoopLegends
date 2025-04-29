'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // Function to create the home page content
    function createHomePageContent() {
        const interactiveContainer = document.querySelector('.interactive-content-container');
        if (interactiveContainer) {
            // Clear any existing content
            interactiveContainer.innerHTML = '';

            // Create the home page container as main wrapper
            const homePageContainer = document.createElement('div');
            homePageContainer.className = 'home-page-container';
            interactiveContainer.appendChild(homePageContainer);

            // Create the header section with logo and text
            const headerSection = document.createElement('div');
            headerSection.className = 'home-header';

            // Create a container for horizontal layout
            const horizontalContainer = document.createElement('div');
            horizontalContainer.className = 'home-card-horizontal';

            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'logo-container';

            // Create and setup image
            const logoImage = document.createElement('img');
            logoImage.src = 'assets/images/image.png';
            logoImage.alt = 'Logo';
            logoImage.className = 'home-logo';

            // Create text container
            const textContainer = document.createElement('div');
            textContainer.className = 'home-text-container';

            // Create heading
            const heading = document.createElement('h1');
            heading.textContent = 'Social Looping Legends';

            // Create paragraph
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Where the social media magic happens';

            // Create paragraph 2
            const paragraphTwo = document.createElement('p');
            paragraphTwo.className = 'home-paragraph-two';
            const firstPart = document.createElement('span');
            firstPart.textContent = 'Social Looping Legends';
            firstPart.style.fontSize = 'larger';
            const secondPart = document.createTextNode(' är ett modernt nätverk för dig som vill växa - både personligt och professionellt. Upptäck inspirerande individer, se hur de strukturerar sina dagar och ta del av deras bästa metoder för fokus, balans och framgång.');
            paragraphTwo.appendChild(firstPart);
            paragraphTwo.appendChild(secondPart);


            // Assemble the header components
            imageContainer.appendChild(logoImage);
            textContainer.appendChild(heading);
            textContainer.appendChild(paragraph);
            textContainer.appendChild(paragraphTwo);
            horizontalContainer.appendChild(imageContainer);
            horizontalContainer.appendChild(textContainer);
            headerSection.appendChild(horizontalContainer);

            // Add the header section to the container
            homePageContainer.appendChild(headerSection);

            // Create cards container for user cards
            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'main-content-cards';

            // Add cards container directly below the header in the same container
            homePageContainer.appendChild(cardsDiv);

            // Now that the structure is in place, trigger the cards to load
            // by dispatching a custom event
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('loadHomeCards'));
            }, 100);
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