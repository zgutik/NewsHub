import { formatDate, truncateText } from '../utils/stringUtils';

describe('Утилиты для строк и дат', () => {
  describe('formatDate', () => {
    it('корректно форматирует правильную дату', () => {
      expect(formatDate('2026-02-24')).toBe('24 февраля 2026 г.');
    });

    it('возвращает ошибку для невалидной даты', () => {
      expect(formatDate('invalid-date')).toBe('Неверная дата');
    });

    it('возвращает пустую строку при пустом аргументе', () => {
      expect(formatDate('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('обрезает длинный текст и добавляет троеточие', () => {
      expect(truncateText('Очень длинная новость', 10)).toBe('Очень длин...');
    });

    it('не меняет короткий текст', () => {
      expect(truncateText('Новость', 50)).toBe('Новость');
    });
  });
});