document.getElementById('quiz-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    try {
        const response = await fetch('/quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, answer }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error processing quiz:', error);
        alert('An error occurred while processing the quiz.');
    }
});
