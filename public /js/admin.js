// admin.js

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    loadNotifications();
    loadActivityLogs();
    document.getElementById('quizForm').addEventListener('submit', postQuiz);
    document.getElementById('blogPostForm').addEventListener('submit', postBlog);
    document.getElementById('withdrawBtn').addEventListener('click', withdrawFunds);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});

// Load dashboard data
function loadDashboardData() {
    fetch('/api/dashboard')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalUsers').innerText = data.totalUsers;
            document.getElementById('activeQuizzes').innerText = data.activeQuizzes;
            document.getElementById('totalPosts').innerText = data.totalPosts;
            document.getElementById('revenue').innerText = `₦${data.revenue.toFixed(2)}`;
            document.getElementById('todaysSignups').innerText = data.todaysSignups;
            document.getElementById('activeUsers').innerText = data.activeUsers;
            document.getElementById('mostPurchasedContent').innerText = data.mostPurchasedContent;
        })
        .catch(error => showError('Error loading dashboard data:', error));
}

// Load live notifications
function loadNotifications() {
    const socket = new WebSocket('wss://your-websocket-url');

    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        displayNotification(notification);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };
}

// Display notification
function displayNotification(notification) {
    const notificationArea = document.getElementById('notifications-items');
    const newNotification = document.createElement('li');
    newNotification.textContent = notification.message;
    notificationArea.appendChild(newNotification);
}

// Load activity logs
function loadActivityLogs() {
    fetch('/api/activity-logs')
        .then(response => response.json())
        .then(data => {
            const activityList = document.getElementById('activity-items');
            activityList.innerHTML = ''; // Clear existing logs
            data.forEach(log => {
                const logItem = document.createElement('li');
                logItem.textContent = log.message;
                activityList.appendChild(logItem);
            });
        })
        .catch(error => showError('Error loading activity logs:', error));
}

// Post a new quiz
function postQuiz(event) {
    event.preventDefault();
    const question = document.getElementById('quiz-question').value;
    const answer = document.getElementById('quiz-answer').value;
    const timer = document.getElementById('quiz-timer').value;

    fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, timer }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Quiz posted successfully!');
        loadDashboardData(); // Refresh dashboard data
    })
    .catch(error => showError('Error posting quiz:', error));
}

// Post a new blog
function postBlog(event) {
    event.preventDefault();
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    const publishDate = document.getElementById('publish-date').value;

    fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, publishDate }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Blog posted successfully!');
        loadDashboardData(); // Refresh dashboard data
    })
    .catch(error => showError('Error posting blog:', error));
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Withdraw funds
function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const balance = parseFloat(document.getElementById('balance').innerText.replace(/₦/, ''));

    if (isNaN (amount) || amount <= 0) {
        alert('Enter a valid withdrawal amount.');
        return;
    }
    if (amount > balance) {
        alert('Insufficient balance.');
        return;
    }

    fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Withdrawal successful!');
        loadDashboardData(); // Refresh balance
    })
    .catch(error => showError('Error withdrawing funds:', error));
}

// Show error messages
function showError(message, error) {
    console.error(message, error);
    alert(message);
}