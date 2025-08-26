const THREE = window.THREE; // Use global THREE object from CDN

// Three.js for 3D Background Animation
function init3DBackground() {
    const canvasContainer = document.getElementById('three-canvas');
    if (!canvasContainer) {
        console.error('Three-canvas container not found');
        return;
    }

    // Set canvas height to match the about section's bottom
    const aboutSection = document.getElementById('about') || document.querySelector('.section');
    if (!aboutSection) {
        console.error('About section not found, using full window height');
    } else {
        const aboutRect = aboutSection.getBoundingClientRect();
        const aboutBottom = aboutRect.top + aboutRect.height + window.scrollY;
        canvasContainer.style.height = `${aboutBottom}px`;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Add ambient and directional lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Enhanced particle system for prominent visuals
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const sizes = [];
    for (let i = 0; i < 1500; i++) {
        vertices.push(
            (Math.random() - 0.5) * 1500,
            (Math.random() - 0.5) * 1500,
            (Math.random() - 0.5) * 1500
        );
        colors.push(Math.random(), Math.random(), Math.random());
        sizes.push(3 + Math.random() * 3);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 4,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 400;

    // Animation loop
    let lastTime = 0;
    function animate(time) {
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        particles.rotation.y += 0.05 * delta;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Scroll-based animations
    gsap.to(particles.rotation, {
        x: Math.PI * 0.5,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: aboutSection ? `#about bottom` : 'bottom bottom',
            scrub: 1,
        }
    });
    gsap.to(particles.position, {
        z: 200,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: aboutSection ? `#about bottom` : 'bottom bottom',
            scrub: 1,
        }
    });
    gsap.to(material, {
        opacity: 1,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: aboutSection ? `#about bottom` : 'bottom bottom',
            scrub: 1,
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Update canvas height on resize
        if (aboutSection) {
            const aboutRect = aboutSection.getBoundingClientRect();
            const aboutBottom = aboutRect.top + aboutRect.height + window.scrollY;
            canvasContainer.style.height = `${aboutBottom}px`;
        }
    });
}

// Three.js for 3D Model Viewer
function init3DModel() {
    const modelContainer = document.getElementById('model-viewer');
    if (!modelContainer) {
        console.error('Model-viewer container not found');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(modelContainer.clientWidth, 500);
    modelContainer.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Placeholder model
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x3498db,
        metalness: 0.5,
        roughness: 0.5
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;

    // Add orbit controls
    let OrbitControls;
    if (typeof THREE.OrbitControls !== 'undefined') {
        OrbitControls = THREE.OrbitControls;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
    }

    // Animation loop
    let lastTime = 0;
    function animate(time) {
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        cube.rotation.x += 0.5 * delta;
        cube.rotation.y += 0.5 * delta;
        if (OrbitControls) controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Scroll-based animation for model
    gsap.to(cube.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        scrollTrigger: {
            trigger: modelContainer,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
        }
    });
    gsap.to(cube.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        scrollTrigger: {
            trigger: modelContainer,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = modelContainer.clientWidth / 500;
        camera.updateProjectionMatrix();
        renderer.setSize(modelContainer.clientWidth, 500);
    });
}

// GSAP Scroll Animations (unchanged)
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

document.querySelectorAll('.feature-card').forEach(card => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Full Screen to presentation
document.querySelector(".btn").addEventListener("click", ()=>{
    document.getElementById("ppt").requestFullscreen();
})

// Volunteer Form Submission (unchanged)
document.getElementById('volunteer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const location = document.getElementById('location').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, location })
        });
        if (response.ok) {
            alert('Volunteer registered successfully!');
            fetchVolunteers(location);
        } else {
            alert('Error registering volunteer.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server error. Please try again later.');
    }
});

// Fetch Nearby Volunteers (unchanged)
async function fetchVolunteers(location) {
    try {
        const response = await fetch(`http://localhost:3000/volunteers?location=${location}`);
        const volunteers = await response.json();
        const volunteerList = document.getElementById('volunteers');
        volunteerList.innerHTML = '';
        volunteers.forEach(volunteer => {
            const li = document.createElement('li');
            li.textContent = `${volunteer.name} - ${volunteer.location}`;
            volunteerList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching volunteers:', error);
    }
}

// Contact Form Submission (unchanged)
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
});

// Initialize on Load
window.onload = () => {
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded. Please include the Three.js CDN in your HTML.');
        return;
    }

    init3DBackground();
    init3DModel();
    fetchVolunteers('');
};