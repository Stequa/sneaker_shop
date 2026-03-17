

import { useState } from 'react';
import axios from 'axios';

//Отображение карточек товаров в корзине
export default function Cartitem({ el,  onQuantityChange}) { //получает товар и функцию обновления
  const [submitStatus, setSubmitStatus] = useState(null); //Нужен для хранения статуса последней операции
  const [quantity, setQuantity]=useState(0) //количество
//Обновление количества товара +1
  const addCart = async (delta) => { 
    try{
      await axios.post('http://localhost:8080/api/cart/add', { product_id: el.product_id,  
        //загрузка измененные данные
        size_id: el.size_id, 
        quantity: delta}) //получает через аргумент
        onQuantityChange(); 
//delete(url, config)

    } catch (error) {
      console.error('Ошибка отправки:', error);
      setSubmitStatus('error');
    }
  };


  const minCart = async (delta) => { //Обновление количества товара -1 на сервере
    try{
      // axios.delete принимает тело во втором аргументе через поле data
      await axios.delete('http://localhost:8080/api/cart/remove', {
        data: {
          product_id: el.product_id,
          size_id: el.size_id,
          quantity: delta,
        },//delete(url, config)
      });
      onQuantityChange(); //обновляем
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setSubmitStatus('error');
    }
  };


  const handleAdd = () => { //Увеличение количества
    setQuantity((prev) => prev + 1)
    addCart(1);
  }

  const handleRemove = () => { //уменьшение количества
    if (el.quantity <= 1) return;
    setQuantity((prev) => prev - 1);
    minCart(1);
  }

  const handleDel = async () => {//Для удаления товара из корзины
    try {
      await axios.delete(`http://localhost:8080/api/cart/remove`, {
        data: {
          product_id: el.product_id,
          size_id: el.size_id,
        },
      });
      window.location.reload(); 
      // CartPage должен обновить список
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

    return (
      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: '150px',
        margin: '5px',
        width : "100%"
      }}>
        {submitStatus === 'error' && (
          <p style={{ color: 'red' }}>Ошибка: не удалось обновить товар</p>
        )}
        <h3>{el.product_name} Размер {el.size}</h3>
        <div><strong>Количество:</strong> 
        <span style={{ margin: '0 10px' }}>{el.quantity/*el.quantity*/}</span>
          <button type="button" style={{
            padding: '6px 10px',           
            backgroundColor: '#000',
            color: 'white',
            border: '1px solid #000',  
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            margin: '2px'
          }} onClick={handleRemove}>-</button>
          <button type="button" style={{
            padding: '6px 10px',           
            backgroundColor: '#000',
            color: 'white',
            border: '1px solid #000',  
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            margin: '2px'
          }} onClick={handleAdd}>+</button>
          <button type="button" style={{
            padding: '6px 10px',           
            backgroundColor: '#000',
            color: 'white',
            border: '1px solid #000',  
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            margin: '10px'
          }} onClick={handleDel}>Удалить</button>
        </div>
        <p><strong>Цена:</strong> ${el.total.toFixed(2)}</p>
      </div>
    );
  }