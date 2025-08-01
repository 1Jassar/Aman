import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Heart, Share2, Home, User, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProductPage = () => {
  const navigate = useNavigate()
  const [selectedModel, setSelectedModel] = useState('iPhone 16')
  const [selectedStorage, setSelectedStorage] = useState('128 GB')
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="px-4 py-4">
        {/* Brand */}
        <div className="mb-2">
          <span className="text-blue-600 font-semibold text-lg">Apple</span>
        </div>

        {/* Product Title */}
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {selectedModel === 'iPhone 16' 
            ? "iPhone 16 128GB Black 5G With FaceTime - Middle East Version" 
            : "iPhone 16 Plus 256GB White 5G With FaceTime - Middle East Version"}
        </h1>

        {/* Product Image */}
        <div className="relative mb-6">
          <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
            <img 
              src={selectedModel === 'iPhone 16' 
                ? "/src/assets/iphone 16.png" 
                : "/src/assets/iphone 16 plus.png"} 
              alt={selectedModel}
              className="object-contain h-full max-w-full p-4"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 left-4 space-y-2">
            <Button variant="outline" size="sm" className="w-12 h-12 rounded-lg bg-white">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" className="w-12 h-12 rounded-lg bg-white">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
            (7.2K) ★ 5.0
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-gray-800">
              {selectedModel === 'iPhone 16' ? '3,199 SAR' : '4,999 SAR'}
            </span>
            <div className="text-sm text-gray-500 line-through">
              {selectedModel === 'iPhone 16' ? '3,799 SAR' : '5,599 SAR'}
            </div>
          </div>
          <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
            Extra 25% off CODE : Amd
            <span className="ml-2 bg-white text-red-500 px-2 py-1 rounded text-xs">25% DISCOUNT</span>
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Model Name</h3>
          <div className="flex space-x-2">
            <Button
              variant={selectedModel === 'iPhone 16' ? 'default' : 'outline'}
              className={`px-4 py-2 rounded-lg ${
                selectedModel === 'iPhone 16' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border-gray-300'
              }`}
              onClick={() => {
                setSelectedModel('iPhone 16')
                setSelectedStorage('128 GB')
              }}
            >
              iPhone 16
            </Button>
            <Button
              variant={selectedModel === 'iPhone 16 Plus' ? 'default' : 'outline'}
              className={`px-4 py-2 rounded-lg ${
                selectedModel === 'iPhone 16 Plus' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}
              onClick={() => {
                setSelectedModel('iPhone 16 Plus')
                setSelectedStorage('256 GB')
              }}
            >
              iPhone 16 Plus
            </Button>
          </div>
        </div>

        {/* Storage Selection */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Internal Memory</h3>
          <div className="flex space-x-2">
            {selectedModel === 'iPhone 16' ? (
              <>
                <Button
                  variant={selectedStorage === '128 GB' ? 'default' : 'outline'}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStorage === '128 GB' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border-gray-300'
                  }`}
                  onClick={() => setSelectedStorage('128 GB')}
                >
                  128 GB
                </Button>
                <Button
                  variant={selectedStorage === '256 GB' ? 'default' : 'outline'}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStorage === '256 GB' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  onClick={() => setSelectedStorage('256 GB')}
                >
                  256 GB
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={selectedStorage === '256 GB' ? 'default' : 'outline'}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStorage === '256 GB' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border-gray-300'
                  }`}
                  onClick={() => setSelectedStorage('256 GB')}
                >
                  256 GB
                </Button>
                <Button
                  variant={selectedStorage === '512 GB' ? 'default' : 'outline'}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStorage === '512 GB' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  onClick={() => setSelectedStorage('512 GB')}
                >
                  512 GB
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex space-x-3 mb-4">
          <Button 
            variant="outline" 
            className="flex-1 py-3 border-green-500 text-green-500 hover:bg-green-50"
          >
            ADD TO CART
          </Button>
          <Button 
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => {
              const price = selectedModel === 'iPhone 16' ? '3,199' : '4,999';
              navigate('/checkout', { 
                state: { 
                  product: {
                    name: selectedModel === 'iPhone 16' 
                      ? `iPhone 16 ${selectedStorage} Black` 
                      : `iPhone 16 Plus ${selectedStorage} White`,
                    price: price,
                    quantity: quantity
                  } 
                }
              });
            }}
          >
            Buy Now
          </Button>
          <div className="flex flex-col items-center justify-center px-4">
            <span className="text-xs text-gray-500 mb-1">QTY</span>
            <span className="font-semibold">{quantity}</span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around pt-2 border-t border-gray-100">
          <div className="flex flex-col items-center py-2">
            <Home className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex flex-col items-center py-2">
            <Heart className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex flex-col items-center py-2">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex flex-col items-center py-2">
            <ShoppingCart className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

