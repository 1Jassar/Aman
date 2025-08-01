import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Eye, 
  CreditCard, 
  Car, 
  Receipt, 
  ArrowUpDown, 
  Home,
  Banknote,
  FileText,
  Grid3X3,
  Store,
  LogOut
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [mainBalance, setMainBalance] = useState(250000);

  useEffect(() => {
    fetchMainBalance();
    
    // Refresh balance when user returns to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMainBalance();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchMainBalance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/account/balance');
      const data = await response.json();
      if (data.success) {
        setMainBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching main balance:', error);
      setMainBalance(250000); // Fallback to default
    }
  };

  const handleSecurityCardClick = () => {
    navigate('/card-creation');
  };

  return (
    <div className="min-h-screen bg-[#F4E2D8]" dir="rtl">
      {/* Header */}
      <div className="bg-[#BFAEA1] shadow-sm p-8 flex justify-between items-center">
        <div className="flex items-center space-x-2 space-x-reverse">
          <img 
            src="/Alinma.png" 
            alt="الإنماء" 
            className="h-13 w-auto"
          />
        </div>
        <div className="flex items-center space-x-2 space-5-reverse">
          <Bell className="w-6 h-6 text-gray-600" />
          <Eye className="w-6 h-6 text-gray-600" />
          <LogOut className="w-6 h-6 text-red-600 transform scale-x-[-1] cursor-pointer" onClick={() => navigate('/login')} />
        </div>
      </div>

      {/* Balance */}
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 mb-2">حسابك الجاري :</p>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          {mainBalance.toLocaleString()}
          <img src="/Riyal.png" alt="ريال" className="w-8 h-8 mr-2" />
        </h1>
      </div>

      {/* Security Card Section */}
      <div className="px-6 mb-6">
        <div className="relative">
          <span className="absolute -top-3 right-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold z-10">
            New
          </span>
          <Card 
            className="bg-gradient-to-r from-purple-200 to-blue-500 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleSecurityCardClick}
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">بطاقة أمان</h2>
                  <p className="text-sm opacity-90">
                    بطاقة دفع رقمية لحماية بياناتك أثناء الشراء عبر الإنترنت
                  </p>
                </div>
                <div className="min-w-[px]">
                  <img 
                    src="/card-image.png" 
                    alt="بطاقة أمان" 
                    className="w-28 h-auto rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Icons */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-2">
              <ArrowUpDown className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700">التحويل السريع</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700">دفع الفواتير</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700">شحن الجوال</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Car className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700">المخالفات المرورية</p>
          </div>
        </div>
      </div>

      {/* Additional Security Card Section */}
      <div className="px-6 mb-6">
        <Card className="bg-white">
          <CardContent className="p-">
            <div className="flex justify-between items-center min-h-[110px]">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">بطاقة أمان</h3>
                <Button 
                  className="bg-blue-900 hover:bg-blue-800 text-white text-base px-6 py-"
                  onClick={() => navigate('/card-management')}
                >
                  عرض المعلومات
                </Button>
              </div>
              <div className="min-w-[0px] flex items-center justify-center">
                <img 
                  src="/card-image.png" 
                  alt="بطاقة أمان" 
                  className="w-32 h-30 object-contain rounded"
                />
              </div>
            </div>
            <hr className="border-black my-4" />
            <div className="flex items-center justify-end">
              <span className="text-gray-800 font-medium ml-2">معلومات البطاقة</span>
              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-6 mb-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center min-h-[110px]">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">بطاقة المسافر</h3>
                <Button 
                  className="bg-blue-900 hover:bg-blue-800 text-white text-base px-6 py-2"
                  // Add onClick handler if needed
                >
                  إنشاء بطاقة
                </Button>
              </div>
              <div className="min-w-[0px] flex items-center justify-center">
                <img 
                  src="/mosafr.png" 
                  alt="بطاقة المسافر" 
                  className="w-32 h-20 object-contain rounded"
                />
              </div>
            </div>
            <hr className="border-black my-4" />
            <div className="flex items-center justify-end">
              <span className="text-gray-800 font-medium ml-2">معلومات البطاقة</span>
              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          <div className="text-center py-2">
            <Home className="w-6 h-6 mx-auto mb-1 text-blue-600" />
            <span className="text-xs text-blue-600">الرئيسية</span>
          </div>
          <div className="text-center py-2">
            <ArrowUpDown className="w-6 h-6 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">التحويل</span>
          </div>
          <div className="text-center py-2">
            <FileText className="w-6 h-6 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">المدفوعات</span>
          </div>
          <div className="text-center py-2">
            <Store className="w-6 h-6 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">المتجر</span>
          </div>
          <div className="text-center py-2">
            <Grid3X3 className="w-6 h-6 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">الخدمات</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

