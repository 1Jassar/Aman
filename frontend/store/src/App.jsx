import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import ShopPage from './components/ShopPage'
import ProductPage from './components/ProductPage'
import CheckoutPage from './components/CheckoutPage'
import ThankYouPage from './components/ThankYouPage'
import './App.css'

function App() {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '8384074216807521643332',
    cvv: '592',
    expiry: '2/28'
  })

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route 
            path="/checkout" 
            element={<CheckoutPage cardInfo={cardInfo} setCardInfo={setCardInfo} />} 
          />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

