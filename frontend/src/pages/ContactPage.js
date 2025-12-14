import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import Logo from '../assets/Logo.png';

export default function ContactPage (){
    const [loading,  setLoading] = useState(true);




    return (
        <div style={{ padding: '2rem', margin: '0 auto', width: '100%' }}>
      
      {/* Логотип — масштабируется пропорционально */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img 
          src={Logo} 
          alt="Логотип магазина" 
          style={{ 
            height: '5%',        
            maxHeight: '80px',    // ← но не больше 80px
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
    
      <div style={{ border: '2px solid #212529', margin: '20px', padding: '20px' }}>
  <div className="forma">
    <h2>Форма для обратной связи</h2>
  </div>
  <div className="forma">
    <label>Ваше имя:</label>
    <input type="text" name="name" style={{ margin: '10px', width: '30%' }} />
  </div>
  <div className="forma">
    <label>Эл. почта:</label>
    <input type="email" name="email" style={{ margin: '10px', width: '30%', 
        border: '1px solid #495057'
    }} />
  </div>
  <label style={{ margin: '20px' }}>Запрос:</label>
  <div className="forma">
    <textarea
      name="message"
      style={{
        margin: '10px',
        width: '90%',
        height: '120px',
        padding: '10px',
        fontSize: '16px',
        fontFamily: 'inherit',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
    />
  </div>
  
  {/* Контейнер для кнопки с той же шириной, что и textarea */}
  <div style={{ 
    display: 'flex',
    width: '90%',  // Та же ширина, что и у textarea (90%)
    margin: '10px' // Та же маржа, что и у textarea
  }}>
    <button 
      style={{
        padding: '8px 16px',
        backgroundColor: '#000',
        color: 'white',
        border: '1px solid #000',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginLeft: 'auto',
        width: '20%'  // Можно оставить или убрать, если хотите авто-ширину
      }}
      onClick={() => alert('Ваш запрос отправлен')}
    >
      Отправить
    </button>
  </div>
</div>
    </div>
    );
}
