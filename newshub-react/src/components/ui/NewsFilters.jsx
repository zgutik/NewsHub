export default function NewsFilters({ onSearch }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input 
        type="text" 
        placeholder="Поиск по тексту..." 
        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
        onChange={(e) => onSearch(e.target.value)} 
      />
    </div>
  );
}