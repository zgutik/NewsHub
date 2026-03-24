
import { getLikes, toggleLikeInStorage } from './utils/storage.js';
import { openModal } from './components/modal.js';
import { initBurgerMenu } from './components/burger.js';

const NEWS_DATA = [
    { 
        id: 1, 
        category: 'Hot Topics', 
        title: 'Прорыв в ИИ: Создана модель, понимающая сарказм', 
        excerpt: 'Новая языковая модель...', 
        imageUrl: 'images/Rectangle2.png',
        fullText: 'Редакция NewsHub получила эксклюзивные данные о новой разработке Лаборатории ИИ. Ученые представили алгоритм, который распознает сарказм и иронию в текстах с точностью 98%. Это фундаментальный шаг к пониманию человеческого общения машинами. Ранее модели спотыкались на контексте, теперь же контекст стал приоритетом. Ожидается, что технология будет интегрирована в службы поддержки клиентов к началу следующего года.'
    },
    { 
        id: 2, 
        category: 'Технологии', 
        title: 'Релиз квантового процессора «Одиссей-256»', 
        excerpt: 'Скорость вычислений выросла...', 
        imageUrl: 'images/Rectangle3.png',
        fullText: 'Компания TechCorp провела презентацию своего второго поколения квантовых процессоров. Сверхпроводящий чип "Одиссей-256", состоящий из 256 кубитов, показал производительность, втрое превышающую результаты прошлогодней модели. Это позволяет решать логистические задачи оптимизации за секунды, вместо часов на классических суперкомпьютерах. Разработчики уже открыли доступ к чипу через облачную платформу.'
    },
    { 
        id: 3, 
        category: 'Спорт', 
        title: 'Итоги Олимпиады 2026: Новые рекорды верстки', 
        excerpt: 'Установлен новый рекорд...', 
        imageUrl: 'images/Rectangle4.png',
        fullText: 'Завершились Международные Игры Верстальщиков-2026. В дисциплине "Семантический марафон" золотую медаль получил Дмитрий Шайбаков (команда NewsHub), продемонстрировавший идеальное использование Schema.org микроразметки на скорость. "Я тренировал accessibility теги каждый день", — прокомментировал Дмитрий свой триумф.'
    },
    { 
        id: 4, 
        category: 'Hot Topics', 
        title: 'Изменения климата: Уровень CSS-болот повысился', 
        excerpt: 'Уровень моря повысился...', 
        imageUrl: 'images/Rectangle5.png',
        fullText: 'Экологический мониторинг веба показывает тревожную тенденцию: старые проекты на флоутах (floats) стремительно тонут в "CSS болотах". Эксперты рекомендуют срочную миграцию на Flexbox и Grid. "Если вы все еще используете float: left для сеток, ваш сайт — климатический беженец из 2010 года", — заявили на конференции W3C.'
    },
    { 
        id: 5, 
        category: 'Технологии', 
        title: 'Новый стандарт HTML6: Конец эры div', 
        excerpt: 'Семантика стала еще лучше...', 
        imageUrl: 'images/Rectangle6.png',
        fullText: 'Спецификация HTML6, представленная сегодня, вводит новые теги: <person>, <product>, <event>, которые заменят универсальный <div> с классами. Поисковики заявляют, что сайты, не использующие новые стандарты, будут понижены в выдаче. NewsHub уже готовит статью с разбором нововведений.'
    }
];

const container = document.getElementById('newsContainer');
const navLinks = document.querySelectorAll('.nav__link');

if (container) {
    container.setAttribute('aria-live', 'polite');
}

function renderNews(data) {
    if (!container) return;
    container.innerHTML = ''; 
    const currentLikes = getLikes();

    data.forEach(item => {
        const isLiked = currentLikes.includes(item.id);
        const card = document.createElement('article');
        card.className = 'news-card'; 
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="news-card__image">
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
        const id = parseInt(e.target.getAttribute('data-id'));
        if (!id) return;

        if (e.target.classList.contains('like-btn')) {
            toggleLikeInStorage(id);
            const currentCategory = document.querySelector('.nav__link--active')?.getAttribute('data-category') || 'all';
            const dataToRender = currentCategory === 'all' ? NEWS_DATA : NEWS_DATA.filter(n => n.category === currentCategory);
            renderNews(dataToRender); 
        }

        if (e.target.classList.contains('open-btn')) {
            const item = NEWS_DATA.find(n => n.id === id);
            openModal(item);
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('nav__link--active'));
        link.classList.add('nav__link--active');

        const category = link.getAttribute('data-category');
        const filtered = category === 'all' 
            ? NEWS_DATA 
            : NEWS_DATA.filter(n => n.category === category);
        renderNews(filtered);
    });
});

function init() {
    renderNews(NEWS_DATA);
    initBurgerMenu();
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
        
        if (textVal.length < 10) {
            formError.textContent = 'Ошибка: Текст новости слишком короткий.';
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