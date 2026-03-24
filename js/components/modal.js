

const modal = document.getElementById('newsModal');
const closeModalBtn = document.querySelector('.close-modal');

export const openModal = (item) => {
    if (!modal || !item) return;

    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalImage').src = item.imageUrl;
    document.getElementById('modalImage').alt = item.title;
    
    document.getElementById('modalDescription').textContent = item.fullText;
    modal.style.display = 'block';
};

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});