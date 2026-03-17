import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage'
import CheckoutPage from './pages/CheckoutPage'
import ProductPage from './pages/ProductPage'
import Congrats from './pages/Congrats'
function App() { //Харегистрированные пути, по котоым обращаются элементы
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path="/congrats" element={<Congrats/>}/>
      </Routes>
    </Router>
  );
}

export default App;