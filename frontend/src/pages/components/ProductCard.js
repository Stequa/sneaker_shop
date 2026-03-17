// ProductCard.js
import { useNavigate } from 'react-router-dom';

//Это отображение карточки продуктов
export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const handleproduct = () => { //адресация на страничку карточки товара
      navigate(`/product/${product.id}`);
    };
{/* отображение элемента продукта */}
    return (
      <div style={{
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minHeight: '200px',
        margin: '10px'
      }}>
        {/* Основная информация */}
        <h3>{product.name}</h3>
        <p><img src={product.image_url} alt="Описание картинки"
         width="100%"
         height="100%"></img></p>
        <p><strong>Бренд:</strong> {product.brand}</p>
        <p><strong>Цена:</strong> ${product.price.toFixed(2)}</p>
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
          onClick={handleproduct} //адресация при нажатии
        >
          Выбрать
        </button>
      </div>
    );
  }