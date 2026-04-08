import { getLikes, toggleLikeInStorage } from './utils/storage.js';
import { openModal } from './components/modal.js';
import { initBurgerMenu } from './components/burger.js';
import { NewsService } from './api/apiService.js';
import { CONFIG } from './api/config.js';
import { storage } from './storage/localStorage.js';

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
    console.log = () => { };
    console.warn = () => { };
    console.info = () => { };
    console.error = () => { };
}

let currentNewsData = [];

const container = document.getElementById('newsContainer');
const navLinks = document.querySelectorAll('.nav__link');

if (container) {
    container.setAttribute('aria-live', 'polite');
}

function renderSkeletons(count = 4) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <article class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-text"></div>
            </article>
        `;
    }
}

function renderNews(data) {
    if (!container) return;
    container.innerHTML = '';
    const currentLikes = getLikes();

    data.forEach(item => {
        const isLiked = currentLikes.includes(String(item.id));
        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="news-card__image" onerror="this.src='images/main-news.jpg'">
            <div class="news-card__content">
                <span class="category-tag">${item.category}</span>
                <h3 class="news-card__title">${item.title}</h3>
                <div class="news-card__footer">
                    <button class="like-btn" data-id="${item.id}" aria-label="${isLiked ? 'Убрать лайк' : 'Поставить лайк'}">
                        ${isLiked ? '❤️' : '🤍'}
                    </button>
                    <button class="read-more-btn open-btn" data-id="${item.id}">Читать</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

if (container) {
    container.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (!id) return;

        if (e.target.classList.contains('like-btn')) {
            toggleLikeInStorage(id);
            renderNews(currentNewsData);
        }

        if (e.target.classList.contains('open-btn')) {
            const item = currentNewsData.find(n => n.id === id);
            openModal(item);
        }
    });
}

async function loadCategoryNews(category) {
    const cacheKey = `news_${category}`;
    const isOffline = !navigator.onLine;

    const cachedData = storage.get(cacheKey, isOffline);

    if (isOffline) {
        showOfflineNotification();
        if (cachedData) {
            currentNewsData = cachedData;
            renderNews(currentNewsData);
        } else {
            if (container) container.innerHTML = `<p style="padding:20px;">Нет закэшированных новостей для данной категории в оффлайне.</p>`;
        }
        return;
    } else {
        hideOfflineNotification();
    }

    if (cachedData) {
        currentNewsData = cachedData;
        renderNews(currentNewsData);
        return;
    }

    if (container) {
        container.innerHTML = `<p class="loading-text">Загрузка свежих новостей...</p>`;
    }

    try {
        const endpoint = CONFIG.ENDPOINTS[category] || CONFIG.ENDPOINTS['all'];
        const response = await NewsService.fetchNews(endpoint, 'fetch_news_req');

        const articles = response.articles || [];
        currentNewsData = articles.map((a, idx) => ({
            id: String((a.url || a.title || 'id').replace(/[^a-zA-Z0-9]/g, '').substring(0, 15) + idx),
            category: category === 'all' ? 'Главная' : category,
            title: a.title || 'Без заголовка',
            excerpt: a.description || 'Нет описания',
            imageUrl: a.urlToImage || 'images/main-news.jpg',
            fullText: a.content || a.description || 'Текст новости отсутствует...'
        }));

        storage.set(cacheKey, currentNewsData);
        renderNews(currentNewsData);
    } catch (err) {
        if (err.name !== 'AbortError') {
            const fallbackData = storage.get(cacheKey, true);

            if (fallbackData) {
                console.warn('[NewsApp] Ошибка API. Отображается резервный устаревший кэш.');
                currentNewsData = fallbackData;
                renderNews(currentNewsData);
                showOfflineNotification('Сервер временно недоступен. Показаны последние загруженные данные.');
            } else if (container) {
                container.innerHTML = `<p style="color:#ff4757; padding:20px;">Ошибка загрузки: ${err.message}</p>`;
            }
        }
    }
}

function showOfflineNotification(customMsg) {
    let banner = document.getElementById('offlineBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offlineBanner';
        banner.style.position = 'fixed';
        banner.style.bottom = '20px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = '#ffc107';
        banner.style.color = '#333';
        banner.style.padding = '10px 20px';
        banner.style.borderRadius = '8px';
        banner.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        banner.style.zIndex = '10000';
        banner.style.fontWeight = 'bold';
        document.body.appendChild(banner);
    }
    banner.textContent = customMsg || 'Вы работаете в оффлайн-режиме. Доступны последние загруженные новости.';
    banner.style.display = 'block';
}

function hideOfflineNotification() {
    const banner = document.getElementById('offlineBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

window.addEventListener('online', () => {
    hideOfflineNotification();
    const activeLink = document.querySelector('.nav__link--active');
    if (activeLink) {
        loadCategoryNews(activeLink.getAttribute('data-category'));
    }
});

window.addEventListener('offline', () => {
    showOfflineNotification();
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove('nav__link--active'));
        link.classList.add('nav__link--active');

        const category = link.getAttribute('data-category');
        loadCategoryNews(category);
    });
});

async function init() {
    initBurgerMenu();
    await loadCategoryNews('all');
}

init();

const suggestForm = document.getElementById('suggestForm');
const formError = document.getElementById('formError');

if (suggestForm) {
    suggestForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleVal = document.getElementById('suggestTitle').value.trim();
        const textVal = document.getElementById('suggestText').value.trim();

        if (titleVal.length < 5) {
            formError.textContent = 'Ошибка: Заголовок должен содержать минимум 5 символов.';
            return;
        }

        if (textVal.length === 0) {
            formError.textContent = 'Ошибка: Текст новости не может быть пустым.';
            return;
        }

        formError.textContent = '';
        formError.style.color = 'green';
        formError.textContent = 'Успех! Новость отправлена на модерацию.';

        setTimeout(() => {
            suggestForm.reset();
            formError.textContent = '';
            formError.style.color = '#ff4757';
        }, 2000);
    });
}