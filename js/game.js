let gameStartTime = Date.now();
let timerInterval;
let isGameActive = true;
let totalRounds = 0;
let playerPoints = getRandomPoints();
let computer1Points = getRandomPoints();
let computer2Points = getRandomPoints();
let playerScore = 0;
let computer1Score = 0;
let computer2Score = 0;
let consecutiveWins = 0;
let consecutiveLosses = 0;
let isThreePlayerMode = false;

const choices = {
  rock: { static: "../images/rockstatic.gif", gif: "../images/Rock.gif" },
  paper: { static: "../images/paperstatic.gif", gif: "../images/Paper.gif" },
  scissors: { static: "../images/scissorstatic.gif", gif: "../images/Scissor.gif" }
};

// Sound initialization
const backgroundMusic = new Audio('../sounds/background.mp3');
const consecutiveWinSound = new Audio('../sounds/winner.mp3');
const endGameSound = new Audio('../sounds/endgame.mp3');
const gameOverSound = new Audio('../sounds/gameover.mp3');
const highestPointsSound = new Audio('../sounds/highest.mp3');
const consecutiveLossSound = new Audio('../sounds/loss.mp3');

// Set background music properties
backgroundMusic.volume = 0.4;
backgroundMusic.loop = true;

document.addEventListener('DOMContentLoaded', function() {
  updatePointsDisplay();
  setupEventListeners();
  checkHighestPoints();
  setupBackButton();
  
  // Start background music
  backgroundMusic.play()
    .catch(err => console.log('Error playing background music:', err));
});

function setupBackButton() {
  const backButton = document.createElement('div');
  backButton.innerHTML = `
    <button class="back-button" onclick="goBack()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5"/>
        <path d="M12 19l-7-7 7-7"/>
      </svg>
    </button>
  `;
  document.body.insertBefore(backButton, document.body.firstChild);
}

function goBack() {
  window.history.back();
}

function setupEventListeners() {
  document.getElementById("twoPlayerMode").addEventListener("click", () => setGameMode(false));
  document.getElementById("threePlayerMode").addEventListener("click", () => setGameMode(true));
  document.getElementById("endGameButton").addEventListener("click", endGame);
  
  // Add beforeunload event listener to handle music
  window.addEventListener('beforeunload', () => {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  });
}

function setGameMode(threePlayer) {
  isThreePlayerMode = threePlayer;
  document.getElementById("twoPlayerMode").classList.toggle("active", !threePlayer);
  document.getElementById("threePlayerMode").classList.toggle("active", threePlayer);
  
  const computer2Elements = document.querySelectorAll("#computer2Container");
  computer2Elements.forEach(el => el.style.display = threePlayer ? "block" : "none");
  
  resetGame();
}

function resetGame() {
  playerPoints = getRandomPoints();
  computer1Points = getRandomPoints();
  computer2Points = getRandomPoints();
  playerScore = 0;
  computer1Score = 0;
  computer2Score = 0;
  consecutiveWins = 0;
  consecutiveLosses = 0;
  totalRounds = 0;
  gameStartTime = Date.now();
  isGameActive = true;
  updatePointsDisplay();
  document.getElementById("winner").textContent = "Let's Play!";
  checkHighestPoints();
}

function updatePointsDisplay() {
  document.getElementById("userPoints").textContent = `Points: ${playerPoints}`;
  document.getElementById("computer1Points").textContent = `Points: ${computer1Points}`;
  document.getElementById("computer2Points").textContent = `Points: ${computer2Points}`;
  document.querySelector(".player-score").textContent = playerScore;
  document.querySelector(".computer1-score").textContent = computer1Score;
  document.querySelector(".computer2-score").textContent = computer2Score;
}

function playGame(userSelection) {
  if (!isGameActive) return;
  
  totalRounds++;
  const computer1Selection = getComputerChoice();
  const computer2Selection = isThreePlayerMode ? getComputerChoice() : null;

  updateImage("userChoice", userSelection, "gif");
  updateImage("computer1Choice", computer1Selection, "gif");
  if (isThreePlayerMode) {
    updateImage("computer2Choice", computer2Selection, "gif");
  }

  setTimeout(() => {
    updateImage("userChoice", userSelection, "static");
    updateImage("computer1Choice", computer1Selection, "static");
    if (isThreePlayerMode) {
      updateImage("computer2Choice", computer2Selection, "static");
    }
  }, 1000);

  setTimeout(() => {
    const result = determineWinner(userSelection, computer1Selection, computer2Selection);
    updateGameState(result);
  }, 1800);
}

function determineWinner(user, computer1, computer2) {
  if (!isThreePlayerMode) {
    return determineWinnerTwoPlayer(user, computer1);
  }
  return determineWinnerThreePlayer(user, computer1, computer2);
}

function determineWinnerTwoPlayer(user, computer) {
  if (user === computer) return "It's a draw!";
  if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  ) {
    return "You win!";
  }
  return "Computer 1 wins!";
}

