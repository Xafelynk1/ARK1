console.log('scripts.js loaded successfully - TEST');

// Log when handleSignup is called
console.log('handleSignup function defined');

// Log when handleSignin is called
console.log('handleSignin function defined');

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    // Store user data in NeDB
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            window.location.href = '/admin.html';
        }
    });
}

// Handle signin form submission
function handleSignin(event) {
    event.preventDefault();
    const username = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;

    // Verify user credentials
    fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            window.location.href = '/admin.html';
        }
    });
}
