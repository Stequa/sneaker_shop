import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // ← БЕЗ фигурных скобок!
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;