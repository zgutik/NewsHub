export default function CategoryTabs({ categories, onSelect }) {
  return (
    <nav style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button style={{ cursor: 'pointer', padding: '5px 10px' }} onClick={() => onSelect('Все')}>Все</button>
      {categories.map((cat) => (
        <button 
          key={cat} 
          style={{ cursor: 'pointer', padding: '5px 10px' }} 
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}