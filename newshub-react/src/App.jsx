import NewsHeader from './components/layout/NewsHeader';
import NewsList from './components/features/NewsList';
import { MOCK_NEWS } from './data/mockData';

export default function App() {
 
  const categories = [...new Set(MOCK_NEWS.map(item => item.category))];

  
  const handleCategoryChange = (category) => {
    alert(`Заглушка: Выбрана категория "${category}". В будущем здесь будет фильтрация.`);
  };

  const handleSearch = (query) => {
    console.log(`Заглушка: Пользователь ищет "${query}". В будущем список будет фильтроваться.`);
  };

  const handleReadMore = (id) => {
    alert(`Заглушка: Открытие полной статьи с ID: ${id}`);
  };


  return (
    <div>
      <NewsHeader 
        categories={categories} 
        onCategoryChange={handleCategoryChange} 
      />
      <main className="container" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Лента новостей</h2>
        <NewsList 
          data={MOCK_NEWS} 
          onSearch={handleSearch} 
          onReadMore={handleReadMore} 
        />
      </main>
    </div>
  );
}