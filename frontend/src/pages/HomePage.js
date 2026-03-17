// HomePage.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import Logo from '../assets/Logo.png';
//Начальная страница приложения открывается по пути /
export default function HomePage() {
  const [products, setProducts] = useState([]); //хук для массива продуктов тип Product
  const [loading, setLoading] = useState(false); //хук для отображения загрузки

  useEffect(() => { //хук для получения информации из get запроса
    axios.get('http://localhost:8080/api/products')
      .then(response => { //благодаря .then можно не писать async
        setProducts(response.data); //формируем массив
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
        setLoading(false);
      });
  }, []);
//если значение loading не изменилось, то отображаем это
  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Загрузка кроссовок...</p>;

  return (
    <div style={{ padding: '2rem', margin: '0 auto', width: '100%' }}>
      
      {/* Логотип — масштабируется пропорционально */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img 
          src={Logo} 
          alt="Логотип магазина" 
          style={{ 
            height: '5%',        
            maxHeight: '80px',   
            objectFit: 'contain'
          }} 
        />
      </div>

{/* шапка приложения с основными ссылками на другие страницы*/}
      <div className="navbar">
        <a href="/">Каталог</a>
        <a href="/cart">Корзина</a>
        <a href="/contact">Связаться с нами</a>
        <a href="/about">О Нас</a>
        <input
          type="text"
          name="search"
          placeholder="Искать"
          className="poisk"
          autoComplete="off"
        />
      </div>
      
      {/* Плитка товаров — адаптивная сетка */}
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Нет товаров в наличии.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', //  чуть меньше для мобильных
          gap: '20px',
          marginTop: '20px'
        }}>
          {products.map(product => ( 
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
