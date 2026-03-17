import { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../assets/Logo.png';
import Cartitem from './components/CartItem';
export default function AboutPage(){ //Страница отображения информации о магазине


    return ( //возвращает html
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
  
 {/* Стандартная шапка */}
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
        <div style={{margin: '15px',
            width: '70%', fontSize: '24px'
        }}>
            <h1>О Нас</h1>
            <div style={{margin: '15px'}}>
            Stepan Vaniukov — это авторский ритейл-проект, посвящённый кроссовкам и современной культуре
            обуви. Мы собираем коллекции брендов и моделей, которые разделяют наши взгляды на дизайн, 
            комфорт и качество.
            </div>

            <div style={{margin: '15px'}}>
            Мы не производим обувь сами — наша ценность в тщательном отборе. 
            Каждая пара в ассортименте проходит кураторский выбор: мы обращаем внимание на материалы, 
            посадку, актуальность дизайна и то, как кроссовки ведут себя в повседневной жизни.
            </div>

            <div style={{margin: '15px'}}>
            Наша задача — упростить выбор и предложить кроссовки, за которыми стоит идея, 
            а не просто логотип. Stepan Vaniukov — это пространство для тех, кто ценит стиль, 
            функциональность и осознанный подход к покупке.</div>
        </div>
    </div>
    );
}