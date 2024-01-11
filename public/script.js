
// Mockup data for collectibles
const collectibles = [
    { id: 1, image: 'placeholder.jpg', description: 'Vintage Toy Car', price: 50 },
    { id: 2, image: 'placeholder.jpg', description: 'Antique Vase', price: 100 },
    // More collectibles can be added here
];

// Function to display collectibles in the catalog
function displayCollectibles() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (catalogGrid) {
        catalogGrid.innerHTML = collectibles.map(collectible => `
            <div class="collectible-item">
                <img src="${collectible.image}" alt="Collectible">
                <h3>${collectible.description}</h3>
                <p>Price: $${collectible.price}</p>
                <a href="detail.html?id=${collectible.id}">View Details</a>
            </div>
        `).join('');
    }
}

// Event listener for the upload form

// Initialize the website functionalities
document.addEventListener('DOMContentLoaded', function() {
    displayCollectibles();
});
