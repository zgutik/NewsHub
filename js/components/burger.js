

const burgerBtn = document.querySelector('.burger-menu');
const mainNav = document.getElementById('mainNav');

export const initBurgerMenu = () => {
    if (!burgerBtn || !mainNav) return;

    burgerBtn.addEventListener('click', () => {
        const isOpen = burgerBtn.getAttribute('aria-expanded') === 'true';

        burgerBtn.setAttribute('aria-expanded', !isOpen);
        burgerBtn.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');

        burgerBtn.classList.toggle('burger-menu--open');
        mainNav.classList.toggle('nav--open');
    });

    
    mainNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav__link') && mainNav.classList.contains('nav--open')) {
            burgerBtn.setAttribute('aria-expanded', 'false');
            burgerBtn.classList.remove('burger-menu--open');
            mainNav.classList.remove('nav--open');
        }
    });
};