export default function NewsCard({ article, onReadMore }) {
  return (
    <article style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '0.8rem' }}>{article.category}</div>
      <h3 style={{ margin: '10px 0' }}>{article.title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#555' }}>{article.text}</p>
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '15px' }}>
        <span>{article.author}</span> • <time>{article.date}</time>
      </div>
      <button 
        style={{ padding: '8px 16px', cursor: 'pointer', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px' }} 
        onClick={() => onReadMore(article.id)}
      >
        Читать далее
      </button>
    </article>
  );
}