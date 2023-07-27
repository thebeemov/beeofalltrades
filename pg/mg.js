const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
};

// Create a new Phaser game
const game = new Phaser.Game(config);

// Global variables
let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let currentPlayer = 'Player 1'; // Track the current player's turn
let player1Score = 0;
let player2Score = 0;
let scoreTextPlayer1;
let scoreTextPlayer2;
let winText; // New variable to store the win text

// Card images (replace with your own images)
const cardImages = [
  'card1',
  'card1', // Pair 1 (two cards with the same image key 'card1')
  'card2',
  'card2', // Pair 2 (two cards with the same image key 'card2')
  'card3',
  'card3', // Pair 3 (two cards with the same image key 'card3')
  'card4',
  'card4', // Pair 4 (two cards with the same image key 'card4')
  'card5',
  'card5', // Pair 5 (two cards with the same image key 'card5')
  'card6',
  'card6', // Pair 6 (two cards with the same image key 'card6')
  'card7',
  'card7', // Pair 7 (two cards with the same image key 'card7')
  'card8',
  'card8', // Pair 8 (two cards with the same image key 'card8')
];

// Shuffle the card images
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function preload() {
  this.load.image('background', 'images/background.png');
  this.load.image('card-back', 'images/card-back.png');
  this.load.image('card1', 'images/bee.png');
  this.load.image('card2', 'images/pentagon.png');
  this.load.image('card3', 'images/beevil.png');
  this.load.image('card4', 'images/beeofalltradeslogo.png');
  this.load.image('card5', 'images/playerBee.png');
  this.load.image('card6', 'images/beefilmStudiosLogo.png');
  this.load.image('card7', 'images/beehive.png'); // Replace 'your_image7.png' with the correct filename for card 7
  this.load.image('card8', 'images/honeyBottle.png'); // Replace 'your_image8.png' with the correct filename for card 8

  for (const cardImage of cardImages) {
    this.load.image(cardImage, `images/${cardImage}.png`);
  }
}

function create() {
  // Add the background
  this.add.image(0, 0, 'background').setScale(1.1);

  // Shuffle the card images
  shuffleArray(cardImages);

  // Create the grid for the cards
  const gridSize = 4; // 4x4 grid
  const cardSize = 100;
  const spacing = 42;
  const xOffset = (config.width - gridSize * (cardSize + spacing)) / 2;
  const yOffset = (config.height - gridSize * (cardSize + spacing)) / 2;

  let cardx = 100;
  let cardy = 100;

  // Create cards and add click event
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = cardx + j * (cardSize + spacing);
      let y = cardy + i * (cardSize + spacing);

      const card = this.add.image(x, y, 'card-back').setInteractive().setScale(0.25);
      card.setData('flipped', false);
      card.setData('imageKey', cardImages[i * gridSize + j]); // Assign the correct image key

      card.on('pointerup', function () {
        if ((currentPlayer === 'Player 1' && this !== card2) || (currentPlayer === 'Player 2' && this !== card1)) {
          flipCard(this);
        }
      });
    }
  }

  // Create and display score text for Player 1
  scoreTextPlayer1 = this.add.text(config.width - 200, 265, 'Player 1 Score: 0', { font: '24px Arial', fill: '#ffffff' });

  // Create and display score text for Player 2
  scoreTextPlayer2 = this.add.text(config.width - 200, 300, 'Player 2 Score: 0', { font: '24px Arial', fill: '#ffffff' });

  // Create and display the win text, but hide it initially
  winText = this.add.text(config.width / 2, config.height / 2, '', { font: '48px Arial', fill: '#ffffff' }).setOrigin(0.5);
  winText.setVisible(false);
}

function flipCard(card) {
  if (card.getData('flipped') || cardsFlipped >= 2) {
    return;
  }

  card.setTexture(card.getData('imageKey'));
  card.setData('flipped', true);

  if (!card1) {
    card1 = card;
  } else {
    card2 = card;
    checkMatch();
  }
}

function checkMatch() {
  if (card1.getData('imageKey') === card2.getData('imageKey')) {
    cardsFlipped = 0;
    card1 = null;
    card2 = null;
    if (currentPlayer === 'Player 1') {
      player1Score++;
      updateScoreTextPlayer1('Player 1 Score: ' + player1Score);
    } else {
      player2Score++;
      updateScoreTextPlayer2('Player 2 Score: ' + player2Score);
    }
  } else {
    setTimeout(() => {
      card1.setTexture('card-back');
      card2.setTexture('card-back');
      card1.setData('flipped', false);
      card2.setData('flipped', false);
      cardsFlipped = 0;
      card1 = null;
      card2 = null;

      // Switch turns between players
      currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';

      // Check if all cards are flipped and display the winner
      checkWin.call(this);
    }, 1000);
  }
}

// Helper function to update score text on the screen for Player 1
function updateScoreTextPlayer1(text) {
  scoreTextPlayer1.setText(text);
}

// Helper function to update score text on the screen for Player 2
function updateScoreTextPlayer2(text) {
  scoreTextPlayer2.setText(text);
}

