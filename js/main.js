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

// Setting up the snake behavior
// Match the internal code of the key presses to placeholder variables
// Four possible moves up, down, right, left
const LEFT_DIR = 37
const UP_DIR = 38
const RIGHT_DIR = 39
const DOWN_DIR = 40

// When initializing the game the snake should move to the right
let snakeCurrentDirection = RIGHT_DIR

// Give the user the ability to change directions
const changeDirection = newDirectionCode => {
    // If you're trying to move in the same direction as the current direction of the snake, do nothing
    if (newDirectionCode === snakeCurrentDirection) return

    // Here we make sure that when changing direction the user isn't able to do a full one 180 turn; eg. you cant do a left turn if you're moving to the right
    if (newDirectionCode == LEFT_DIR && snakeCurrentDirection !== RIGHT_DIR) {
        snakeCurrentDirection = newDirectionCode
    } else if (newDirectionCode == UP_DIR && snakeCurrentDirection !== DOWN_DIR) {
        snakeCurrentDirection = newDirectionCode
    } else if (newDirectionCode == RIGHT_DIR && snakeCurrentDirection !== LEFT_DIR) {
        snakeCurrentDirection = newDirectionCode
    } else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection !== UP_DIR) {
        snakeCurrentDirection = newDirectionCode
    }
}

// Set starting point for snake on load
let currentHeadPosition = TOTAL_PIXEL_COUNT / 2

// Set the starting size of the snake
let snakeLength = 200



// Provide the user with the ability to move the snake
const moveSnake = () => {
    switch (snakeCurrentDirection) {
        // Give the snake the ability to move to the left
        case LEFT_DIR:
            // Moving to the left means moving down in the array so that is why we are incrementing down the "currentHeadPosition variable"
            --currentHeadPosition
            // Checks whether the snake has hit the left margin of the board
            const isHeadAtLeft = currentHeadPosition % LINE_PIXEL_COUNT == LINE_PIXEL_COUNT - 1 || currentHeadPosition < 0
            if (isHeadAtLeft) {
                // Once we've hit the left margin (position=0) add the number of pixels (LINE_PIXEL_COUNT=40) so that the snake can start from the right end
                currentFoodPosition = currentFoodPosition + LINE_PIXEL_COUNT
            }
            break;
        // Give the snake the ability to move to the right
        case RIGHT_DIR:
            // Moving up the array means that we increment up the position in the variable "currentHeadPosition"
            ++currentHeadPosition
            // Check whether we are at the 40th pixel (right snake game margin)
            const isHeadAtRight = currentHeadPosition % LINE_PIXEL_COUNT == 0
            // If we are at the right margin put our snake all the way to the left margin of the game screen
            if (isHeadAtRight) {
                currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
            }
            break;
        // Give the snake the ability to move up
        case UP_DIR:
            // Allows our snake to jump one row higher
            // Eg. let's say our snake is at position 60 (middle of the second row), by moving up we want our snake to move to the middle of the first row (position 20) which we can do by substractin the pixel count (this case 40) from the current position of the head
            currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
            // We substract and subtract until we touch the upper most part of the snake game board. At this point, we add the total pixel count (this case 1600) to the current snake position
            // Doing this allows for our snake to reappear at the bottom of the board ONLY when it has moved at the upper most pixel on the top grid
            const isHeadAtTop = currentHeadPosition < 0
            if (isHeadAtTop) {
                currentHeadPosition = currentHeadPosition + TOTAL_PIXEL_COUNT
            }
            break;
        // Give our snake the ability to move down
        case DOWN_DIR:
            // If we want to move down we need to move down the grid which can only be done by adding the line pixel count (this case 40 pixels)
            currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
            // Once we have reached the bottom (position 1600) we substract that value
            // This allows our snake to reappear at the top after having touched the bottom border
            const isHeadAtBottom = currentHeadPosition > TOTAL_PIXEL_COUNT - 1
            if (isHeadAtBottom) {
                currentHeadPosition = currentHeadPosition - TOTAL_PIXEL_COUNT
            }
            break;
        // Default case of our switch statement where the function returns (hint: prevents it from running) if the users' keys do not match the four given functions (up, bottom, left, right)
        default:
            break;
    }

    // Accessed the correct pixel within the HTML collection
    let nextSnakeHeadPixel = gameBoardPixels[currentHeadPosition]

    // Check if snake head is about to intersect with its own body
    if (nextSnakeHeadPixel.classList.contains('snakeBodyPixel')) {
        clearInterval(moveSnakeInterval)
        alert(`You have eaten ${totalFoodEaten} food and traveled ${totalDistanceTraveled} blocks.`)
        window.location.reload()
    }

    // Assuming an empty pixel, add snake body styling
    nextSnakeHeadPixel.classList.add('snakeBodyPixel')

    // Remove snake styling to keep snake appropriate length
    setTimeout(() => {
        nextSnakeHeadPixel.classList.remove('snakeBodyPixel')
    }, snakeLength)

    // Describe what to do if snake encounters a food pixel
    if (currentHeadPosition == currentFoodPosition) {
        // increment the variable that tracks food
        totalFoodEaten++
        // put the new value in the DOM
        document.getElementById('pointsEarned').innerText = totalFoodEaten
        // Increase the size of the snake
        snakeLength = snakeLength + 100
        // Run the createFood function that removes the current position of the food and places it somewhere else randomly on the board
        createFood()
    }

    // Increment the distance traveled and display that in the DOM
    totalDistanceTraveled++
    document.getElementById('blocksTraveled').innerText = totalDistanceTraveled

}


