import CategoryTabs from '../ui/CategoryTabs';

export default function NewsHeader({ categories, onCategoryChange }) {
  return (
    <header style={{ background: '#fff', padding: '20px 0', borderBottom: '1px solid #ddd' }}>
      <div className="container">
        <h1 style={{ margin: 0, color: '#333' }}>NewsHub</h1>
        {/* Композиция: передаем пропсы ниже в базовый компонент */}
        <CategoryTabs categories={categories} onSelect={onCategoryChange} />
      </div>
    </header>
  );
}