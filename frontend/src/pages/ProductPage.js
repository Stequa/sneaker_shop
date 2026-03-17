import Logo from '../assets/Logo.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


//страница для карточки товара
export default function ProductPage(){
    const { id } = useParams(); 
    const [name, setName] = useState(null);
    const [brand, setBrand] = useState(null);
    const [description, setDesc] = useState(null);
    const [price, setPrice] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null); //Нужно для выбора размера
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/products/${id}`); //получение информации от гет запрроса
          const data = response.data;
          setSizes(data.sizes);
          setName(data.name);
          setBrand(data.brand);
          setDesc(data.description);
          setPrice(data.price);
          setImageUrl(data.image_url);
          setCategory(data.category);
        } catch (error) {
          console.error('Ошибка загрузки товара:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }, [id]); //Зависимость чтобы при каждом измеении id useEfect был вызван заново
    
    const handleSubmit = async (e) => {
      e.preventDefault(); // Всегда предотвращаем стандартную отправку формы
      
      if (selectedSize == null) { //Если размер не выбран
        setSubmitStatus('error');
        alert('Пожалуйста, выберите размер');
        return;
      }
      //данные для отправки
      const data = { 
        product_id: parseInt(id), // Преобразуем строку в число
        size_id: selectedSize.id,
        quantity: 1
      };
      //блок отправки товара в корзину
      try {
        await axios.post('http://localhost:8080/api/cart/add', data);
        setSubmitStatus('success');
        alert('Товар добавлен в корзину!');
      } catch (error) {
        console.error('Ошибка отправки:', error);
        setSubmitStatus('error');
        alert('Ошибка при добавлении товара в корзину');
      }
    }


    if (loading) return <p>Загрузка...</p>;
    if (!name) return <p>Товар не найден</p>;
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
        <form onSubmit={handleSubmit}>
          {/*Отображение информации о продукте*/}
          <div style={{ display: 'flex', 
            flexDirection: 'row', 
            gap: '20px',
            // border:'1px solid',
            // borderRadius:'8px',
            margin:'10px',
            padding:'20px',
            width:'100%'}}>
              <img src={imageUrl} alt={name} style={{ minWidth:'45%', maxWidth: '50%', height: 'auto' }} />
              <div style={{textAlign:'left', gap:'10px', margin:'30px'}}>
                  <h1 style={{width:'100%'}}>{name}</h1>
                  <h2 style={{width:'100%'}}>Цена {price}</h2>
                  <h2>Размеры EU</h2>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px', 
                    marginTop: '12px' }}>
                      {sizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                           onClick={() => setSelectedSize(size)}
                            style={{
                            padding: '8px 16px',
                            backgroundColor: selectedSize?.id === size.id ? '#000' : '#f1f3f5',
                            color: selectedSize?.id === size.id ? 'white' : '#212529',
                            border:'1px solid #000',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: selectedSize?.id === size.id ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                            }}>
                          {size.sizes} 
                        </button>
                        ))}
                  </div>
                  
                  <div><h3>Описание </h3>{description}
                  <p>Мы будем рады ответить на ваши вопросы  
                  <a href='https://t.me/+2fOlBK2rLDk1YzVi'> Telegram</a></p></div>
                  <button  
                  type='submit'
                  style={{
                    padding: '8px 16px',           
                    backgroundColor: '#000',
                    color: 'white',
                    border: '1px solid #000',  
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    margin:'7%'
                  }}>Добавить в корзину</button>
              </div>
          </div>
          </form>  
        </div>);
}
