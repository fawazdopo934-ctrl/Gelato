// produits.js
class ProductManager {
    constructor() {
        this.products = products;
        this.filteredProducts = [...products];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.init();
    }

    init() {
        this.afficherProduits();
        this.initFilters();
        this.initSearch();
    }

    afficherProduits(produits = this.filteredProducts) {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        if (produits.length === 0) {
            container.innerHTML = '<div class="no-results">Aucun produit trouvé</div>';
            return;
        }

        let html = '';
        produits.forEach(produit => {
            const isFavorite = this.favorites.includes(produit.id);
            html += `
                <div class="product-card" data-id="${produit.id}">
                    ${produit.badge ? `<span class="product-badge">${produit.badge}</span>` : ''}
                    <img src="${produit.image}" alt="${produit.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${produit.name}</h3>
                        <p class="product-description">${produit.description || ''}</p>
                        <div class="product-price">${produit.price.toFixed(2)} €</div>
                        <div class="product-actions">
                            <button class="btn" onclick="productManager.ajouterAuPanier(${produit.id})">
                                <i class="fas fa-cart-plus"></i> Ajouter
                            </button>
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="productManager.toggleFavorite(${produit.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    initFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.appliquerFiltres());
        }

        if (priceFilter) {
            priceFilter.addEventListener('input', () => this.appliquerFiltres());
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.appliquerFiltres());
        }
    }

    initSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.rechercher(e.target.value);
            });
        }
    }

    appliquerFiltres() {
        let produitsFiltres = [...this.products];

        // Filtre par catégorie
        const category = document.getElementById('category-filter')?.value;
        if (category && category !== 'all') {
            produitsFiltres = produitsFiltres.filter(p => p.category === category);
        }

        // Filtre par prix
        const maxPrice = parseFloat(document.getElementById('price-filter')?.value);
        if (maxPrice && maxPrice > 0) {
            produitsFiltres = produitsFiltres.filter(p => p.price <= maxPrice);
        }

        // Tri
        const sortBy = document.getElementById('sort-filter')?.value;
        if (sortBy) {
            switch(sortBy) {
                case 'price-asc':
                    produitsFiltres.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    produitsFiltres.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    produitsFiltres.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }

        this.filteredProducts = produitsFiltres;
        this.afficherProduits();
    }

    rechercher(term) {
        term = term.toLowerCase();
        this.filteredProducts = this.products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            (p.description && p.description.toLowerCase().includes(term))
        );
        this.afficherProduits();
    }

    ajouterAuPanier(produitId) {
        const produit = this.products.find(p => p.id === produitId);
        if (produit) {
            panier.ajouter(produit);
        }
    }

    toggleFavorite(produitId) {
        const index = this.favorites.indexOf(produitId);
        if (index === -1) {
            this.favorites.push(produitId);
            panier.notification.show('Ajouté aux favoris', 'success');
        } else {
            this.favorites.splice(index, 1);
            panier.notification.show('Retiré des favoris', 'info');
        }
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.afficherProduits(this.filteredProducts);
    }

    afficherParCategorie(category) {
        this.filteredProducts = this.products.filter(p => p.category === category);
        this.afficherProduits();
    }
}

const productManager = new ProductManager();