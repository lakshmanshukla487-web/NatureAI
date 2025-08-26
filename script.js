// Three.js for 3D Background Animation
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';


function init3DBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-canvas').appendChild(renderer.domElement);

    // Create a subtle 3D particle system
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x3498db, size: 2 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 1000;

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Three.js for 3D Model Viewer
function init3DModel() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, 500);
    document.getElementById('model-viewer').appendChild(renderer.domElement);

    // Placeholder for 3D model (use a library like GLTFLoader for actual model)
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Replace with actual model
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / 500;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, 500);
    });
}

// GSAP Scroll Animations
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

// Volunteer Form Submission
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

// Fetch Nearby Volunteers
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

// Contact Form Submission (Placeholder)
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
});

// Initialize on Load
window.onload = () => {
    if (typeof THREE === 'undefined') {
        console.log('Not Loaded');
    }
    else {

        init3DBackground();
        init3DModel();
        fetchVolunteers(''); // Fetch all volunteers initially
    }
};