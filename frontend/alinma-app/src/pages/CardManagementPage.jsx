import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  StopCircle, 
  ArrowUpDown, 
  Info, 
  Plus,
  Snowflake,
  Receipt
} from 'lucide-react';

const CardManagementPage = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBalanceInput, setShowBalanceInput] = useState(false);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCardInfo();
  }, []);

  const fetchCardInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/card/info');
      const data = await response.json();

      if (data.success) {
        setCardData(data.card);
      }
    } catch (error) {
      console.error('Error fetching card info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardInfo = () => {
    navigate('/card-info');
  };
  
  // For testing and development purposes only
  const handleResetCardStatus = () => {
    localStorage.removeItem('hasSecurityCard');
    navigate('/dashboard');
  };

  const handleFreezeCard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/card/freeze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setCardData(prev => ({ ...prev, is_active: data.is_active }));
        alert(data.message);
      }
    } catch (error) {
      console.error('Error freezing card:', error);
    }
  };

  const simulateTransaction = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/card/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvv: cardData?.cvv,
          cardNumber: cardData?.card_number,
          expiry: cardData?.expiry_date
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`تم تنفيذ معاملة بقيمة ${data.transaction_amount.toLocaleString()} ريال\nالرصيد الجديد: ${data.new_balance.toLocaleString()} ريال\nتم تغيير CVV من ${data.old_cvv} إلى ${data.new_cvv}`);
        fetchCardInfo(); // Refresh card data
      } else {
        alert(`خطأ: ${data.message}`);
      }
    } catch (error) {
      console.error('Error simulating transaction:', error);
      alert('حدث خطأ أثناء تنفيذ المعاملة');
    }
  };

  const handleAddBalance = async () => {
    if (!amount || isNaN(amount)) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/card/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      const data = await response.json();
      
      if (data.success) {
        setCardData(prev => ({ ...prev, balance: data.new_card_balance }));
        setShowBalanceInput(false);
        setAmount('');
        alert(`تم تحويل ${amount} ريال من الحساب الرئيسي إلى بطاقة الأمان`);
      } else {
        alert(`خطأ: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding balance:', error);
      alert('حدث خطأ أثناء إضافة الرصيد');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات البطاقة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4E2D8]" dir="rtl">
      {/* Header */}
      <div className="bg-[#BFAEA1] shadow-sm p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="ml-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800 ml-auto">بطاقة أمان</h1>
      </div>

      <div className="p-6">
        {/* Card Display */}
        <div className="mb-6">
          <div className="mb-2">
            <Card className="bg-transparent text-gray-800 max-w-sm mx-auto shadow-none">
              <CardContent className="p-0 flex justify-center items-center">
                <img src="/card-image.png" alt="بطاقة أمان" className="w-72 h-auto rounded m-0" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Balance */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">رصيد الحساب</p>
                <div className="text-2xl font-bold text-gray-800 flex items-center">
                  {cardData?.balance?.toFixed(2) || '0.00'}
                  <img src="/Riyal.png" alt="ريال" className="w-6 h-6 mr-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-20 flex flex-col items-center justify-center"
              onClick={handleFreezeCard}
            >
              <StopCircle className="w-6 h-6 mb-2" />
              <span className="text-xs">
                {cardData?.is_active ? 'إيقاف البطاقة' : 'تفعيل البطاقة'}
              </span>
            </Button>
          </div>
          
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-20 flex flex-col items-center justify-center"
            >
              <ArrowUpDown className="w-6 h-6 mb-2" />
              <span className="text-xs">تحويل الرصيد</span>
            </Button>
          </div>
          
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-20 flex flex-col items-center justify-center"
              onClick={handleCardInfo}
            >
              <Info className="w-6 h-6 mb-2" />
              <span className="text-xs">معلومات البطاقة</span>
            </Button>
          </div>
          
          <div className="text-center">
            {showBalanceInput ? (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-80">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-4">إضافة رصيد</h3>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2 border rounded mb-4 text-right"
                      placeholder="أدخل المبلغ"
                      max="250000"
                    />
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setShowBalanceInput(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleAddBalance}
                      >
                        إضافة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full h-20 flex flex-col items-center justify-center"
                onClick={() => setShowBalanceInput(true)}
              >
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs">إضافة رصيد</span>
              </Button>
            )}
          </div>
        </div>

        {/* Card Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Snowflake className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  {cardData?.is_active ? 'البطاقة نشطة' : 'البطاقة مجمدة مؤقتاً'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardManagementPage;

