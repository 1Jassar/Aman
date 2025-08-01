import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [cardData, setCardData] = useState({
    card_number: "83840742168075216433",
    cvv: "123",
    expiry_date: "02/28",
    balance: 0,
    is_active: true
  })
  const [error, setError] = useState(null)
  const [ws, setWs] = useState(null)
  const [cvvAnimating, setCvvAnimating] = useState(false)
  const [displayCvv, setDisplayCvv] = useState('123')
  const [animationCvv, setAnimationCvv] = useState('123')

  // API base URL - يمكن تغييرها حسب الحاجة
  const API_BASE_URL = 'http://localhost:5000'

  // جلب بيانات البطاقة من API
  const fetchCardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/card/info`)
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات البطاقة')
      }
      const data = await response.json()
      if (data.success) {
        setCardData(data.card)
      }
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('خطأ في جلب بيانات البطاقة:', err)
    }
  }

  // تحديث البيانات عند تحميل المكون
  useEffect(() => {
    fetchCardData()
    
    // إعداد اتصال WebSocket للتحديثات الفورية
    const websocket = new WebSocket('ws://localhost:5000/ws')
    
    websocket.onopen = () => {
      console.log('WebSocket متصل')
      setWs(websocket)
    }
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('WebSocket message received:', data)
        
        if (data.type === 'cvv_update' || data.type === 'transaction_complete') {
          console.log('تحديث CVV جديد:', data.new_cvv)
          
          // Check if CVV changed to trigger counter animation
          if (cardData.cvv && data.new_cvv !== cardData.cvv) {
            setCvvAnimating(true);
            
            // Counter animation - cycle through random numbers
            let counter = 0;
            const maxCount = 8; // Number of animation steps
            const interval = setInterval(() => {
              // Generate random 3-digit number for animation effect
              const randomCvv = Math.floor(Math.random() * 900 + 100).toString();
              setAnimationCvv(randomCvv);
              
              counter++;
              if (counter >= maxCount) {
                clearInterval(interval);
                // Show final CVV and stop animation
                setDisplayCvv(data.new_cvv);
                setAnimationCvv(data.new_cvv);
                setCvvAnimating(false);
              }
            }, 80); // 80ms per step = ~640ms total animation
          } else {
            setDisplayCvv(data.new_cvv);
            setAnimationCvv(data.new_cvv);
          }
          
          setCardData(prev => ({
            ...prev,
            cvv: data.new_cvv,
            balance: data.new_balance || data.balance || prev.balance
          }))
        }
      } catch (err) {
        console.error('خطأ في معالجة رسالة WebSocket:', err)
      }
    }
    
    websocket.onerror = (error) => {
      console.error('خطأ في WebSocket:', error)
    }
    
    websocket.onclose = () => {
      console.log('تم قطع اتصال WebSocket')
      setWs(null)
    }
    
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(fetchCardData, 30000)
    
    return () => {
      clearInterval(interval)
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close()
      }
    }
  }, [])

  // Initialize display values when cardData first loads
  useEffect(() => {
    if (cardData && cardData.cvv && displayCvv === '123') {
      setDisplayCvv(cardData.cvv);
      setAnimationCvv(cardData.cvv);
    }
  }, [cardData, displayCvv])

  // تنسيق رقم البطاقة
  const formatCardNumber = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-2 flex items-center justify-center">
      <div className="max-w-sm mx-auto">
        <h1 className="text-lg font-bold text-center -mb-15 text-gray-800">
          بطاقة الإنماء الأمنية
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded mb-1 text-xs">
            {error}
          </div>
        )}

        {/* واجهة البطاقة الأمامية */}
        <div className="relative -mb-30">
          <div className="transform transition-all duration-300 hover:scale-109 scale-105">
            <img 
              src="/src/assets/front-of-the-card.png" 
              alt="واجهة البطاقة الأمامية" 
              className="w-full rounded-xl mx-auto"
            />
            {/* Card number overlay */}
            <div className="absolute bottom-48 left-20 transform">
              <div className="bg-transparent">
                <span className="text-black font-bold text-xs font-mono tracking-wider" dir="ltr">
                  {formatCardNumber(cardData.card_number)}
                </span>
              </div>
            </div>
            
            {/* Expiry date overlay */}
            <div className="absolute bottom-34 left-30 transform">
              <div className="bg-transparent">
                <span className="text-black font-bold text-1xs font-mono">
                  {cardData.expiry_date}
                </span>
              </div>
            </div>
            
            {/* Cardholder name overlay */}
            <div className="absolute bottom-25 left-23 transform">
              <div className="bg-transparent">
                <span className="text-black font-bold text-xs uppercase tracking-wide">
                  Jassar Z
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* واجهة البطاقة الخلفية */}
        <div className="relative -mb-5">
          <div className="transform transition-all duration-300 hover:scale-109 scale-105">
            <img 
              src="/src/assets/back-of-the-card.png" 
              alt="واجهة البطاقة الخلفية" 
              className="w-full rounded-xl mx-auto"
            />
            {/* CVV overlay on the back card image */}
            <div className="absolute bottom-49 right-20 transform">
              <div className="bg-transparent px-1 py-0">
                <span className={`text-black font-bold text-1xs font-mono transition-all duration-100 ${
                  cvvAnimating ? 'scale-110' : 'scale-100'
                }`}>
                  {cvvAnimating ? animationCvv : (displayCvv || cardData.cvv)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="bg-white rounded-lg p-2 mb-7 shadow">
          <h3 className="font-bold text-sm mb-0">معلومات البطاقة</h3>
          <div className="space-y-0 text-xs">
            <div className="flex justify-between">
              <span>الرصيد:</span>
              <span className="font-bold">{cardData.balance.toLocaleString()} ريال</span>
            </div>
            <div className="flex justify-between">
              <span>الحالة:</span>
              <span className={`font-bold ${cardData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {cardData.is_active ? 'نشطة' : 'مجمدة'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CVV الحالي:</span>
              <span className={`font-bold transition-all duration-100 ${
                cvvAnimating ? 'scale-110' : 'scale-100'
              }`}>
                {cvvAnimating ? animationCvv : (displayCvv || cardData.cvv)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>حالة الاتصال:</span>
              <span className={`font-bold text-xs ${ws && ws.readyState === WebSocket.OPEN ? 'text-green-600' : 'text-red-600'}`}>
                {ws && ws.readyState === WebSocket.OPEN ? 'متصل' : 'غير متصل'}
              </span>
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="space-y-0 -mt-4">
          <button
            onClick={fetchCardData}
            className="w-full bg-gray-600 text-white py-1 px-3 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors"
          >
            تحديث البيانات
          </button>
        </div>

        {/* ملاحظة */}
        <div className="mt-0 text-center text-xs text-gray-600">
          <p>يتم تحديث CVV تلقائياً وفورياً بعد كل معاملة عبر WebSocket</p>
        </div>
      </div>
    </div>
  )
}

export default App

