
const env = typeof process !== 'undefined' ? process.env : {};

export const MANUAL_API_KEY = 'd2337ec937a846398f1840b4f3339942';

export const CONFIG = {
  
  API_KEY: env.API_KEY || MANUAL_API_KEY,
  BASE_URL: env.BASE_URL || 'https://newsapi.org/v2/',

  
  ENDPOINTS: {
    'all': 'top-headlines?country=us',
    'Hot Topics': 'top-headlines?language=en&q=hot',
    'Технологии': 'top-headlines?country=ru&category=technology',
    'Спорт': 'top-headlines?country=ru&category=sports'
  }
};
