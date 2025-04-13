function checkAnswer(button, isCorrect) {
    if (isCorrect) {
        button.classList.add('bg-success', 'text-white');
    } else {
        button.classList.add('bg-danger', 'text-white');
    }
    // Disable all buttons after selection
    const buttons = document.querySelectorAll('.list-group-item');
    buttons.forEach(btn => btn.disabled = true);
}
