import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#102E50');
document.body.appendChild(renderer.domElement);

let gameStarted = false;
let gamePaused = false;


const tableWidth = 10;
const tableHeight = 1;
const tableLength = 20;
const tableColor = '#F5C45E';


const tableGeometry = new THREE.BoxGeometry(tableWidth, tableHeight, tableLength);
const tableMaterial = new THREE.MeshBasicMaterial({ color: tableColor });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
const tableEdge = new THREE.EdgesGeometry( tableGeometry );
const tableLine = new THREE.LineSegments(tableEdge, new THREE.LineBasicMaterial( { color: 'black' } ) );
table.add(tableLine)
table.position.set(0, -tableHeight / 2, 0);
scene.add(table);


const paddleRadius = 1;
const paddleHeight = 0.5;
const paddleRadialSegments = 10;
const paddleHeightSegments = 10;
const paddleColor = '#BE3D2A';
const paddleZOffset = tableLength / 2 - 2;


const paddleGeometry = new THREE.CylinderGeometry(paddleRadius, paddleRadius, paddleHeight, paddleRadialSegments, paddleHeightSegments, false, 0);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: paddleColor });

const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const edgesLeft = new THREE.EdgesGeometry( paddleGeometry );
const lineLeft = new THREE.LineSegments(edgesLeft, new THREE.LineBasicMaterial( { color: 'black' } ) );
leftPaddle.add(lineLeft);
leftPaddle.position.set(0, tableHeight, -paddleZOffset);
leftPaddle.rotation.x = Math.PI / 2;
scene.add(leftPaddle);

const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const edgesRight = new THREE.EdgesGeometry( paddleGeometry );
const lineRight = new THREE.LineSegments(edgesRight, new THREE.LineBasicMaterial( { color: 'black' } ) );
rightPaddle.add(lineRight);
rightPaddle.position.set(0, tableHeight, paddleZOffset);
rightPaddle.rotation.x = Math.PI / 2;
scene.add(rightPaddle);


const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 0);
scene.add(ball);


let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;
let leftScore = 0;
let rightScore = 0;

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Player 1: ${leftScore} | Player 2: ${rightScore}`;
    } else {
        console.log(`Player 1: ${leftScore} | Player 2: ${rightScore}`);
    }
}


let scoreDiv = document.getElementById('score');
if (!scoreDiv) {
    scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.style.position = 'absolute';
    scoreDiv.style.top = '10px';
    scoreDiv.style.left = '10px';
    scoreDiv.style.color = 'white';
    scoreDiv.style.fontSize = '20px';
    document.body.appendChild(scoreDiv);
    updateScoreDisplay();
}

camera.position.set(0, 5, 15);
camera.lookAt(scene.position);

const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const startButton = document.createElement('button');
startButton.textContent = 'start game';
startButton.style.position = 'absolute';
startButton.style.top = '50%';
startButton.style.left = '50%';
startButton.style.transform = 'translate(-50%, -50%)';
startButton.style.padding = '20px 40px';
startButton.style.fontSize = '24px';
startButton.style.fontFamily = 'Roboto'
startButton.style.cursor = 'pointer';
document.body.appendChild(startButton);


startButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        gamePaused = false;
        startButton.style.display = 'none';
        document.body.style.cursor = 'none'; 
        
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        gamePaused = !gamePaused;
        if (gamePaused) {
            document.body.style.cursor = 'default'; 
            
            document.createElement(textNode)
        } else {
            document.body.style.cursor = 'none'; 
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (gameStarted && !gamePaused) {

        rightPaddle.position.x = mouse.x * (tableWidth / 2);
        rightPaddle.position.y = mouse.y * (tableLength / 2);
        rightPaddle.position.z = paddleZOffset;


        const paddleRadius = 1;
        const tableHalfWidth = tableWidth / 2;
        const tableHalfLength = tableLength / 2;
        rightPaddle.position.x = Math.max(-tableHalfWidth + paddleRadius, Math.min(tableHalfWidth - paddleRadius, rightPaddle.position.x));
        rightPaddle.position.y = Math.max(-tableHalfLength + paddleRadius, Math.min(tableHalfLength - paddleRadius, rightPaddle.position.y));


        leftPaddle.position.z -= leftPaddleSpeed;
        const leftPaddleLimit = tableWidth / 2 - paddleRadius;
        leftPaddle.position.z = Math.max(-paddleZOffset + paddleRadius, Math.min(-paddleZOffset - paddleRadius + tableLength, leftPaddle.position.z));
        leftPaddle.position.x = 0; 

    }

    renderer.render(scene, camera);
}

animate();