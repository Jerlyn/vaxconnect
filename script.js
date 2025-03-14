// VaxConnect - A vaccine-themed connections game
document.addEventListener('DOMContentLoaded', function() {
    // Game data
    const gameData = {
        categories: [
            {
                name: "Vaccine Types",
                words: ["mRNA", "Inactivated", "Subunit", "Viral Vector"],
                description: "Different types of vaccine technologies"
            },
            {
                name: "Vaccination Locations",
                words: ["Pharmacy", "Clinic", "Hospital", "School"],
                description: "Places where vaccines may be administered"
            },
            {
                name: "Immune System Components",
                words: ["Antibody", "T-Cell", "B-Cell", "Macrophage"],
                description: "Parts of the immune system activated by vaccines"
            },
            {
                name: "Historic Vaccine Pioneers",
                words: ["Jenner", "Pasteur", "Salk", "Sabin"],
                description: "Scientists who made major contributions to vaccine development"
            }
        ],
        // Alternative categories for variety
        alternateCategories: [
            {
                name: "Vaccine-Preventable Diseases",
                words: ["Polio", "Measles", "Tetanus", "Influenza"],
                description: "Diseases that can be prevented by vaccines"
            },
            {
                name: "Vaccine Side Effects",
                words: ["Soreness", "Fever", "Fatigue", "Headache"],
                description: "Common temporary side effects after vaccination"
            },
            {
                name: "Global Health Organizations",
                words: ["WHO", "UNICEF", "GAVI", "CDC"],
                description: "Organizations involved in global vaccination efforts"
            },
            {
                name: "Vaccine Storage Terms",
                words: ["Cold Chain", "Refrigeration", "Vial", "Diluent"],
                description: "Terms related to vaccine storage and handling"
            },
            {
                name: "Vaccine Components",
                words: ["Antigen", "Adjuvant", "Preservative", "Stabilizer"],
                description: "Ingredients found in various vaccines"
            },
            {
                name: "Childhood Vaccines",
                words: ["MMR", "DTaP", "Hib", "Rotavirus"],
                description: "Common vaccines given to children"
            },
            {
                name: "Vaccine Development Phases",
                words: ["Preclinical", "Phase I", "Phase II", "Phase III"],
                description: "Stages of vaccine clinical testing"
            },
            {
                name: "Immunity Types",
                words: ["Herd", "Natural", "Passive", "Adaptive"],
                description: "Different forms of immunity"
            },
            {
                name: "Vaccination Equipment",
                words: ["Syringe", "Needle", "Alcohol Swab", "Bandage"],
                description: "Items used during vaccination"
            },
            {
                name: "Vaccination Schedule Terms",
                words: ["Booster", "Primary Series", "Catch-up", "Delayed"],
                description: "Terms related to vaccination timing"
            },
            {
                name: "Modern Vaccine Companies",
                words: ["Pfizer", "Moderna", "Novavax", "AstraZeneca"],
                description: "Pharmaceutical companies that produce vaccines"
            },
            {
                name: "Immunization Records",
                words: ["Card", "Registry", "Database", "Certificate"],
                description: "Ways to document vaccinations"
            }
        ]
    };

    // Game state
    let gameState = {
        selectedWords: [],
        foundCategories: [],
        availableHints: 3,
        timeRemaining: 60,
        timerInterval: null,
        isGameActive: false,
        hintsUsed: 0
    };

    // DOM elements
    const elements = {
        gameBoard: document.getElementById('game-board'),
        timerDisplay: document.getElementById('timer-display'),
        hintsRemaining: document.getElementById('hints-remaining'),
        hintButton: document.getElementById('hint-button'),
        submitButton: document.getElementById('submit-btn'),
        shuffleButton: document.getElementById('shuffle-btn'),
        selectedWordsContainer: document.getElementById('selected-words'),
        foundCategoriesContainer: document.getElementById('found-categories'),
        selectionInfo: document.getElementById('selection-info'),
        
        // Modals
        gameEndModal: document.getElementById('game-end-modal'),
        leaderboardModal: document.getElementById('leaderboard-modal'),
        instructionsModal: document.getElementById('instructions-modal'),
        
        // Game end elements
        endGameTitle: document.getElementById('end-game-title'),
        gameResult: document.getElementById('game-result'),
        timeRemainingDisplay: document.getElementById('time-remaining'),
        hintsUsedDisplay: document.getElementById('hints-used'),
        playerInitialsInput: document.getElementById('player-initials'),
        saveScoreButton: document.getElementById('save-score-btn'),
        playAgainButton: document.getElementById('play-again-btn'),
        
        // Share buttons
        shareTwitter: document.getElementById('share-twitter'),
        shareFacebook: document.getElementById('share-facebook'),
        copyResult: document.getElementById('copy-result'),
        
        // Leaderboard elements
        leaderboardBody: document.getElementById('leaderboard-body'),
        showLeaderboardButton: document.getElementById('show-leaderboard-btn'),
        closeLeaderboardButton: document.getElementById('close-leaderboard-btn'),
        
        // Instructions elements
        showInstructionsButton: document.getElementById('show-instructions-btn'),
        closeInstructionsButton: document.getElementById('close-instructions-btn'),
        
        // Accessibility
        accessibilitySettings: document.getElementById('accessibility-settings'),
        
        // Copyright year
        currentYear: document.getElementById('current-year')
    };

    // Set current year for copyright
    elements.currentYear.textContent = new Date().getFullYear();

    // Initialize the game
    function initGame() {
        // Reset game state
        gameState = {
            selectedWords: [],
            foundCategories: [],
            availableHints: 3,
            timeRemaining: 180,
            timerInterval: null,
            isGameActive: true,
            hintsUsed: 0
        };
        
        // Display available hints
        elements.hintsRemaining.textContent = gameState.availableHints;
        
        // Clear any previous game elements
        elements.gameBoard.innerHTML = '';
        elements.selectedWordsContainer.innerHTML = '';
        elements.foundCategoriesContainer.innerHTML = '';
        
        // Choose categories for this game
        const usedCategories = chooseGameCategories();
        
        // Create and shuffle word array
        const allWords = createShuffledWordArray(usedCategories);
        
        // Create word cards
        createWordCards(allWords);
        
        // Start the timer
        startTimer();
        
        // Update UI
        updateUI();
        
        // Show instructions for first-time players
        if (!localStorage.getItem('hasPlayedBefore')) {
            showInstructionsModal();
            localStorage.setItem('hasPlayedBefore', 'true');
        }
    }

    // Choose random categories for the game
    function chooseGameCategories() {
        // Combine all categories
        const allCategories = [...gameData.categories, ...gameData.alternateCategories];
        
        // Shuffle the combined array
        const shuffledCategories = shuffleArray(allCategories);
        
        // Take the first 4 categories
        return shuffledCategories.slice(0, 4);
    }

    // Create and shuffle the word array
    function createShuffledWordArray(categories) {
        let allWords = [];
        
        // Collect all words with their category info
        categories.forEach(category => {
            category.words.forEach(word => {
                allWords.push({
                    text: word,
                    category: category.name
                });
            });
        });
        
        // Shuffle the array
        return shuffleArray(allWords);
    }

    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Create word cards and add them to the game board
    function createWordCards(words) {
        words.forEach(word => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.textContent = word.text;
            card.dataset.word = word.text;
            card.dataset.category = word.category;
            
            // Add click event
            card.addEventListener('click', () => handleWordClick(card));
            
            // Add to game board
            elements.gameBoard.appendChild(card);
        });
    }

    // Handle word card click
    function handleWordClick(card) {
        // Ignore clicks if game is not active or card is already completed
        if (!gameState.isGameActive || card.classList.contains('completed')) {
            return;
        }
        
        // Toggle selection
        if (card.classList.contains('selected')) {
            // Deselect
            card.classList.remove('selected');
            gameState.selectedWords = gameState.selectedWords.filter(w => w.text !== card.dataset.word);
        } else {
            // Only allow selection if less than 4 words are already selected
            if (gameState.selectedWords.length < 4) {
                // Select
                card.classList.add('selected');
                gameState.selectedWords.push({
                    text: card.dataset.word,
                    category: card.dataset.category,
                    element: card
                });
            }
        }
        
        // Update UI
        updateUI();
    }

    // Update UI based on current game state
    function updateUI() {
        // Update selected words display
        updateSelectedWordsDisplay();
        
        // Enable/disable submit button
        elements.submitButton.disabled = gameState.selectedWords.length !== 4;
        
        // Update selection info text
        updateSelectionInfoText();
    }

    // Update the selected words display
    function updateSelectedWordsDisplay() {
        elements.selectedWordsContainer.innerHTML = '';
        
        gameState.selectedWords.forEach(word => {
            const selectedWord = document.createElement('span');
            selectedWord.className = 'selected-word';
            selectedWord.textContent = word.text;
            elements.selectedWordsContainer.appendChild(selectedWord);
        });
    }

    // Update selection info text
    function updateSelectionInfoText() {
        if (gameState.selectedWords.length === 0) {
            elements.selectionInfo.textContent = 'Select 4 words that share a connection.';
        } else if (gameState.selectedWords.length < 4) {
            elements.selectionInfo.textContent = `Selected ${gameState.selectedWords.length}/4 words. Need ${4 - gameState.selectedWords.length} more.`;
        } else {
            elements.selectionInfo.textContent = 'Now click Submit to check your selection.';
        }
    }

    // Start the game timer
    function startTimer() {
        // Clear any existing interval
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Update timer display
        elements.timerDisplay.textContent = gameState.timeRemaining;
        
        // Set up interval
        gameState.timerInterval = setInterval(() => {
            gameState.timeRemaining--;
            elements.timerDisplay.textContent = gameState.timeRemaining;
            
            // Check if time's up
            if (gameState.timeRemaining <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    // Submit button click handler
    function handleSubmit() {
        // Check if all selected words belong to the same category
        const categories = gameState.selectedWords.map(word => word.category);
        const uniqueCategories = [...new Set(categories)];
        
        if (uniqueCategories.length === 1) {
            // Correct selection!
            handleCorrectSelection(uniqueCategories[0]);
        } else {
            // Incorrect selection
            handleIncorrectSelection();
        }
    }

    // Handle correct selection
    function handleCorrectSelection(categoryName) {
        // Find the category object
        const category = gameData.categories.find(cat => cat.name === categoryName) || 
                        gameData.alternateCategories.find(cat => cat.name === categoryName);
        
        // Add to found categories
        gameState.foundCategories.push(category);
        
        // Mark selected words as completed
        gameState.selectedWords.forEach(word => {
            word.element.classList.remove('selected');
            word.element.classList.add('completed');
            // Set background color based on category (could use a color coding system)
            word.element.style.backgroundColor = getCategoryColor(gameState.foundCategories.length - 1);
        });
        
        // Add category to found categories display
        addFoundCategoryToDisplay(category);
        
        // Clear selection
        gameState.selectedWords = [];
        
        // Update UI
        updateUI();
        
        // Check if all categories are found
        if (gameState.foundCategories.length === 4) {
            endGame(true);
        }
    }

    // Handle incorrect selection
    function handleIncorrectSelection() {
        // Show shake animation on selected cards
        gameState.selectedWords.forEach(word => {
            word.element.classList.add('incorrect');
            setTimeout(() => {
                word.element.classList.remove('incorrect');
                word.element.classList.remove('selected');
            }, 1000);
        });
        
        // Clear selection
        gameState.selectedWords = [];
        
        // Deduct time as penalty (5 seconds)
        gameState.timeRemaining = Math.max(0, gameState.timeRemaining - 5);
        elements.timerDisplay.textContent = gameState.timeRemaining;
        
        // Check if time's up
        if (gameState.timeRemaining <= 0) {
            endGame(false);
        }
        
        // Update UI
        updateUI();
    }

    // Add found category to display
    function addFoundCategoryToDisplay(category) {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        categoryContainer.style.borderLeft = `5px solid ${getCategoryColor(gameState.foundCategories.length - 1)}`;
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.name;
        categoryContainer.appendChild(categoryTitle);
        
        const categoryDescription = document.createElement('p');
        categoryDescription.textContent = category.description;
        categoryContainer.appendChild(categoryDescription);
        
        const categoryWords = document.createElement('div');
        categoryWords.className = 'category-words';
        
        category.words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'category-word';
            wordSpan.textContent = word;
            categoryWords.appendChild(wordSpan);
        });
        
        categoryContainer.appendChild(categoryWords);
        elements.foundCategoriesContainer.appendChild(categoryContainer);
    }

    // Get color for category (simple color coding)
    function getCategoryColor(index) {
        const colors = [
            '#4CAF50', // Green
            '#2196F3', // Blue
            '#FFC107', // Yellow
            '#F44336'  // Red
        ];
        return colors[index % colors.length];
    }

    // End the game
    function endGame(isWin) {
        // Stop the timer
        clearInterval(gameState.timerInterval);
        gameState.isGameActive = false;
        
        // Update game end modal
        if (isWin) {
            elements.endGameTitle.textContent = 'Congratulations!';
            elements.gameResult.textContent = `You found all 4 categories!`;
        } else {
            elements.endGameTitle.textContent = 'Game Over';
            elements.gameResult.textContent = `You found ${gameState.foundCategories.length} out of 4 categories.`;
        }
        
        // Update stats
        elements.timeRemainingDisplay.textContent = gameState.timeRemaining;
        elements.hintsUsedDisplay.textContent = gameState.hintsUsed;
        
        // Prepare share text
        const shareText = createShareText(isWin);
        
        // Set up share buttons
        setupShareButtons(shareText);
        
        // Show the modal
        showModal(elements.gameEndModal);
    }

    // Create share text
    function createShareText(isWin) {
        const foundCategories = gameState.foundCategories.length;
        const timeRemaining = gameState.timeRemaining;
        const hintsUsed = gameState.hintsUsed;
        
        let shareText = `I played VaxConnect today and `;
        
        if (isWin) {
            shareText += `found all 4 categories with ${timeRemaining} seconds remaining! I used ${hintsUsed}/3 hints.`;
        } else {
            shareText += `found ${foundCategories}/4 categories. I used ${hintsUsed}/3 hints.`;
        }
        
        shareText += ` Play VaxConnect: [YourGameURL]`;
        
        return shareText;
    }

    // Set up share buttons
    function setupShareButtons(shareText) {
        // Twitter share
        elements.shareTwitter.addEventListener('click', () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(twitterUrl, '_blank');
        });
        
        // Facebook share
        elements.shareFacebook.addEventListener('click', () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank');
        });
        
        // Copy result
        elements.copyResult.addEventListener('click', () => {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard!');
            });
        });
    }

    // Show a modal
    function showModal(modal) {
        modal.classList.add('visible');
        modal.setAttribute('aria-hidden', 'false');
        
        // Get the first button in the modal and focus it
        const firstButton = modal.querySelector('button');
        if (firstButton) {
            firstButton.focus();
        }
    }

    // Hide a modal
    function hideModal(modal) {
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Handle hint button click
    function handleHint() {
        if (gameState.availableHints <= 0) {
            alert('No hints available!');
            return;
        }
        
        // Decrement available hints
        gameState.availableHints--;
        gameState.hintsUsed++;
        elements.hintsRemaining.textContent = gameState.availableHints;
        
        // Collect all words on the board that haven't been found yet
        const unsolvedWords = Array.from(document.querySelectorAll('.word-card:not(.completed)'));
        
        // Group by category
        const wordsByCategory = {};
        unsolvedWords.forEach(wordCard => {
            const category = wordCard.dataset.category;
            if (!wordsByCategory[category]) {
                wordsByCategory[category] = [];
            }
            wordsByCategory[category].push(wordCard);
        });
        
        // Find a category with at least 2 words remaining
        const hintCategories = Object.keys(wordsByCategory).filter(
            category => wordsByCategory[category].length >= 2
        );
        
        if (hintCategories.length === 0) {
            alert('No hint available at this time.');
            // Refund the hint
            gameState.availableHints++;
            gameState.hintsUsed--;
            elements.hintsRemaining.textContent = gameState.availableHints;
            return;
        }
        
        // Choose a random category
        const randomCategory = hintCategories[Math.floor(Math.random() * hintCategories.length)];
        
        // Choose 2 random words from that category
        const categoryWords = wordsByCategory[randomCategory];
        const shuffledWords = shuffleArray(categoryWords);
        const hintWords = shuffledWords.slice(0, 2);
        
        // Highlight hint words briefly
        hintWords.forEach(word => {
            word.classList.add('hint-highlight');
            word.style.backgroundColor = 'rgba(255, 193, 7, 0.5)'; // Yellow highlight
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                word.classList.remove('hint-highlight');
                word.style.backgroundColor = '';
            }, 2000);
        });
        
        // Show hint text
        const category = gameData.categories.find(cat => cat.name === randomCategory) || 
                        gameData.alternateCategories.find(cat => cat.name === randomCategory);
        
        const hintText = `Hint: Look for words related to "${category.description}".`;
        elements.selectionInfo.textContent = hintText;
        
        // Reset selection info after 3 seconds
        setTimeout(() => {
            updateSelectionInfoText();
        }, 3000);
    }

    // Handle shuffle button click
    function handleShuffle() {
        // Get all unselected, uncompleted cards
        const availableCards = Array.from(document.querySelectorAll('.word-card:not(.selected):not(.completed)'));
        
        // Get their positions
        const positions = availableCards.map(card => {
            const rect = card.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left
            };
        });
        
        // Shuffle the available cards
        const shuffledCards = shuffleArray(availableCards);
        
        // Animate the shuffle
        shuffledCards.forEach((card, index) => {
            // Get original position
            const originalRect = card.getBoundingClientRect();
            
            // Move to new position (with animation)
            card.style.transition = 'none';
            card.style.position = 'relative';
            card.style.top = `${positions[index].top - originalRect.top}px`;
            card.style.left = `${positions[index].left - originalRect.left}px`;
            
            // Reset after animation
            setTimeout(() => {
                card.style.transition = 'all 0.3s';
                card.style.top = '0';
                card.style.left = '0';
                
                // Reset after transition
                setTimeout(() => {
                    card.style.position = '';
                    card.style.transition = '';
                }, 300);
            }, 50);
        });
        
        // Reorder in the DOM
        shuffledCards.forEach(card => {
            elements.gameBoard.appendChild(card);
        });
    }

    // Save score to leaderboard
    function saveScore() {
        const initials = elements.playerInitialsInput.value.toUpperCase() || 'AAA';
        
        // Validate initials
        if (initials.length > 3) {
            alert('Please enter at most 3 initials');
            return;
        }
        
        // Create score object
        const score = {
            initials: initials,
            timeRemaining: gameState.timeRemaining,
            categoriesFound: gameState.foundCategories.length,
            hintsUsed: gameState.hintsUsed,
            date: new Date().toISOString()
        };
        
        // Get existing scores
        let leaderboard = JSON.parse(localStorage.getItem('vaxconnect-leaderboard') || '[]');
        
        // Add new score
        leaderboard.push(score);
        
        // Sort by categories found (desc), time remaining (desc), and hints used (asc)
        leaderboard.sort((a, b) => {
            if (a.categoriesFound !== b.categoriesFound) {
                return b.categoriesFound - a.categoriesFound;
            }
            if (a.timeRemaining !== b.timeRemaining) {
                return b.timeRemaining - a.timeRemaining;
            }
            return a.hintsUsed - b.hintsUsed;
        });
        
        // Keep only top 10
        leaderboard = leaderboard.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('vaxconnect-leaderboard', JSON.stringify(leaderboard));
        
        // Show confirmation
        alert('Score saved!');
        
        // Update and show leaderboard
        updateLeaderboard();
        hideModal(elements.gameEndModal);
        showModal(elements.leaderboardModal);
    }

    // Update leaderboard display
    function updateLeaderboard() {
        // Get scores
        const leaderboard = JSON.parse(localStorage.getItem('vaxconnect-leaderboard') || '[]');
        
        // Clear existing entries
        elements.leaderboardBody.innerHTML = '';
        
        // Add entries
        leaderboard.forEach((score, index) => {
            const row = document.createElement('tr');
            
            // Rank
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);
            
            // Initials
            const initialsCell = document.createElement('td');
            initialsCell.textContent = score.initials;
            row.appendChild(initialsCell);
            
            // Time
            const timeCell = document.createElement('td');
            timeCell.textContent = `${score.timeRemaining}s`;
            row.appendChild(timeCell);
            
            // Hints
            const hintsCell = document.createElement('td');
            hintsCell.textContent = `${score.hintsUsed}/3`;
            row.appendChild(hintsCell);
            
            // Date
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(score.date).toLocaleDateString();
            row.appendChild(dateCell);
            
            elements.leaderboardBody.appendChild(row);
        });
        
        // Show message if no scores
        if (leaderboard.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.textContent = 'No scores yet. Be the first to play!';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            elements.leaderboardBody.appendChild(row);
        }
    }

    // Toggle accessibility features
    function toggleAccessibility() {
        document.body.classList.toggle('high-contrast');
        document.body.classList.toggle('large-text');
        
        // Save preference
        const isAccessible = document.body.classList.contains('high-contrast');
        localStorage.setItem('vaxconnect-accessibility', isAccessible ? 'true' : 'false');
        
        // Show confirmation
        alert(`Accessibility features ${isAccessible ? 'enabled' : 'disabled'}`);
    }

    // Load accessibility preferences
    function loadAccessibilityPreferences() {
        const isAccessible = localStorage.getItem('vaxconnect-accessibility') === 'true';
        if (isAccessible) {
            document.body.classList.add('high-contrast');
            document.body.classList.add('large-text');
        }
    }

    // Event listeners
    function setupEventListeners() {
        // Game control buttons
        elements.submitButton.addEventListener('click', handleSubmit);
        elements.shuffleButton.addEventListener('click', handleShuffle);
        elements.hintButton.addEventListener('click', handleHint);
        
        // Game end modal
        elements.saveScoreButton.addEventListener('click', saveScore);
        elements.playAgainButton.addEventListener('click', () => {
            hideModal(elements.gameEndModal);
            initGame();
        });
        
        // Leaderboard
        elements.showLeaderboardButton.addEventListener('click', () => {
            updateLeaderboard();
            showModal(elements.leaderboardModal);
        });
        elements.closeLeaderboardButton.addEventListener('click', () => {
            hideModal(elements.leaderboardModal);
        });
        
        // Instructions
        elements.showInstructionsButton.addEventListener('click', showInstructionsModal);
        elements.closeInstructionsButton.addEventListener('click', () => {
            hideModal(elements.instructionsModal);
        });
        
        // Accessibility
        elements.accessibilitySettings.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAccessibility();
        });
        
        // Key press events
        document.addEventListener('keydown', (e) => {
            // Close modals on Escape
            if (e.key === 'Escape') {
                hideModal(elements.gameEndModal);
                hideModal(elements.leaderboardModal);
                hideModal(elements.instructionsModal);
            }
        });
    }

    // Show instructions modal
    function showInstructionsModal() {
        showModal(elements.instructionsModal);
    }

    // Initialize app
    function init() {
        setupEventListeners();
        loadAccessibilityPreferences();
        initGame();
    }

    // Start the app
    init();
});
