// Variables globales
let scene, camera, renderer, lightbulbGroup;
let ambientLight, pointLight, innerLight;
let isLit = false;
let isFlickering = false;
let animationId;

// Matériaux de l'ampoule
let bulbMaterial, filamentMaterial, baseMaterial;

// Initialisation de l'ampoule 3D
function initLightbulb() {
    const canvas = document.getElementById('lightbulbCanvas');
    if (!canvas) return;

    // Configuration de la scène
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    // Taille responsive
    const size = window.innerWidth <= 768 ? 70 : 100;
    renderer.setSize(size, size * 1.2);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Position de la caméra
    camera.position.set(0, 0, 4);

    // Création de l'ampoule
    createLightbulb();

    // Démarrage de l'animation
    animate();

    // Gestionnaires d'événements
    setupEventListeners();
}

// Création de l'ampoule 3D
function createLightbulb() {
    lightbulbGroup = new THREE.Group();

    // Corps de l'ampoule (bulbe)
    const bulbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    bulbGeometry.scale(1, 1.4, 1);

    bulbMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });

    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.y = 0.2;
    bulb.castShadow = true;
    lightbulbGroup.add(bulb);

    // Filament principal
    const filamentGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
    filamentMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.9
    });

    const filament = new THREE.Mesh(filamentGeometry, filamentMaterial);
    filament.position.y = 0.2;
    lightbulbGroup.add(filament);

    // Filaments spiralés
    for (let i = 0; i < 3; i++) {
        const spiralGeometry = new THREE.TorusGeometry(0.15, 0.01, 8, 16);
        const spiralMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.7
        });
        const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial);
        spiral.position.y = 0.1 + (i * 0.1);
        spiral.rotation.x = Math.PI / 2;
        lightbulbGroup.add(spiral);
    }

    // Base métallique (culot)
    const baseGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.5, 16);
    baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        shininess: 80,
        metalness: 0.7
    });

    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.5;
    base.castShadow = true;
    lightbulbGroup.add(base);

    // Filetage de la base
    for (let i = 0; i < 6; i++) {
        const threadGeometry = new THREE.TorusGeometry(0.36, 0.02, 8, 16);
        const threadMaterial = new THREE.MeshPhongMaterial({
            color: 0x555555,
            shininess: 60
        });
        const thread = new THREE.Mesh(threadGeometry, threadMaterial);
        thread.position.y = -0.25 - (i * 0.08);
        thread.rotation.x = Math.PI / 2;
        lightbulbGroup.add(thread);
    }

    // Point de contact
    const contactGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const contactMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        shininess: 100
    });
    const contact = new THREE.Mesh(contactGeometry, contactMaterial);
    contact.position.y = -0.8;
    lightbulbGroup.add(contact);

    // Éclairage
    setupLighting();

    // Ajout à la scène
    scene.add(lightbulbGroup);
}

// Configuration de l'éclairage
function setupLighting() {
    // Lumière ambiante
    ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Lumière directionnelle
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(3, 5, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Lumière interne de l'ampoule
    innerLight = new THREE.PointLight(0xffffff, 0, 8);
    innerLight.position.set(0, 0.2, 0);
    innerLight.castShadow = true;
    innerLight.shadow.mapSize.width = 512;
    innerLight.shadow.mapSize.height = 512;
    lightbulbGroup.add(innerLight);
}

// Animation de la scène
function animate() {
    animationId = requestAnimationFrame(animate);

    if (lightbulbGroup) {
        // Rotation douce de l'ampoule
        lightbulbGroup.rotation.y += 0.005;
        lightbulbGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;

        // Effet de scintillement si activé
        if (isFlickering && isLit) {
            const flickerIntensity = 0.8 + Math.random() * 0.4;
            innerLight.intensity = flickerIntensity;

            // Effet sur le matériau du filament
            filamentMaterial.opacity = 0.7 + Math.random() * 0.3;
        }
    }

    renderer.render(scene, camera);
}

// Fonction de changement de thème
function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById('themeButton');

    isLit = !isLit;

    // Animation de transition
    body.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    if (isLit) {
        // Passage au thème clair
        body.setAttribute('data-theme', 'light');

        // Mise à jour de l'ampoule 3D
        updateLightbulbAppearance(true);

        // Effet de scintillement temporaire
        triggerFlicker();

        // Mise à jour du bouton
        if (themeButton) {
            themeButton.textContent = 'OFF';
            themeButton.style.background = 'rgba(255, 255, 255, 0.2)';
        }

    } else {
        // Passage au thème sombre
        body.setAttribute('data-theme', 'dark');

        // Mise à jour de l'ampoule 3D
        updateLightbulbAppearance(false);

        // Mise à jour du bouton
        if (themeButton) {
            themeButton.textContent = 'ON';
            themeButton.style.background = 'var(--glass)';
        }
    }
}

