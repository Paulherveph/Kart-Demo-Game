const kart = document.getElementById('kart');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const winMessage = document.getElementById('winMessage');

// Kart properties
let kartX = kart.offsetLeft;
let kartY = kart.offsetTop;
const kartSpeed = 12; // Slightly faster speed
let currentRotation = 0; // Initial rotation (0 degrees for 'up')

// Score
let score = 0;
let dotsRemaining = 0;

// Get game area boundaries
const gameAreaRect = gameArea.getBoundingClientRect();
// Adjust boundaries slightly to account for potential scrollbars/offsets if needed
const gameAreaWidth = gameArea.clientWidth;
const gameAreaHeight = gameArea.clientHeight;


// Kart dimensions
const kartWidth = kart.offsetWidth;
const kartHeight = kart.offsetHeight;

// --- Collectible Dots ---
const dots = []; // Array to hold dot elements
const numberOfDots = 15;

function createDots() {
    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        // Ensure dots are placed within bounds
        const dotSize = 15; // Match CSS width/height
        let dotX, dotY;
        let positionOk = false;

        // Avoid placing dots too close to the start or edges
        while (!positionOk) {
            dotX = Math.random() * (gameAreaWidth - dotSize - 20) + 10; // Add padding
            dotY = Math.random() * (gameAreaHeight - dotSize - 50) + 10; // Avoid bottom start area
            // Basic check: ensure it's not exactly where the kart starts
            if (Math.abs(dotX - kartX) > kartWidth * 2 || Math.abs(dotY - kartY) > kartHeight * 2) {
                 positionOk = true;
                 // Could add checks here to prevent dots overlapping each other if needed
            }
        }


        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        gameArea.appendChild(dot);
        dots.push(dot);
    }
    dotsRemaining = dots.length;
}

// --- Collision Detection (Axis-Aligned Bounding Box) ---
function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}


// --- Game Loop / Input Handling ---
document.addEventListener('keydown', (event) => {
    if (dotsRemaining <= 0) return; // Stop movement if game is won

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    let targetRotation = currentRotation;
    let moveX = 0;
    let moveY = 0;

    switch (event.key) {
        case 'ArrowUp':
            moveY = -kartSpeed;
            targetRotation = 0; // Pointing up
            break;
        case 'ArrowDown':
            moveY = kartSpeed;
            targetRotation = 180; // Pointing down
            break;
        case 'ArrowLeft':
            moveX = -kartSpeed;
            targetRotation = -90; // Pointing left
            break;
        case 'ArrowRight':
            moveX = kartSpeed;
            targetRotation = 90; // Pointing right
            break;
        default:
            return;
    }

    // Calculate new proposed position
    let newX = kartX + moveX;
    let newY = kartY + moveY;

    // Boundary detection
    if (newX < 0) newX = 0;
    if (newX + kartWidth > gameAreaWidth) newX = gameAreaWidth - kartWidth;
    if (newY < 0) newY = 0;
    if (newY + kartHeight > gameAreaHeight) newY = gameAreaHeight - kartHeight;

    // Update kart position variables and styles
    kartX = newX;
    kartY = newY;
    kart.style.left = `${kartX}px`;
    kart.style.top = `${kartY}px`;

    // Update rotation if direction changed
    if (targetRotation !== currentRotation) {
        kart.style.transform = `rotate(${targetRotation}deg)`;
        currentRotation = targetRotation;
    }

    // Check for collisions with dots
    for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        if (checkCollision(kart, dot)) {
            gameArea.removeChild(dot); // Remove dot from screen
            dots.splice(i, 1); // Remove dot from array
            score++;
            dotsRemaining--;
            scoreDisplay.textContent = score;

            // Check for win condition
            if (dotsRemaining <= 0) {
                winMessage.style.display = 'block'; // Show win message
            }
        }
    }
});

// --- Initialize Game ---
function initGame() {
    // Reset score and messages
    score = 0;
    dotsRemaining = 0;
    scoreDisplay.textContent = score;
    winMessage.style.display = 'none';

    // Clear existing dots if any (for potential restart)
    const existingDots = gameArea.querySelectorAll('.dot');
    existingDots.forEach(dot => gameArea.removeChild(dot));
    dots.length = 0; // Clear the array

    // Create new dots
    createDots();

    // Reset kart position and rotation
    kartX = kart.offsetLeft;
    kartY = kart.offsetTop; // Recalculate Y just in case
    kart.style.left = `${kartX}px`;
    kart.style.top = `${kartY}px`;
    kart.style.transform = 'rotate(0deg)';
    currentRotation = 0;

    console.log('Enhanced Kart Controller Initialized. Use arrow keys.');
}

// Start the game
initGame();
