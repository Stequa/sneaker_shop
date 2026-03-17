import Logo from '../assets/Logo.png';
export default function Congrats(){ // Форма для отображения созданного заказа
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
        <div style={{textAlign:'center', margin:'15%', fontSize: '1.8rem'}}>✅Заказ оформлен✅</div>
    </div>
    
    );
}