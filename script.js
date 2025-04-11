import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#004687'); 
document.body.appendChild(renderer.domElement);


const paddleRadius = 2;
const paddleHeight = 1;
const paddleRadialSegments = 25;
const paddleHeightSegments = 10;

const paddleGeometry = new THREE.CylinderGeometry(paddleRadius, paddleRadius, paddleHeight, paddleRadialSegments, paddleHeightSegments, false, 0);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: '#6082B6'});

const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);


const paddleXPosition = -3; 
leftPaddle.position.set(paddleXPosition, paddleHeight / 2, 0);
rightPaddle.position.set(paddleXPosition, paddleHeight / 2, 0);

scene.add(leftPaddle);
scene.add(rightPaddle);

// Create ball
const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.2, 0);
scene.add(ball);

// Set up game variables
let ballVelocity = new THREE.Vector3(0.1, 0.1, 0.1);
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;

// Camera position
camera.position.set(0,10,50)

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
            leftPaddleSpeed = -0.1; 
            break;
        case 'd':
            leftPaddleSpeed = 0.1; 
            break;
        case 'ArrowLeft':
            rightPaddleSpeed = -0.1; 
            break;
        case 'ArrowRight':
            rightPaddleSpeed = 0.1;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
        case 'd':
            leftPaddleSpeed = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            rightPaddleSpeed = 0;
            break;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move paddles
    leftPaddle.position.x += leftPaddleSpeed;
    rightPaddle.position.x += rightPaddleSpeed;

    // Keep paddles within bounds
    leftPaddle.position.x = Math.max(-5 + paddleRadius, Math.min(leftPaddle.position.x, -1 + paddleRadius));
    rightPaddle.position.x = Math.max(1 - paddleRadius, Math.min(rightPaddle.position.x, 5 - paddleRadius));

    // Move ball
    ball.position.add(ballVelocity);

    // Check for collisions with paddles
    if (ball.position.x <= -2.5 && ball.position.y <= leftPaddle.position.y + paddleHeight / 2 && ball.position.y >= leftPaddle.position.y - paddleHeight / 2) {
        ballVelocity.x = -ballVelocity.x; // Bounce off left paddle
    }
    if (ball.position.x >= 2.5 && ball.position.y <= rightPaddle.position.y + paddleHeight / 2 && ball.position.y >= rightPaddle.position.y - paddleHeight / 2) {
        ballVelocity.x = -ballVelocity.x; // Bounce off right paddle
    }

    // Check for collisions with top and bottom walls
    if (ball.position.y >= 3 || ball.position.y <= 0) {
        ballVelocity.y = -ballVelocity.y; // Bounce off top and bottom
    }

    // Reset ball if it goes out of bounds
    if (ball.position.x < -5 || ball.position.x > 5) {
        ball.position.set(0, 0.2, 0);
        ballVelocity.set(0.1, 0.1, 0.1); // Reset velocity
    }

    renderer.render(scene, camera);
}

animate();