function determineWinnerThreePlayer(user, computer1, computer2) {
  const choices = [user, computer1, computer2];
  const uniqueChoices = new Set(choices);

  if (uniqueChoices.size === 1) return "It's a three-way draw!";
  if (uniqueChoices.size === 3) return "It's a three-way draw!";

  if (uniqueChoices.size === 2) {
    if (
      (user === "rock" && computer1 === "scissors" && computer2 === "scissors") ||
      (user === "paper" && computer1 === "rock" && computer2 === "rock") ||
      (user === "scissors" && computer1 === "paper" && computer2 === "paper")
    ) {
      return "You win!";
    }
    if (
      (computer1 === "rock" && user === "scissors" && computer2 === "scissors") ||
      (computer1 === "paper" && user === "rock" && computer2 === "rock") ||
      (computer1 === "scissors" && user === "paper" && computer2 === "paper")
    ) {
      return "Computer 1 wins!";
    }
    if (
      (computer2 === "rock" && user === "scissors" && computer1 === "scissors") ||
      (computer2 === "paper" && user === "rock" && computer1 === "rock") ||
      (computer2 === "scissors" && user === "paper" && computer1 === "paper")
    ) {
      return "Computer 2 wins!";
    }
  }
  return "It's a draw!";
}

function updateGameState(result) {
  if (!isGameActive) return;

  if (result === "You win!") {
    computer1Points -= 10;
    if (isThreePlayerMode) computer2Points -= 10;
    playerScore++;
    consecutiveWins++;
    consecutiveLosses = 0;
    if (consecutiveWins === 3) {
      alert("Congratulations! You have won 3 consecutive rounds!");
      playConsecutiveWinSound();
    }
  } else if (result.includes("Computer")) {
    playerPoints -= 10;
    consecutiveWins = 0;
    consecutiveLosses++;
    
    if (result === "Computer 1 wins!") {
      if (isThreePlayerMode) computer2Points -= 10;
      computer1Score++;
    } else {
      computer1Points -= 10;
      computer2Score++;
    }

    if (consecutiveLosses === 3) {
      playConsecutiveLossSound();
    }
  }

  checkHighestPoints();

  if (playerPoints <= 10) {
    alert("Warning! You only have 10 points remaining.");
  }

  if (playerPoints <= 0 || computer1Points <= 0 || (isThreePlayerMode && computer2Points <= 0)) {
    let finalResult = "Game Over! ";
    if (playerPoints > 0) finalResult += "You win the game!";
    else if (computer1Points > 0) finalResult += "Computer 1 wins the game!";
    else finalResult += "Computer 2 wins the game!";
    
    document.getElementById("winner").textContent = finalResult;
    
    if (playerPoints <= 0) {
      playGameOverSound();
    }
    
    showGameStats();
  } else {
    document.getElementById("winner").textContent = result;
  }

  updatePointsDisplay();
}

function showGameStats() {
  if (!isGameActive) return;
  isGameActive = false;
  
  // Stop background music when showing stats
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  
  document.querySelector('.game-container').style.display = 'none';
  document.getElementById('statsScreen').style.display = 'flex';

  const endTime = Date.now();
  const durationInSeconds = Math.floor((endTime - gameStartTime) / 1000);
  
  document.getElementById('gameDuration').textContent = formatDuration(durationInSeconds);
  document.getElementById('totalPlayerWins').textContent = playerScore;
  document.getElementById('totalComputerWins').textContent = 
    isThreePlayerMode ? computer1Score + computer2Score : computer1Score;

  startStatsTimer();
}

function startStatsTimer() {
  let timeLeft = 20;
  const countdownElement = document.getElementById('countdown');
  
  timerInterval = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      window.location.href = 'feedback.html';
    }
  }, 1000);
}

function checkHighestPoints() {
  const userHasHighest = playerPoints > computer1Points && 
    (!isThreePlayerMode || playerPoints > computer2Points);
    
  if (userHasHighest) {
    highestPointsSound.play()
      .catch(err => console.log('Error playing highest points sound:', err));
  }
}

function playConsecutiveWinSound() {
  consecutiveWinSound.play()
    .catch(err => console.log('Error playing consecutive win sound:', err));
}

function playConsecutiveLossSound() {
  consecutiveLossSound.play()
    .catch(err => console.log('Error playing consecutive loss sound:', err));
}

function playEndGameSound() {
  endGameSound.play()
    .catch(err => console.log('Error playing end game sound:', err));
}

function playGameOverSound() {
  gameOverSound.play()
    .catch(err => console.log('Error playing game over sound:', err));
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getComputerChoice() {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * options.length)];
}

function updateImage(elementId, choice, type) {
  const element = document.getElementById(elementId);
  element.src = choices[choice][type];
  element.style.transform = elementId === "computerChoice" ? "scaleX(-1)" : "scaleX(1)";
}

function endGame() {
  if (!isGameActive) return;
  disableGame();
  playEndGameSound();
  showGameStats();
}

function disableGame() {
  document.querySelectorAll(".choice").forEach(button => {
    button.disabled = true;
  });
}

function getRandomPoints() {
  return Math.floor(Math.random() * 9 + 2) * 10;
}