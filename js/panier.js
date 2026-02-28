// panier.js
class Panier {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('panier')) || [];
        this.total = 0;
        this.notification = new NotificationSystem();
    }

    ajouter(produit, quantite = 1) {
        const existingItem = this.items.find(item => item.id === produit.id);
        
        if (existingItem) {
            existingItem.quantite += quantite;
            this.notification.show('Quantité mise à jour dans le panier', 'info');
        } else {
            this.items.push({
                ...produit,
                quantite: quantite
            });
            this.notification.show('Produit ajouté au panier !', 'success');
        }
        
        this.sauvegarder();
        this.mettreAJourAffichage();
    }

    supprimer(produitId) {
        this.items = this.items.filter(item => item.id !== produitId);
        this.notification.show('Produit retiré du panier', 'info');
        this.sauvegarder();
        this.mettreAJourAffichage();
    }

    modifierQuantite(produitId, nouvelleQuantite) {
        const item = this.items.find(item => item.id === produitId);
        if (item) {
            if (nouvelleQuantite <= 0) {
                this.supprimer(produitId);
            } else {
                item.quantite = nouvelleQuantite;
                this.sauvegarder();
                this.mettreAJourAffichage();
            }
        }
    }

    calculerTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantite), 0);
    }

    sauvegarder() {
        localStorage.setItem('panier', JSON.stringify(this.items));
        this.total = this.calculerTotal();
    }

    vider() {
        this.items = [];
        this.sauvegarder();
        this.notification.show('Panier vidé', 'info');
        this.mettreAJourAffichage();
    }

    mettreAJourAffichage() {
        // Mettre à jour le compteur du panier dans le header
        const panierCount = document.querySelector('.panier-count');
        if (panierCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantite, 0);
            panierCount.textContent = totalItems;
            panierCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    afficherPanier() {
        const container = document.querySelector('.cart-container');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
            return;
        }

        let html = '<div class="cart-items">';
        this.items.forEach(item => {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>${item.description || ''}</p>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" onclick="panier.modifierQuantite(${item.id}, ${item.quantite - 1})">-</button>
                        <span class="quantity">${item.quantite}</span>
                        <button class="quantity-btn plus" onclick="panier.modifierQuantite(${item.id}, ${item.quantite + 1})">+</button>
                    </div>
                    <div class="item-price">${(item.price * item.quantite).toFixed(2)} €</div>
                    <button class="btn-remove" onclick="panier.supprimer(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        html += '</div>';

        html += `
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Total:</span>
                    <span class="total-price">${this.calculerTotal().toFixed(2)} €</span>
                </div>
                <button class="btn btn-secondary" onclick="window.location.href='paiement.html'">
                    Procéder au paiement
                </button>
            </div>
        `;

        container.innerHTML = html;
    }
}

class NotificationSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialisation du panier
const panier = new Panier();