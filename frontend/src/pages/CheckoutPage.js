import Logo from '../assets/Logo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//функция для отображения формы оформления заказа
export default function CheckoutPage(){
    const [products, setProducts]=useState([]) 
    const [total, setTotal]=useState(0)
    const [count, setCount]=useState(0)
    const navigate = useNavigate();//Функция навигации
    const [formData, setFormData] = useState({ //формирование данных из заполненныхьполей
        name: '',
        phone: '',
        email: '',
        address: '',
        payment: '' // для способа оплаты
      });
    const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

    const handleChange= (e)=>{ //при изменении поля вызывается этот хендлер
        const{name, value}=e.target
        setFormData(perv=>({...perv, [name]:value}))
    }
      const handleSubmit = async (e) => { //при нажатии кнопки оформить
        e.preventDefault();
        // Формируем данные для отправки
        const orderData = { //формируем данные для отправки на сервер
          user_id: 1,
          user_name: formData.name_contact,
          email: formData.email,
          phone: formData.phone,
          shipping_address: formData.addres,
          status: 'В обработке',
          payment: formData.payment,
          items: products.map(item => ({ //продукты CartItemResponce, но должен стоть OrderItem, поэтому
            //выделяются поля, которые должны быть отпралены, а не вся информация о пролукте
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price_per_unit: item.price
          }))
        };
      
        try { //отправка данных о заказе
          await axios.post('http://localhost:8080/api/orders', orderData);
          setSubmitStatus('success');
          setFormData({ name: '', phone: '', email: '', addres: '', payment: '' });
          handlecongrats(); //переход на новую  страницу
        } catch (error) {
          console.error('Ошибка отправки:', error);
          setSubmitStatus('error');
        }
      };
    const handlecongrats = ()=>{navigate('/congrats')} //адресация на новую страницу
    useEffect(()=>{
        axios.get('http://localhost:8080/api/cart').then(response=>{ //получение данных о продуктах в корзине
            const data=response.data
            console.log('Данные корзины:', response.data); //лог для консоли
            setProducts(data.items)
            setTotal(data.total_sum)
            setCount(data.items_count)
        })
        .catch(error => {
            console.error('Ошибка загрузки корзины:', error);
          });
      }, []);

    return (<div style={{ padding: '2rem', margin: '0 auto', width: '100%' }}>
      
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
        <div style={{
            border: '2px solid #212529',
            borderRadius: '12px',
            padding: '2rem',
            margin: '2rem auto',
            maxWidth: '600px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                color: '#212529',
                fontSize: '1.8rem'
                }}>
                Оформление заказа
                </h1>
            <form onSubmit={handleSubmit}>
            {/* Поле ввода — общий стиль */}
            <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                     ФИО
                </label>
                <input
                type="text"
                name="name"
                value={formData.name} // привязка значения
                onChange={handleChange} //обработчик
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

            <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Телефон
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone} // привязка значения
                    onChange={handleChange} //обработчик
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

            <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Email
                </label>
            <input
      type="email"
      name="email"
      value={formData.email} // привязка значения
      onChange={handleChange} //обработчик
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

  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
      Адрес доставки
    </label>
    <input
      type="text"
      name="addres"
      value={formData.addres} // привязка значения
      onChange={handleChange} //обработчик
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

  {/* Способы оплаты */}
  <fieldset style={{
    border: '1px solid #ced4da',
    borderRadius: '8px',
    padding: '1rem',
    marginTop: '1.5rem'
  }}>
    <legend style={{
      fontWeight: '600',
      color: '#212529',
      fontSize: '1.1rem',
      padding: '0 0.5rem'
    }}>
      Способ оплаты
    </legend>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[
        { id: 'cash', label: 'Наличными при получении' },
        { id: 'online', label: 'Оплата онлайн' },
        { id: 'sbp', label: 'СБП' }
      ].map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
             type="radio"
             id={item.id}
             name="payment"
             value={item.id}
             checked={formData.payment === item.id}
             onChange={handleChange}
            style={{ transform: 'scale(1.2)' }}
            required
          />
          <label htmlFor={item.id} style={{ margin: 0 }}>{item.label}</label>
        </div>
      ))}
    </div>
  </fieldset>
  <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr', // чуть меньше для мобильных
          gap: '20px',
          marginTop: '20px'
        }}>
          {products.map(el => (
            <div key={el.id}>{el.product_name} Размер {el.size} Кол {el.quantity} Стоимость {el.total}</div>
          ))}
  </div>
  <h2 style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                color: '#212529',
                fontSize: '1.5rem'
                }}>
                Стоимость: {total.toFixed(2)}
                </h2>

  {/* Кнопка */}
  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <button
      type="submit"
      style={{
        padding: '0.85rem 2rem',
        backgroundColor: '#000',
        color: 'white',
        border: '1px solid #000',
        borderRadius: '6px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
      }}

      onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'} //анимация для кнопки
      onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
    >
      Создать заказ
    </button>
  </div>
  </form>
</div>
        </div>);
}