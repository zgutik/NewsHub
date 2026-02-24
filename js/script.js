// Данные для главной новости (Hero)
const HERO_ARTICLE = {
    category: 'Hot Topics',
    title: 'Massa tortor nibh nulla condimentum imperdiet scelerisque...',
    excerpt: 'Nisi, sagittis aliquet sit rutrum. Nunc, id vestibulum quam ornare adipiscing. Pellentesque sed turpis nunc gravida pharetra, sit nec vivamus pharetra...',
    // Используем твою вторую картинку для главного блока
    imageUrl: 'images/Rectangle 3.png' 
};

// Массив для сетки новостей
const LATEST_NEWS = [
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 3.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 4.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 5.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 6.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 7.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 8.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 9.png" },
    { title: "News Title Lorem Ipsum Dolor Sit Amet", time: "1 Hour Ago", source: "CNN Indonesia", img: "images/Rectangle 10.png" }
];

// Функция для отрисовки главного блока
function renderHero() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;
    
    heroSection.innerHTML = `
        <div class="container">
            <div class="hero-card">
                <img src="${HERO_ARTICLE.imageUrl}" class="hero-img" alt="Hero">
                <div class="hero-content">
                    <span class="category-tag">${HERO_ARTICLE.category}</span>
                    <h1>${HERO_ARTICLE.title}</h1>
                    <p>${HERO_ARTICLE.excerpt}</p>
                </div>
            </div>
        </div>
    `;
}

// Функция для отрисовки сетки
function renderGrid() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Очистка перед заполнением
    LATEST_NEWS.forEach(item => {
        grid.innerHTML += `
            <article class="news-card">
                <img src="${item.img}" alt="News">
                <div class="news-content">
                    <h4>${item.title}</h4>
                    <div class="meta">${item.time} • ${item.source}</div>
                </div>
            </article>
        `;
    });
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderGrid();
});