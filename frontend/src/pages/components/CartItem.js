export default function Cartitem({ el}) {
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
        <h3>{el.product_name}</h3>
        <p><strong>Цена:</strong> ${el.total}</p>
      </div>
    );
  }