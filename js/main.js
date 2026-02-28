// main.js
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initTheme();
    initChat();
    initAuth();
    initContactForm();
    initPayment();
    loadTestimonials();
});

// Slider automatique
function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    if (!slider || slides.length === 0) return;

    let currentSlide = 0;
    const slideCount = slides.length;

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 3000);
}

// Mode sombre/clair
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        
        // Animation de l'icône
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Chat simulé
function initChat() {
    const chatButton = document.querySelector('.chat-button');
    const chatBox = document.querySelector('.chat-box');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (!chatButton || !chatBox) return;

    chatButton.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });

    if (chatSend && chatInput && chatMessages) {
        chatSend.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                // Message de l'utilisateur
                const userMsg = document.createElement('div');
                userMsg.className = 'message user';
                userMsg.textContent = message;
                chatMessages.appendChild(userMsg);

                // Réponse automatique
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'message bot';
                    botMsg.textContent = 'Merci pour votre message. Un conseiller vous répondra bientôt.';
                    chatMessages.appendChild(botMsg);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);

                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                chatSend.click();
            }
        });
    }
}

// Authentification simulée
function initAuth() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simulation de validation
            if (email && password) {
                panier.notification.show('Connexion réussie !', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showFormErrors(loginForm, 'Veuillez remplir tous les champs');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!name || !email || !password || !confirmPassword) {
                showFormErrors(registerForm, 'Veuillez remplir tous les champs');
            } else if (password !== confirmPassword) {
                showFormErrors(registerForm, 'Les mots de passe ne correspondent pas');
            } else if (password.length < 6) {
                showFormErrors(registerForm, 'Le mot de passe doit contenir au moins 6 caractères');
            } else {
                panier.notification.show('Inscription réussie !', 'success');
                setTimeout(() => {
                    window.location.href = 'connexion.html';
                }, 1500);
            }
        });
    }
}

function showFormErrors(form, message) {
    const errorDiv = form.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    if (!form.querySelector('.error-message')) {
        form.appendChild(errorDiv);
    }
}

// Formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        if (name && email && message) {
            // Simulation d'envoi
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            setTimeout(() => {
                panier.notification.show('Message envoyé avec succès !', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        } else {
            panier.notification.show('Veuillez remplir tous les champs', 'error');
        }
    });
}

// Paiement
function initPayment() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const payButton = document.querySelector('.pay-button');

    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
            });
        });
    }

    if (payButton) {
        payButton.addEventListener('click', () => {
            const selectedMethod = document.querySelector('.payment-method.selected');
            
            if (!selectedMethod) {
                panier.notification.show('Veuillez choisir un mode de paiement', 'error');
                return;
            }

            // Simulation de paiement
            const loader = document.querySelector('.loader');
            loader.classList.add('show');

            setTimeout(() => {
                loader.classList.remove('show');
                panier.vider();
                panier.notification.show('Paiement effectué avec succès ! Merci pour votre commande.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }, 2000);
        });
    }
}

// Témoignages
function loadTestimonials() {
    const container = document.querySelector('.testimonials-container');
    if (!container || !testimonials) return;

    let html = '<div class="testimonials-grid">';
    testimonials.forEach(t => {
        html += `
            <div class="testimonial-card">
                <img src="${t.image}" alt="${t.name}" class="testimonial-image">
                <div class="testimonial-content">
                    <h4>${t.name}</h4>
                    <div class="rating">
                        ${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}
                    </div>
                    <p>"${t.comment}"</p>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Loader
window.addEventListener('beforeunload', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('show');
    }
});

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.remove('show');
        }, 500);
    }
});