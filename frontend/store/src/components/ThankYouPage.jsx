import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ThankYouPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Thank You Title */}
        <h1 className="text-6xl font-bold text-black mb-4">
          Thank you
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-700 mb-8">
          Your order is now confirmed
        </p>
        
        {/* Check Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-16 h-16 text-white stroke-[3]" />
          </div>
        </div>
        
        {/* Description */}
        <p className="text-lg text-gray-700 max-w-md mx-auto leading-relaxed">
          We will send you an email with the details and tracking information soon.
        </p>
        
        {/* Back to Shop Button */}
        <div className="pt-8">
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-lg"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage

