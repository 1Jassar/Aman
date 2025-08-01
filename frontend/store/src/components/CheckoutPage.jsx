import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Phone, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CheckoutPage = ({ cardInfo, setCardInfo }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [deliveryOptions, setDeliveryOptions] = useState({
    leaveAtDoor: true,
    someoneElse: false
  })
  // Add state for error message
  const [errorMessage, setErrorMessage] = useState('')
  
  // Get product information from location state or use default values
  const product = location.state?.product || {
    name: 'iPhone 16 128GB Black',
    price: '3,199',
    quantity: 1
  }

  // Reset card info when component mounts
  useEffect(() => { // Changed from useState to useEffect for side effects
    setCardInfo({
      cardNumber: '',
      cvv: '',
      expiry: ''
    })
  }, []) // Empty dependency array ensures this runs only on mount

  const handlePlaceOrder = async () => {
    setErrorMessage('')

    // Validate card number - updated to match backend
    const correctCardNumber = '8384 0742 1680 7521 6433'
    if (cardInfo.cardNumber !== correctCardNumber) {
      setErrorMessage('Sorry your card info is wrong, please try again')
      return
    }
    
    // More strict validation
    if (!cardInfo.cardNumber || cardInfo.cardNumber.length < 16) {
      setErrorMessage('Card number is incomplete or invalid.')
      return
    }

    if (!cardInfo.cvv || cardInfo.cvv.length !== 3) {
      setErrorMessage('CVV must be 3 digits.')
      return
    }

    if (!cardInfo.expiry || !cardInfo.expiry.match(/^\d{2}\/\d{2}$/)) { // Changed regex to ensure MM/YY format
      setErrorMessage('Expiry date must be in MM/YY format.')
      return
    }

    try {
      // Create an object that includes both card info and product info
      const requestData = {
        ...cardInfo,
        productName: product.name,
        productPrice: parseFloat(product.price.replace(/,/g, '')) // Convert price string to number
      };

      const response = await fetch('http://localhost:5000/api/card/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData) // Send both card info and product info to backend
      })
      
      const data = await response.json() // Always parse JSON to get the message

      if (!response.ok) { // Check for HTTP errors (e.g., 400 from backend)
        setErrorMessage(data.message || 'Transaction failed due to an unknown error.')
        return
      }

      if (data.success) {
        setErrorMessage('') // Clear any previous errors
        navigate('/thank-you')
      } else {
        // This block might be redundant if !response.ok handles most errors,
        // but kept for explicit success: false from backend with 200 OK
        setErrorMessage(data.message || 'Sorry your card info is wrong please try again')
      }
    } catch (error) {
      console.error('Error processing transaction:', error)
      setErrorMessage('Network error or server unreachable. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter"> {/* Added font-inter */}
      {/* Header */}
      <div className="bg-gray-300 px-4 py-4 rounded-b-lg shadow-md"> {/* Added rounded-b-lg and shadow */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-gray-600 bg-gray-400 px-4 py-2 rounded-lg hover:bg-gray-500 hover:text-white transition-colors duration-200" // Added rounded-lg, hover effects
            onClick={() => navigate('/product/iphone-16')}
          >
            Cancel
          </Button>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
          <div></div> {/* Placeholder for alignment */}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Address Section */}
        <div className="bg-gray-200 rounded-lg p-4 shadow-sm"> {/* Added shadow-sm */}
          <h2 className="font-semibold text-gray-800 mb-4">Address</h2>
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-xs border border-gray-100"> {/* Added shadow-xs and border */}
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-700">Deliver to</span>
            </div>
            <div className="text-gray-400 font-bold text-xl">›</div> {/* Made arrow bolder */}
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-3">Delivery Instructions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"> {/* Added hover effect */}
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full mr-3 flex items-center justify-center"> {/* Changed to rounded-full */}
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div> {/* Changed to rounded-full */}
                  </div>
                  <span className="text-gray-700">Leave at my door</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={deliveryOptions.leaveAtDoor}
                  onChange={(e) => setDeliveryOptions(prev => ({...prev, leaveAtDoor: e.target.checked}))}
                  className="w-5 h-5 accent-green-500 rounded-md" // Added accent-green-500 and rounded-md
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"> {/* Added hover effect */}
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Someone else receiving</span>
                </div>
                <Plus className="w-5 h-5 text-gray-600 cursor-pointer hover:text-green-500 transition-colors duration-200" /> {/* Added hover effect and cursor-pointer */}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-gray-200 rounded-lg p-4 shadow-sm"> {/* Added shadow-sm */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Add a new card</h2>
            <div className="flex space-x-2">
              <img src="/src/assets/mada1.png" alt="mada" className="h-5 object-contain" />
              <img src="/src/assets/Visa.png" alt="visa" className="h-5 object-contain" />
              <img src="/src/assets/Mastercard.png" alt="mastercard" className="h-5 object-contain" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Apple Pay Option */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"> {/* Added hover effect */}
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="payment" 
                  value="apple-pay"
                  checked={paymentMethod === 'apple-pay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 mr-3 accent-green-500" // Added accent-green-500
                />
                <span className="text-gray-700">Apple Pay</span>
              </div>
              <div className="h-6">
                <img src="/src/assets/Apple_Pay-Logo.wine.png" alt="Apple Pay" className="h-full object-contain" />
              </div>
            </div>

            {/* Credit Card Option */}
            <div className="space-y-3">
              <div className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"> {/* Added hover effect */}
                <input 
                  type="radio" 
                  name="payment" 
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 mr-3 accent-green-500" // Added accent-green-500
                />
                <span className="text-gray-700">Credit Card</span>
                <div className="ml-auto text-2xl">💳</div>
              </div>

              {paymentMethod === 'credit' && (
                <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm border border-gray-100"> {/* Added shadow-sm and border */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo(prev => ({...prev, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()}))} // Format card number
                        className="w-full p-3 pl-3 pr-12 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" // Added right padding for icon
                        placeholder="Enter card number"
                      />
                      {cardInfo.cardNumber && cardInfo.cardNumber.replace(/\s/g, '').length >= 20 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <img src="/src/assets/Visa.png" alt="Visa" className="h-6 object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input 
                        type="text" 
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo(prev => ({...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)}))} // Allow only digits, max 3
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" // Added focus styles
                        placeholder="CVV"
                        maxLength="3"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry
                      </label>
                      <input 
                        type="text" 
                        value={cardInfo.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                          if (value.length > 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4); // Add slash
                          }
                          setCardInfo(prev => ({...prev, expiry: value.slice(0, 5)})); // Max 5 chars (MM/YY)
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" // Added focus styles
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                  </div>

                  {/* Error message moved here */}
                  {errorMessage && (
                    <div className="text-red-700 bg-red-100 rounded-lg px-3 py-2 text-sm border border-red-200"> {/* Added rounded-lg and border */}
                      {errorMessage}
                    </div>
                  )}

                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg shadow-md transition-all duration-200"> {/* Added rounded-lg, shadow, transition */}
                    ADD MY CARD
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 text-lg mb-4">Order Summary</h2>
          
          <div className="mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-start">
              <div className="w-12 h-16 rounded-md mr-3 flex items-center justify-center overflow-hidden bg-gray-50">
                <img 
                  src={product.name.toLowerCase().includes('iphone 16 plus') 
                    ? "/src/assets/iphone 16 plus.png" 
                    : "/src/assets/iphone 16.png"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-800">{product.price} SAR</span>
          </div>
          
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>
          
          <hr className="border-gray-300 my-4" />
          
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{product.price} SAR</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg rounded-t-lg"> {/* Added shadow-lg and rounded-t-lg */}
        <Button 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold rounded-lg shadow-xl transition-all duration-200 transform hover:scale-105" // Added rounded-lg, shadow, transition, transform
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
          <span className="font-bold text-gray-800">{product.price} SAR</span>
          <span>{product.quantity} Item{product.quantity > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage