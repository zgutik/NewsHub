// js/api/apiService.js
import { CONFIG } from './config.js';

/**
 * Кастомный класс ошибки для обработки в UI
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Универсальный класс NewsAPI
 */
export class NewsAPI {
  constructor(apiConfig = CONFIG) {
    this.baseUrl = apiConfig.BASE_URL;
    this.apiKey = apiConfig.API_KEY;
    this.controllers = new Map(); // Хранилище AbortController для отмены зависших запросов
  }

  /**
   * Вспомогательный метод для формирования URL
   */
  _buildUrl(endpoint) {
    const url = new URL(endpoint, this.baseUrl);
    // Для NewsAPI ключ часто передается через параметры или заголовки
    // url.searchParams.append('apiKey', this.apiKey);
    return url.toString();
  }

  /**
   * Выполнение запроса с поддержкой retry-логики (повтор при 5xx ошибках)
   * с экспоненциальной задержкой.
   */
  async _fetchWithRetry(url, options, maxRetries = 3, baseDelay = 1000) {
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, options);

        // Успешный ответ: возвращаем чистый JSON
        if (response.ok) {
          return await response.json();
        }

        // Логика повтора для серверных ошибок 5xx
        if (response.status >= 500 && response.status < 600) {
          if (attempt < maxRetries) {
            attempt++;
            const delay = baseDelay * Math.pow(2, attempt - 1); // Экспоненциальная задержка
            console.warn(`[NewsAPI] Ошибка сервера ${response.status}. Повторная попытка через ${delay}мс... (Попытка ${attempt} из ${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        // Если не 5xx ошибка или попытки кончились, пытаемся распарсить тело ошибки от API
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        // Выбрасываем кастомную ошибку
        throw new ApiError(
          errorData?.message || `HTTP Ошибка ${response.status}: ${response.statusText}`,
          response.status
        );

      } catch (error) {
        // Если ошибка связана с отменой запроса (AbortError), пробрасываем её сразу без ретраев
        if (error.name === 'AbortError') {
          throw error;
        }

        // Если это наша кастомная ошибка - пробрасываем
        if (error instanceof ApiError) {
          throw error;
        }

        // Обработка сетевых ошибок (например, пропал интернет или CORS) 
        // Если это не последняя попытка, повторяем
        if (attempt < maxRetries) {
          attempt++;
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.warn(`[NewsAPI] Сетевая ошибка (${error.message}). Повторная попытка через ${delay}мс... (Попытка ${attempt} из ${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Выбрасываем общую сетевую ошибку
        throw new ApiError(`Сетевая ошибка при запросе: ${error.message}`, null);
      }
    }
  }

  /**
   * Получение новостей с эндпоинта.
   * @param {string} endpoint - Конечная точка (например, из config.ENDPOINTS)
   * @param {string} requestId - Идентификатор запроса (для отмены предыдущих таких же запросов)
   * @returns {Promise<any>} Чистый объект JSON с ответом API
   */
  async fetchNews(endpoint, requestId = 'default') {
    // Отменяем предыдущий запрос с таким же requestId, если он еще не завершен
    this.cancelRequest(requestId);

    const controller = new AbortController();
    this.controllers.set(requestId, controller);

    const url = this._buildUrl(endpoint);

    const options = {
      signal: controller.signal,
      headers: {
        'X-Api-Key': this.apiKey, // Используется в NewsAPI
        // 'Authorization': `Bearer ${this.apiKey}` // Опционально для других систем (например, Guardian)
      }
    };

    try {
      const data = await this._fetchWithRetry(url, options);
      return data;
    } finally {
      // Удаляем контроллер из map после успешного или неудачного завершения запроса
      this.controllers.delete(requestId);
    }
  }

  /**
   * Отмена зависшего или неактуального запроса по ID
   * @param {string} requestId 
   */
  cancelRequest(requestId = 'default') {
    if (this.controllers.has(requestId)) {
      this.controllers.get(requestId).abort();
      this.controllers.delete(requestId);
      console.log(`[NewsAPI] Предыдущий запрос отменён: ${requestId}`);
    }
  }
}

export const NewsService = new NewsAPI();
