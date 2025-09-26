// script.js
const container = document.getElementById('reviewsContainer');
const modal = document.getElementById('reviewModal');
const closeModal = document.getElementById('closeModal');
const modalName = document.getElementById('modalName');
const modalText = document.getElementById('modalText');

// Pause on click and open modal
container.addEventListener('click', (event) => {
    const card = event.target.closest('.review-card');
    if (card) {
        container.classList.add('paused');
        modalName.textContent = card.querySelector('.review-name').textContent;
        modalText.textContent = card.dataset.fullText;
        modal.style.display = 'flex';
    }
});

// Close modal and resume animation
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    container.classList.remove('paused');
});

// Close modal on outside click
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        container.classList.remove('paused');
    }
});

// Reset animation for infinite loop
container.addEventListener('animationiteration', () => {
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    container.style.animation = 'slide 60s linear infinite';
});