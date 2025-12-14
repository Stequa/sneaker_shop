import { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../assets/Logo.png';
import Cartitem from './components/CartItem';

export default function CartPage (){
    const [element, setElement]=useState([])
    const [total, getTotal]=useState(0)
    const [count, getCount]=useState(0)
    const [loading,  setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/cart')
          .then(response => {
            const data = response.data;
            console.log('Данные корзины:', response.data);
            setElement(data.items || []);
            getTotal(data.totalSum || 0);
            getCount(data.itemCount || 0);
            setLoading(false);
          })
          .catch(error => {
            console.error('Ошибка загрузки корзины:', error);
            setLoading(false);
          });
      }, []);


    if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Загрузка корзины...</p>;
    return(
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
  
  
        <div className="navbar">
          <a href="/">Каталог</a>
          <a href="/cart">Корзина</a>
          <a href="/about">Связаться с нами</a>
          <input
            type="text"
            name="search"
            placeholder="Искать"
            className="poisk"
            autoComplete="off"
          />
        </div>
        {element.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Нет товаров в корзине</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // ← чуть меньше для мобильных
          gap: '20px',
          marginTop: '20px'
        }}>
          {element.map(el => (
            <Cartitem key={el.id} el={el} />
          ))}
        </div>
      )}
      </div>
    );
}