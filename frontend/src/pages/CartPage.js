import { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../assets/Logo.png';
import Cartitem from './components/CartItem';
import { useNavigate } from 'react-router-dom';

//Форма корзины покупателя, обрабатывает get запрос, посылает post запрос на сервер
export default function CartPage (){
    const [element, setElement]=useState([])
    const [total, getTotal]=useState(null)
    const [count, getCount]=useState(null)
    const [loading,  setLoading] = useState(true);
    const navigate = useNavigate();//Функция навигации
    const handleCheckout = () => {
      navigate('/checkout'); // переходим на страницу оформления
    };

    //хук для получения информации о корзине get запрос
    useEffect(() => {
        axios.get('http://localhost:8080/api/cart')
          .then(response => {
            const data = response.data; //получение информации из ответа, кладем в переменную
            console.log('Данные корзины:', response.data); //лог для консоли
            setElement(data.items || []);  //устанавливаем значения
            getTotal(data.total_sum || 0);
            getCount(data.item_count || 0);
            setLoading(false);
          })
          .catch(error => { //ловим ошибки
            console.error('Ошибка загрузки корзины:', error);
            setLoading(false);
          });
      }, []);

      const refreshCart = async () => { //функция для обновления корзины, написана асинфхронной, 
      // чтобы показать разницу с .then при работе с промисами
      //эта функция используется при изменении количества продукта в самой корзине
        const res = await axios.get('http://localhost:8080/api/cart');
        setElement(res.data.items);
        getTotal(res.data.total_sum);
        getCount(res.data.item_count);
      };
    if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Загрузка корзины...</p>;
    return(
        <div style={{ padding: '2rem', margin: '0 auto', width: '100%'}}>
      
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
        {/* Основная форма корзины */}
        <h1 style={{textAlign: 'left', marginBottom: '20px'}}>Корзина</h1>
        <h2>Сумма: {total.toFixed(2)} Количество {count}</h2>
        {element.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Нет товаров в корзине</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px',
          marginTop: '20px'
        }}>
          {element.map(el => ( //Отобрадение карточки cartitem, 
          // передаем также функцию обновления как аргумент
            <Cartitem key={el.id} el={el}  onQuantityChange={refreshCart} />
          ))}
          <div><button 
          style={{
            padding: '8px 16px',           
            backgroundColor: '#000',
            color: 'white',
            border: '1px solid #000',  
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '20%'
          }}
          onClick={handleCheckout}
        >
          Оформить заказ
        </button></div>
        </div>
        
      )}
      </div>
    );
}