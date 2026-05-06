import NewsCard from '../ui/NewsCard';
import NewsFilters from '../ui/NewsFilters';

export default function NewsList({ data, onSearch, onReadMore }) {
  return (
    <section>
      <NewsFilters onSearch={onSearch} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {data.map((article) => (
          <NewsCard 
            key={article.id} 
            article={article} 
            onReadMore={onReadMore} 
          />
        ))}
      </div>
    </section>
  );
}