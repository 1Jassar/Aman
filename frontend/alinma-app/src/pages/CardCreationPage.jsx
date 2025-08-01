import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

const CardCreationPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/card/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        navigate('/card-management');
      }
    } catch (error) {
      console.error('Error requesting card:', error);
      alert('حدث خطأ في طلب البطاقة');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4E2D8]"dir="rtl">
      {/* Header */}
      <div className="bg-[#BFAEA1] shadow-sm p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="ml-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">إنشاء بطاقة أمان</h1>
      </div>

      <div className="p-6">
        {/* Card Preview */}
        <div className="mb-0">
          <Card className="bg-transparent text-gray-800 max-w-sm mx-auto shadow-none">
            <CardContent className="p-2 flex justify-center items-center">
              <img src="/card-image.png" alt="بطاقة أمان" className="w-72 h-auto rounded" />
            </CardContent>
          </Card>
        </div>

        {/* Card Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            تفاصيل البطاقة :
          </h2>
          
          <div className="bg-white rounded-lg p-6 text-right">
            <p className="text-gray-700 leading-relaxed mb-6">
              
بطاقة رقمية تتيح لك إتمام معاملاتك بكل أمان، مع الحفاظ على سرية بياناتك البنكية .
تتميز بميزة تغيير رمز الحماية (CVV) .تلقائيًا بعد كل عملية شراء، مما يوفر طبقة إضافية من الأمان ويحد من احتمالية استخدام البطاقة من قبل أطراف غير مصرح لها 
            </p>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                مميزات البطاقة :
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    تغيير تلقائي لرمز الحماية (CVV) بعد كل عملية شراء
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    مناسبة للتسوق من المواقع غير الموثوقة بالكامل
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    مثالية للاشتراكات التجريبية والخدمات المؤقتة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Button */}
        <div className="fixed bottom-6 left-6 right-6">
          <Button 
            onClick={handleRequestCard}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 text-lg font-bold rounded-xl"
            disabled={loading}
          >
            {loading ? 'جاري طلب البطاقة...' : 'طلب البطاقة'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardCreationPage;

