// Keeping track of the size of the game board
const LINE_PIXEL_COUNT = 40
const TOTAL_PIXEL_COUNT = LINE_PIXEL_COUNT ** 2

// Keep track of progress and display it to user
let totalFoodEaten = 0
let totalDistanceTraveled = 0

// Reference to the HTML elements with the ID of "gameContainer"
const gameContainer = document.getElementById('gameContainer')

// Generate the game board
const createBoardPixels = () => {
    // Create 1600 pixels by appending 1600 divs each with the gameBoardPixel and an unique identifier
    for (let i = 1; i <= TOTAL_PIXEL_COUNT; i++) {
        // Adding the ${gameContainer.innerHTML} at the beginning of the div makes sure we append divs
        // to the gameContainer class and DO NOT end up with only one pixel (the one with the id of 1600)
        gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
    }
}

// Reference to HTML elements with the class name of "gameBoardPixel"
const gameBoardPixels = document.getElementsByClassName('gameBoardPixel')

// The position of the food (the one pixel item that the snake should cross in order to grow)
let currentFoodPosition = 0

// Each time this function is called we remove the class of "food" from the current pixel with the food class. Furthermore, we randomly generate it into another place (between 0 and 1600) and add to the chosen pixel the class of "food" (which holds distinct CSS styling)
const createFood = () => {
    gameBoardPixels[currentFoodPosition].classList.remove('food')
    currentFoodPosition = Math.floor(Math.random() * TOTAL_PIXEL_COUNT)
    gameBoardPixels[currentFoodPosition].classList.add('food')
}