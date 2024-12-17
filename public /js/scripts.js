// Ensure DOM is fully loaded before executing
document.addEventListener('DOMContentLoaded', () => {
  const walletBalanceDisplay = document.querySelector('.balance-display');
  const liveFeedContainer = document.querySelector('.live-feed-container');
  const posterContainer = document.querySelector('.poster-slider');
  
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

  // Initialize Data
  fetchWalletBalance();
  fetchLiveFeed();
  fetchPosters();
});