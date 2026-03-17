import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import Logo from '../assets/Logo.png';

export default function ContactPage (){//Форма для отправки заявок покупателей
    const [loading,  setLoading] = useState(true);
    const [formData, setFormData] = useState({ //Получение информации из полей
      name_contact: '',
      email: '',
      comment: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

    const handleChange=(e)=>{ //Хендлер который изменяет fornData по ключу
        const {name, value}=e.target
        setFormData(prev =>({...prev, [name]:value}));
    };
    const handleSubmit = async (e) => { //Ъендл который срабатывает при отправке запроса
      e.preventDefault(); // отменяет перезагрузку страницы
    
      try {
        await axios.post('http://localhost:8080/api/contact', formData); //отправка на сервер
        setSubmitStatus('success');
        setFormData({ name_contact: '', email: '', comment: '' }); // очистка
      } catch (error) {
        console.error('Ошибка отправки:', error);
        setSubmitStatus('error');
      }
    };



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
      <div style={{ border: '2px solid #212529', margin: '20px', padding: '20px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px'
       }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Форма для обратной связи</h2>
 {/* Отображение при удачной отправке */}
        {submitStatus === 'success' && (
          <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>
             Ваш запрос отправлен!
          </p>
        )}
        {submitStatus === 'error' && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
             Не удалось отправить запрос. Попробуйте позже.
          </p>
        )}

 {/* Сама форма для заполнении информации */}
        <form onSubmit={handleSubmit}>
          <div className="forma" style={{ marginBottom: '15px' }}>
            <label>Ваше имя:</label>
            <input
              type="text"
              name="name_contact"
              value={formData.name_contact}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              required
              
              pattern="[a-zA-Zа-яА-Я\s\-]+"  
            />
          </div>
{/* pattern запрещает вводить цифры в поле имени */}

{/* value определяет к какому значению в setformdata привязывается поле, OnChange 
вызывает хэндлер при изменении информации в поле*/}
          <div className="forma" style={{ marginBottom: '15px' }}>
            <label>Эл. почта:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ced4da',
        borderRadius: '6px',
        fontSize: '1rem',
        backgroundColor: 'white'
      }}
              required
            />
          </div>
          <div className="forma">Запрос:</div>
          <div className="forma" style={{ marginBottom: '15px' }}>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: 'white',
                margin: '10px',
                height: '120px',
                fontFamily: 'inherit',
                border: '1px solid #ccc',

              }}
              required
            />
          </div>

          <div style={{ display: 'flex', width: '90%', margin: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#000',
                color: 'white',
                border: '1px solid #000',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginLeft: 'auto'
              }}
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