// Mise à jour de l'apparence de l'ampoule
function updateLightbulbAppearance(lit) {
    if (!lightbulbGroup) return;

    if (lit) {
        // Ampoule allumée
        bulbMaterial.color.setHex(0xffff88);
        bulbMaterial.emissive.setHex(0x444422);
        bulbMaterial.opacity = 0.9;

        filamentMaterial.color.setHex(0xffaa00);
        filamentMaterial.emissive.setHex(0x221100);
        filamentMaterial.opacity = 1;

        // Éclairage interne
        innerLight.intensity = 1.2;
        innerLight.color.setHex(0xffffaa);

        // Éclairage ambiant plus fort
        ambientLight.intensity = 0.6;

    } else {
        // Ampoule éteinte
        bulbMaterial.color.setHex(0xcccccc);
        bulbMaterial.emissive.setHex(0x000000);
        bulbMaterial.opacity = 0.8;

        filamentMaterial.color.setHex(0x444444);
        filamentMaterial.emissive.setHex(0x000000);
        filamentMaterial.opacity = 0.9;

        // Éclairage interne éteint
        innerLight.intensity = 0;

        // Éclairage ambiant plus faible
        ambientLight.intensity = 0.3;
    }
}

// Effet de scintillement
function triggerFlicker() {
    if (!isLit) return;

    isFlickering = true;

    setTimeout(() => {
        isFlickering = false;
        if (innerLight) {
            innerLight.intensity = 1.2;
        }
        if (filamentMaterial) {
            filamentMaterial.opacity = 1;
        }
    }, 800);
}

// Configuration des gestionnaires d'événements
function setupEventListeners() {
    const canvas = document.getElementById('lightbulbCanvas');
    const themeButton = document.getElementById('themeButton');

    // Clic sur l'ampoule
    if (canvas) {
        canvas.addEventListener('click', toggleTheme);
        canvas.addEventListener('mouseenter', () => {
            canvas.style.transform = 'scale(1.05)';
        });
        canvas.addEventListener('mouseleave', () => {
            canvas.style.transform = 'scale(1)';
        });
    }

    // Clic sur le bouton
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }

    // Redimensionnement
    window.addEventListener('resize', handleResize);
}

// Gestion du redimensionnement
function handleResize() {
    if (!renderer || !camera) return;

    const size = window.innerWidth <= 768 ? 70 : 100;
    renderer.setSize(size, size * 1.2);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
}

// Animation d'entrée pour les éléments
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observer les éléments
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) observer.observe(sectionTitle);

    document.querySelectorAll('.competence-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Gestion du scroll fluide
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation de chargement
function handleLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 800);
        }, 1500);
    }
}

// Fonction de nettoyage
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }
    if (scene) {
        scene.clear();
    }
}

// Initialisation principale
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du chargement
    handleLoading();

    // Initialisation de l'ampoule 3D
    setTimeout(() => {
        initLightbulb();
    }, 100);

    // Configuration des animations
    setupScrollAnimations();
    setupSmoothScroll();

    // Nettoyage lors de la fermeture
    window.addEventListener('beforeunload', cleanup);
});

// Fonctions utilitaires pour les modales (si nécessaire)
function openModal(competenceId) {
    const modal = document.getElementById('competenceModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('competenceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Gestionnaire de clic sur les cartes de compétences
document.addEventListener('click', (e) => {
    const card = e.target.closest('.competence-card');
    if (card) {
        const competenceId = card.getAttribute('data-competence');
        if (competenceId) {
            openModal(competenceId);
        }
    }
});

// Export des fonctions principales pour utilisation externe
window.toggleTheme = toggleTheme;
window.openModal = openModal;
window.closeModal = closeModal;