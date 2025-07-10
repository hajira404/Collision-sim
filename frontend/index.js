/**
 * @license
 * SPDX-License--Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// --- Main 3D Scene Setup ---

// 1. Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// To clear the root element and append the canvas
const rootElement = document.getElementById('root');
if (rootElement) {
    rootElement.innerHTML = '';
    rootElement.appendChild(renderer.domElement);
}

// Adding info div
const infoDiv = document.createElement('div');
infoDiv.className = 'info';
infoDiv.innerHTML = 'Drag to orbit, scroll to zoom, right-drag to pan';
rootElement?.appendChild(infoDiv);


// 2. Camera Controls (Orbit, Zoom, Pan)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true; // Allow right-click panning
controls.minDistance = 2.5; // Zoom in limit
controls.maxDistance = 15; // Zoom out limit

// Control Panel
const predictbtn = document.getElementById('predictbtn');
const resetbtn = document.getElementById('resetbtn');
const resultText = document.getElementById('prediction-result');

async function getCollisionRisk(rel_x, rel_y, rel_z, distance_km) {
    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rel_x: rel_x,
                rel_y: rel_y,
                rel_z: rel_z,
                distance_km: distance_km
            })
        });

        const data = await response.json();
        console.log("📡 ML Prediction Response:", data);
        resultText.textContent = "Calculating the risk...";
        resultText.style.color = "#ffaa00";
        setTimeout(() => {
        if (data.collision_risk === "Yes") {
            
            resultText.textContent = "Model predicts high collision risk!\n1min to impact.";
            resultText.style.color = "red";
            trajectory1.material.color.set(0xff0000);
            trajectory2.material.color.set(0xff0000);
        } else {
            resultText.textContent = "ML predicts safe orbit.";
            resultText.style.color = "green";
        }
    },5000); // Simulate processing delay
    } catch (error) {
        console.error("Error contacting FastAPI backend:", error);
    }
}

function resetSimulation() {
    trajectory1.material.color.set(0xff00ff); // Magenta
    trajectory2.material.color.set(0x00ffff); // Cyan
    debris.material.color.set(0x888888);
    resultText.textContent = 'Simulation reset. Run a prediction again.';
    resultText.style.color = '#fff';

    // Reset simulation variables
    hasCollided = false;
    debrisDecayFactor = 1.0;
    timeStep = 0;

    // Reset positions
    debris.position.set(0, 0, 0);
    satellite.position.set(0, 0, 0);
}


// 3. Lighting
const ambientLight = new THREE.AmbientLight(0x222222, 3); // Dim base light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0); // Sunlight strength
directionalLight.position.set(10, 5, 10); // Positioned like the sun
directionalLight.castShadow = false; // Optional: enable shadows later
scene.add(directionalLight);
// Optional: helper to visualize the directional light
//const dirHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
//scene.add(dirHelper);


// 4. Create the Earth
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load(
'/texture/earth_clouds/earth-texture2.jpg',
    () => {
        console.log("Earth texture loaded successfully.");
    },
    undefined, // onProgress callback (not used)
    (error) => {
        console.error("An error occurred loading the Earth texture:", error);
    }
);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.7,   // Reduces shininess
    metalness: 0.0    // Earth is non-metallic
});
const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 4.1 Add Transparent Cloud Layer
const cloudTexture = textureLoader.load('/texture/earth_clouds/earth-clouds.jpg', () => {
    console.log("Cloud texture loaded successfully.");
});

const cloudMaterial = new THREE.MeshStandardMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.5,           // Adjust for soft clouds
    depthWrite: false       // Prevent z-fighting
});

const cloudGeometry = new THREE.SphereGeometry(1.515, 64, 64); // Slightly larger than Earth
const cloudSphere = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudSphere);
earth.rotation.y = Math.PI / 3; 

// 5. Load and apply as skydome for space background
textureLoader.load('/texture/space/stars-milky-way.jpg', (spaceTexture) => {
    const spaceGeometry = new THREE.SphereGeometry(1000, 128, 128);
    const spaceMaterial = new THREE.MeshBasicMaterial({
        map: spaceTexture,
        side: THREE.BackSide // Camera looks from inside the sphere
    });

    const spaceSphere = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(spaceSphere);
});

// 6. Create Trajectory Lines
function createTrajectory(color, rotationX, rotationZ, scaleY) {
    const curve = new THREE.EllipseCurve(
        0, 0,            // Center X, Y
        2.5, scaleY,     // xRadius, yRadius
        0, 2 * Math.PI,  // StartAngle, EndAngle
        false,           // Clockwise
        0                // Rotation
    );
    const points = curve.getPoints(128); // More points for a smoother curve
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
    const ellipse = new THREE.Line(geometry, material);
    ellipse.rotation.x = rotationX;
    ellipse.rotation.z = rotationZ;
    return ellipse;
}

const debrisStartRadius = 3.0; // initial radius of decaying debris
const trajectory1 = createTrajectory(0xff00ff, Math.PI / 5, 0.2, debrisStartRadius); // Debris trajectory

const satelliteRadius = 2.8;
const trajectory2 = createTrajectory(0x00ffff, Math.PI / 6, 0, satelliteRadius); // Cyan

scene.add(trajectory1);
scene.add(trajectory2);

//  Add Debris (on trajectory1)
const debrisGeometry = new THREE.IcosahedronGeometry(0.05, 0);
const debrisMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
scene.add(debris);

// Add Satellite (on trajectory2)
function createSatellite() {
    const satellite = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.15, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    satellite.add(body);

    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x002244 });
    const panelGeometry = new THREE.PlaneGeometry(0.4, 0.2);

    const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
    panel1.position.x = 0.25;
    panel1.rotation.y = Math.PI / 2;
    satellite.add(panel1);

    const panel2 = panel1.clone();
    panel2.position.x = -0.25;
    panel2.rotation.y = -Math.PI / 2;
    satellite.add(panel2);

    return satellite;
}
const satellite = createSatellite();
scene.add(satellite);

// Orbit curves for object animation
const orbitCurve2 = new THREE.EllipseCurve(0, 0, 2.5, 2.8, 0, 2 * Math.PI);
const orbitPoints2 = orbitCurve2.getPoints(500);

let timeStep = 0;

// 7. Initial camera position
camera.position.z = 5;

// 8. Animation Loop
let debrisDecayFactor = 1.0; // Start with full radius
let hasCollided = false; 
//let hasCollided = false; // flag to stop decay
function animate() {
    requestAnimationFrame(animate);

    // Animate debris with decay toward satellite orbit
    const targetRadius = satelliteRadius; // 2.8

    if (!hasCollided) 
    {
        // Animate satellite 
        timeStep = (timeStep + 1) % 500;
 
        const satellite2D = orbitPoints2[timeStep];
        const satellite3D = new THREE.Vector3(satellite2D.x, satellite2D.y, 0).applyEuler(trajectory2.rotation);
        satellite.position.copy(satellite3D);

        const lookAhead = orbitPoints2[(500 - timeStep + 5) % 500];
        const lookAhead3D = new THREE.Vector3(lookAhead.x, lookAhead.y, 0).applyEuler(trajectory2.rotation);
        satellite.lookAt(lookAhead3D);

    // Continue decay
        if (debrisDecayFactor > 1.0) debrisDecayFactor = 1.0; // clamp
        if (debrisDecayFactor > targetRadius / 4.0) {
            debrisDecayFactor -= 0.0001;
        }

        // Calculate current debris radius
        const radiusX = 4.0 * debrisDecayFactor + 0.05 * Math.sin(timeStep * 0.02);
        const radiusY = 4.0 * debrisDecayFactor + 0.05 * Math.cos(timeStep * 0.03);
        const angle = timeStep * 0.012;

        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);

        const debris3D = new THREE.Vector3(x, y, 0).applyEuler(trajectory1.rotation);
        debris.position.copy(debris3D);
        debris.rotation.x += 0.01;
        debris.rotation.y += 0.02;

        // Compare current satellite position to debris position
        //const satellite2D = orbitPoints2[timeStep];
        //const satellite3D = new THREE.Vector3(satellite2D.x, satellite2D.y, 0).applyEuler(trajectory2.rotation);

        const distance = debris3D.distanceTo(satellite3D);

        if (distance < 0.1) 
        {
            hasCollided = true;
            console.log("💥 Collision detected!");
            resultText.textContent = 'Collision Occurred!';
            resultText.style.color = 'red';

            // Optional: visual effect
            debris.material.color.set(0xff0000);
            //satellite.material.color?.set?.(0xff0000); // If it's a Mesh, or handle group color if needed
        }

    } else {
    // Stop decaying, freeze debris at final spot (or let it keep orbiting)
        debris.rotation.x += 0.01;
        debris.rotation.y += 0.02;
    }

    // Earth rotation
    earth.rotation.y += 0.0005;
    // Cloud rotation
    cloudSphere.rotation.y += 0.0006; // Slightly faster than Earth
    

    // Orbit ring rotation
    trajectory1.rotation.y += 0.001;
    trajectory2.rotation.y -= 0.0015;

    controls.update();
    renderer.render(scene, camera);
}

// 9. Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);


// Start the animation
animate();

// Event listeners for buttons
predictbtn.addEventListener("click", () => {
    // Get the latest relative position and distance
    const dx = debris.position.x - satellite.position.x;
    const dy = debris.position.y - satellite.position.y;
    const dz = debris.position.z - satellite.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    getCollisionRisk(dx, dy, dz, distance);
});

resetbtn.addEventListener('click', resetSimulation);

