// Ensure DOM is fully loaded before executing
document.addEventListener('DOMContentLoaded', () => {
  const walletBalanceDisplay = document.querySelector('.balance-display');
  const liveFeedContainer = document.querySelector('.live-feed-container');
  const posterContainer = document.querySelector('.poster-slider');
  const chatDisplay = document.getElementById('chat-display');
  const chatInput = document.getElementById('chat-input');
  
  // Fetch Wallet Balance
  async function fetchWalletBalance() {
    try {
      const response = await fetch('/api/wallet/balance');
      const data = await response.json();
      walletBalanceDisplay.textContent = `₦${data.balance.toFixed(2)}`;
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  }

  // Fetch Live Feed
  async function fetchLiveFeed() {
    try {
      const response = await fetch('/api/live-feed');
      const data = await response.json();
      liveFeedContainer.innerHTML = '';
      data.forEach((feed) => {
        const feedItem = `
          <div class="live-feed-item">
            <h3>${feed.title}</h3>
            <p>${feed.description}</p>
            <span class="feed-time">${feed.time}</span>
          </div>`;
        liveFeedContainer.innerHTML += feedItem;
      });
    } catch (err) {
      console.error('Error fetching live feed:', err);
    }
  }

  // Fetch Posters (eBooks)
  async function fetchPosters() {
    try {
      const response = await fetch('/api/posters');
      const data = await response.json();
      posterContainer.innerHTML = '';
      data.forEach((poster) => {
        const posterItem = `
          <div class="poster">
            <img src="${poster.image}" alt="${poster.title}">
            <h4 class="poster-title">${poster.title}</h4>
            <p class="poster-price">₦${poster.price.toFixed(2)}</p>
            <button class="purchase-btn" data-id="${poster.id}">Buy Now</button>
          </div>`;
        posterContainer.innerHTML += posterItem;
      });
      attachPurchaseEvents();
    } catch (err) {
      console.error('Error fetching posters:', err);
    }
  }

  // Attach Purchase Button Events
  function attachPurchaseEvents() {
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    purchaseButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const posterId = e.target.dataset.id;
        purchasePoster(posterId);
      });
    });
  }

  // Purchase Poster
  async function purchasePoster(posterId) {
    try {
      const response = await fetch(`/api/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posterId }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Purchase successful!');
        fetchWalletBalance(); // Update wallet balance
      } else {
        alert(`Purchase failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Error processing purchase:', err);
    }
  }

  // Fund Wallet
  document.querySelector('.fund-btn').addEventListener('click', async () => {
    try {
      const amount = prompt('Enter amount to fund:');
      if (!amount) return;

      const response = await fetch('/api/wallet/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Wallet funded successfully!');
        fetchWalletBalance(); // Update wallet balance
      } else {
        alert(`Funding failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Error funding wallet:', err);
    }
  });

  // Withdraw Funds
  document.querySelector('.withdraw-btn').addEventListener('click', async () => {
    try {
      const amount = prompt('Enter amount to withdraw:');
      if (!amount) return;

      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Withdrawal successful!');
        fetchWalletBalance(); // Update wallet balance
      } else {
        alert(`Withdrawal failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Error withdrawing funds:', err);
    }
  });

  // Socket for chat messages
  const socket = io();

  // Handle chat message sending
  function sendMessage(event) {
    if (event.key === 'Enter') {
      const message = chatInput.value;
      if (message.trim() !== '') {
        socket.emit('chat-message', message);
        chatInput.value = ''; // Clear input
      }
    }
  }

  // Listen for incoming chat messages
  socket.on('chat-message', (message) => {
    const newMessage = document.createElement('div');
    newMessage.innerText = message;
    chatDisplay.appendChild(newMessage);
  });

  // Initialize Data
  fetchWalletBalance();
  fetchLiveFeed();
  fetchPosters();

  // Quiz Logic Integration

  let quizStarted = false;
  let currentQuestionIndex = 0;
  const questions = [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is 3 + 5?", answer: "8" },
    // Add more questions as needed
  ];

  let timerInterval;

  function startQuiz() {
    if (!quizStarted) {
      quizStarted = true;
      socket.emit('start-quiz');
      displayQuestion();
      startTimer();
    }
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('current-question').innerText = `Question ${currentQuestionIndex + 1}: ${question.question}`;
    document.getElementById('timer-countdown').innerText = "30";  // Reset timer
  }

  function nextQuestion() {
    if (quizStarted && currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
      resetTimer();
    }
  }

  function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById('current-question').innerText = "Quiz Ended!";
    document.getElementById('timer-countdown').innerText = "0";  // Stop timer
    socket.emit('end-quiz');
  }

  function startTimer() {
    let timeLeft = 30;
    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timer-countdown').innerText = timeLeft;
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        nextQuestion();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
  }

  // Socket event listeners for quiz actions
  socket.on('quiz-started', () => {
    startQuiz();
  });

  socket.on('quiz-ended', () => {
    endQuiz();
  });

  // Chat Input Event Listener
  chatInput.addEventListener('keypress', sendMessage);

}); 