import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Check } from 'lucide-react';

const CardInfoPage = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [cvvAnimating, setCvvAnimating] = useState(false);
  const [displayCvv, setDisplayCvv] = useState('***');
  const [animationCvv, setAnimationCvv] = useState('***');
  const navigate = useNavigate();

  const fetchCardInfo = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/card/info');
      const data = await response.json();
      
      if (data.success) {
        setCardData(prevCardData => {
          // Check if CVV changed to trigger counter animation
          if (prevCardData && prevCardData.cvv && data.card.cvv !== prevCardData.cvv) {
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
                setDisplayCvv(data.card.cvv);
                setAnimationCvv(data.card.cvv);
                setCvvAnimating(false);
              }
            }, 80); // 80ms per step = ~640ms total animation
          } else {
            setDisplayCvv(data.card.cvv || '***');
            setAnimationCvv(data.card.cvv || '***');
          }
          
          return data.card;
        });
      }
    } catch (error) {
      console.error('Error fetching card info:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Remove cardData dependency

  useEffect(() => {
    // Initial fetch
    fetchCardInfo();

    // Set up WebSocket connection
    const ws = new WebSocket('ws://localhost:5000/ws');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        if (data.type === 'transaction_complete') {
          // Immediate fetch when transaction occurs
          fetchCardInfo();
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [fetchCardInfo]);

  // Initialize display values when cardData first loads
  useEffect(() => {
    if (cardData && cardData.cvv && displayCvv === '***') {
      setDisplayCvv(cardData.cvv);
      setAnimationCvv(cardData.cvv);
    }
  }, [cardData, displayCvv]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل معلومات البطاقة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4E2D8]" dir="rtl">
      {/* Header */}
      <div className="bg-[#BFAEA1] shadow-sm p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/card-management')}
          className="ml-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">معلومات البطاقة</h1>
      </div>

      <div className="p-6">
        {/* Card Display */}
        <div className="mb-8">
          <div className="relative max-w-sm mx-auto">
            <div className="transform transition-all duration-300 hover:scale-105">
              <img 
                src="/card-info.png" 
                alt="بطاقة أمان" 
                className="w-full rounded-xl mx-auto"
              />
              {/* Card number overlay */}
              <div className="absolute bottom-47 left-21 transform">
                <div className="bg-transparent">
                  <span className="text-black font-bold text-sm font-mono tracking-wider" dir="ltr">
                    {cardData?.card_number ? cardData.card_number.replace(/(.{4})/g, '$1 ').trim() : '****-****-****-****'}
                  </span>
                </div>
              </div>
              
              {/* Expiry date overlay */}
              <div className="absolute bottom-34 left-31 transform">
                <div className="bg-transparent">
                  <span className="text-black font-bold text-xs font-mono">
                    {cardData?.expiry_date || 'MM/YY'}
                  </span>
                </div>
              </div>
              
              {/* Cardholder name overlay */}
              <div className="absolute bottom-25 left-25 transform">
                <div className="bg-transparent">
                  <span className="text-black font-bold text-sm uppercase tracking-wide">
                    Jassar Z
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          {/* Card Number */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(cardData?.card_number, 'number')}
                  className="p-2"
                >
                  {copiedField === 'number' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 mb-1">رقم البطاقة</p>
                  <p className="text-lg font-mono font-bold text-gray-800">
                    {cardData?.card_number || '****-****-****-****'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CVV and Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* CVV */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">CVV</p>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(cardData?.cvv, 'cvv')}
                      className="p-1"
                    >
                      {copiedField === 'cvv' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    <div className="h-8 flex items-center justify-center">
                      <p className={`text-xl font-mono font-bold text-gray-800 transition-all duration-100 ${
                        cvvAnimating ? 'scale-110 text-blue-600' : 'scale-100'
                      }`}>
                        {cvvAnimating ? animationCvv : (displayCvv || cardData?.cvv || '***')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expiry Date */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">تاريخ الانتهاء</p>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(cardData?.expiry_date, 'expiry')}
                      className="p-1"
                    >
                      {copiedField === 'expiry' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    <p className="text-xl font-mono font-bold text-gray-800">
                      {cardData?.expiry_date || 'MM/YY'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                  ميزة الأمان المتقدمة
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  يتم تغيير رمز CVV تلقائياً بعد كل عملية شراء لضمان أقصى درجات الأمان. 
                  هذا يحمي بطاقتك من الاستخدام غير المصرح به حتى لو تم اختراق بياناتها.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Refresh Button */}
          <div className="text-center pt-4">
            <Button
              onClick={fetchCardInfo}
              variant="outline"
              className="px-8"
            >
              تحديث المعلومات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfoPage;
