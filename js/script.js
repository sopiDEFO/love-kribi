document.addEventListener('DOMContentLoaded', function() {
    
    // Numéro WhatsApp à utiliser pour la redirection (sans le +)
    // +237 6 81 02 21 38 devient :
    const WHATSAPP_NUMBER = '237681022138'; 


    const mainHeader = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const closeBtn = document.querySelector('.close-btn');

    // ======================= 1. GESTION DU HEADER ET MENU FULLSCREEN =======================
    
    // Animation du header au défilement
    if (mainHeader) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { 
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    // Fonction pour fermer le menu
    function closeMenu() {
        mainNav.classList.remove('nav-open');
        menuToggle.textContent = '☰'; // Rétablit le symbole hamburger
    }

    // Fonction pour ouvrir le menu
    function openMenu() {
        mainNav.classList.add('nav-open');
        menuToggle.textContent = '✕'; // Change le symbole
    }

    // Gestion de l'ouverture (clic sur ☰ ou ✕ via le toggle principal)
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            if (mainNav.classList.contains('nav-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    // Gestion de la fermeture (clic sur ✕ dans le menu)
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    // Fermer le menu si l'utilisateur clique sur un lien (bonne pratique pour fullscreen)
    document.querySelectorAll('.main-nav ul li a:not(.btn-primary)').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 300); 
        });
    });


    // ======================= 2. VALIDATION ET REDIRECTION WHATSAPP =======================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Réinitialiser les messages d'erreur et de succès
            document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
            document.getElementById('successMessage').style.display = 'none';

            const setError = (id, message) => {
                const errorElement = document.getElementById(id);
                errorElement.textContent = message;
                if (message) {
                    isValid = false;
                }
            };
            
            // Récupération des valeurs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const subjectInput = document.getElementById('subject');

            // Validation simple
            if (nameInput.value.trim().length < 3) {
                setError('nameError', 'Veuillez entrer un nom d\'au moins 3 caractères.');
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                setError('emailError', 'Veuillez entrer une adresse email valide.');
            }
            
            if (messageInput.value.trim().length < 10) {
                setError('messageError', 'Le message doit contenir au moins 10 caractères.');
            }
            
            // Si tout est valide, rediriger vers WhatsApp
            if (isValid) {
                
                // Données pour le message WhatsApp
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const message = messageInput.value.trim();
                const subject = subjectInput.options[subjectInput.selectedIndex].text;

                // Message pré-rempli
                const presetMessage = encodeURIComponent(
                    `*Kribi Séjours - Nouvelle Demande*\n\nSujet: ${subject}\n\nNom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                );

                // URL WhatsApp
                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${presetMessage}`;

                // 1. Afficher le message de succès 
                document.getElementById('successMessage').textContent = "Validation OK. Redirection immédiate vers WhatsApp...";
                document.getElementById('successMessage').style.display = 'block';
                contactForm.reset(); 
                
                // 2. Ouvrir le lien WhatsApp après un petit délai
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank'); 
                }, 500);
            }
        });
    }
    
    // ======================= 3. ANIMATION D'APPARITION AU SCROLL (fade-in) =======================

    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

});