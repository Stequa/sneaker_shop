// ProductCard.js
export default function ProductCard({ product }) {
    return (
      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: '200px',
        margin: '16px'
      }}>
        <h3>{product.name}</h3>
        <p><strong>Бренд:</strong> {product.brand}</p>
        <p>{product.description}</p>
        <p><strong>Цена:</strong> ${product.price}</p>
        <button 
          style={{
            padding: '8px 16px',           
            backgroundColor: '#000',
            color: 'white',
            border: '1px solid #000',  
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => alert('Добавлено в корзину!')}
        >
          В корзину
        </button>
      </div>
    );
  }