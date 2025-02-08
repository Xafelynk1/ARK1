// app.js
document.addEventListener('DOMContentLoaded', () => {
    const countdownTimer = document.getElementById('countdown-timer');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    let timer;

    function startTimer(duration) {
        let time = duration;
        timer = setInterval(() => {
            countdownTimer.textContent = time;
            if (time <= 0) {
                clearInterval(timer);
                userInput.disabled = true;
                sendButton.disabled = true;
                countdownTimer.textContent = "Time's up!";
            }
            time--;
        }, 1000);
    }

    function enableInput() {
        userInput.disabled = false;
        sendButton.disabled = false;
    }

    // Example of starting the timer and enabling input
    startTimer(30);
    enableInput();
});
