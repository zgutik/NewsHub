import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsFilters from '../components/ui/NewsFilters';
import NewsCard from '../components/ui/NewsCard';
import CategoryTabs from '../components/ui/CategoryTabs';
import NewsHeader from '../components/layout/NewsHeader';
import NewsList from '../components/features/NewsList';

describe('React Компоненты', () => {
  
  describe('NewsFilters', () => {
    it('вызывает функцию onSearch при вводе текста', async () => {
      const mockOnSearch = jest.fn();
      render(<NewsFilters onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Поиск по тексту...');
      await userEvent.type(input, 'Привет');
      
      expect(mockOnSearch).toHaveBeenCalled();
      expect(mockOnSearch).toHaveBeenCalledWith('Привет');
    });
  });

  describe('NewsCard', () => {
    const mockArticle = {
      id: '1',
      title: 'Тестовая новость',
      text: 'Тестовый текст',
      category: 'Спорт',
      author: 'Иван',
      date: '2026-01-01'
    };

    it('корректно отображает данные новости', () => {
      render(<NewsCard article={mockArticle} onReadMore={() => {}} />);
      
      expect(screen.getByText('Тестовая новость')).toBeInTheDocument();
      expect(screen.getByText('Спорт')).toBeInTheDocument();
      expect(screen.getByText('Иван')).toBeInTheDocument();
    });

    it('вызывает onReadMore при клике на кнопку', async () => {
      const mockOnReadMore = jest.fn();
      render(<NewsCard article={mockArticle} onReadMore={mockOnReadMore} />);
      
      const button = screen.getByRole('button', { name: /Читать далее/i });
      await userEvent.click(button);
      
      expect(mockOnReadMore).toHaveBeenCalledWith('1');
    });
  });

  describe('CategoryTabs', () => {
    it('рендерит кнопку "Все" и переданные категории', () => {
      render(<CategoryTabs categories={['Спорт', 'Дизайн']} onSelect={() => {}} />);
      expect(screen.getByText('Все')).toBeInTheDocument();
      expect(screen.getByText('Спорт')).toBeInTheDocument();
      expect(screen.getByText('Дизайн')).toBeInTheDocument();
    });

    it('вызывает onSelect с правильным аргументом при клике', async () => {
      const mockOnSelect = jest.fn();
      render(<CategoryTabs categories={['Технологии']} onSelect={mockOnSelect} />);
      
      await userEvent.click(screen.getByText('Технологии'));
      expect(mockOnSelect).toHaveBeenCalledWith('Технологии');
    });
  });

  describe('NewsHeader', () => {
    it('корректно рендерит логотип и передает категории во вкладки', () => {
      render(<NewsHeader categories={['Музыка']} onCategoryChange={() => {}} />);
      expect(screen.getByText('NewsHub')).toBeInTheDocument();
      expect(screen.getByText('Музыка')).toBeInTheDocument(); 
    });
  });

  describe('NewsList', () => {
    const mockData = [
      { id: '1', title: 'Первая', text: 'Текст', category: 'Спорт' },
      { id: '2', title: 'Вторая', text: 'Текст', category: 'Технологии' },
    ];

    it('рендерит фильтр и список карточек', () => {
      render(<NewsList data={mockData} onSearch={() => {}} onReadMore={() => {}} />);
      expect(screen.getByPlaceholderText('Поиск по тексту...')).toBeInTheDocument();
      expect(screen.getByText('Первая')).toBeInTheDocument();
      expect(screen.getByText('Вторая')).toBeInTheDocument();
    });
  });

});