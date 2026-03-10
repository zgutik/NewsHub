// Данные для главной новости
const HERO_ARTICLE = {
    category: 'Hot Topics',
    title: 'Massa tortor nibh nulla condimentum imperdiet scelerisque...',
    excerpt: 'Nisi, sagittis aliquet sit rutrum. Nunc, id vestibulum quam ornare adipiscing. Pellentesque sed turpis nunc gravida pharetra, sit nec vivamus pharetra...',
    imageUrl: 'images/Rectangle3.png' 
};

// Сетка новостей
const LATEST_NEWS = [
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle3.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle4.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle5.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle6.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle7.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle8.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle9.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle10.png" }
];

function renderHero() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;
    heroSection.innerHTML = `<div class="container"><div class="hero-card"><img src="${HERO_ARTICLE.imageUrl}" class="hero-img" alt="Hero"><div class="hero-content"><span class="category-tag">${HERO_ARTICLE.category}</span><h1>${HERO_ARTICLE.title}</h1><p>${HERO_ARTICLE.excerpt}</p></div></div></div>`;
}

function renderGrid() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    grid.innerHTML = LATEST_NEWS.map(item => `<article class="news-card"><img src="${item.img}" alt="News"><div class="news-content"><h4>${item.title}</h4><div class="meta">${item.time} • ${item.source}</div></div></article>`).join('');
}

// ВСЯ логика запускается ОДИН РАЗ здесь
document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderGrid();

    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.main-nav__list');

    if (menuToggle && navList) {
        menuToggle.onclick = function() {
            navList.classList.toggle('main-nav__list--active');
            console.log("Меню переключено!"); // Открой консоль (F12), чтобы проверить
        };
    } else {
        console.error("Кнопка или список не найдены! Проверь ID в HTML.");
    }
});