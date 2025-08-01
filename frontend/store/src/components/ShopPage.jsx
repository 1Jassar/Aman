import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, User, ShoppingCart, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ShopPage = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')

  const products = [
    {
      id: 'iphone-16',
      name: 'iPhone 16',
      color: 'Black',
      storage: '128GB',
      price: '3,199 SAR',
      originalPrice: null,
      discount: '-15%',
      image: '/src/assets/iphone 16.png',
      category: 'iPhone'
    },
    {
      id: 'iphone-16-plus',
      name: 'iPhone 16 Plus',
      color: 'White',
      storage: '256GB',
      price: '4,999 SAR',
      originalPrice: null,
      discount: '+12%',
      image: '/src/assets/iphone 16 plus.png',
      category: 'iPhone'
    },
    {
      id: 'iphone-16-pro-max',
      name: 'Phone 16 Pro Max',
      color: 'Black Titanium',
      storage: '1TB',
      price: '5,999 SAR',
      originalPrice: null,
      discount: '-21%',
      image: '/src/assets/iphone 16 pro max.png',
      category: 'iPhone'
    },
    {
      id: 'macbook-air-1',
      name: 'MacBook Air',
      color: 'Space Gray',
      storage: '13.6-Inch',
      price: '3,999 SAR',
      originalPrice: '4,199',
      discount: '-3%',
      image: '/src/assets/MacBook Air.png',
      category: 'MacBook'
    },
    {
      id: 'macbook-air-2',
      name: 'MacBook Air',
      color: 'Silver',
      storage: '13.3-Inch',
      price: '4,499 SAR',
      originalPrice: '5199',
      discount: '-14%',
      image: '/src/assets/MacBook Air2.png',
      category: 'MacBook'
    },
    {
      id: 'macbook-pro',
      name: 'MacBook Pro',
      color: 'Space Gray',
      storage: '14.2-Inch',
      price: '7,722 SAR',
      originalPrice: '9,999',
      discount: '-22%',
      image: '/src/assets/Macbook pro.png',
      category: 'MacBook'
    },
    {
      id: 'ipad-air-13',
      name: 'iPad Air 13',
      color: 'Space Gray',
      storage: '256 GB',
      price: '2,999 SAR',
      originalPrice: null,
      discount: null,
      image: '/src/assets/iPad Air 13.png',
      category: 'iPad'
    },
    {
      id: 'ipad-air-11',
      name: 'iPad Air 11',
      color: 'Blue',
      storage: '256 GB',
      price: '2,499 SAR',
      originalPrice: null,
      discount: null,
      image: '/src/assets/iPad Air 11.png',
      category: 'iPad'
    },
    {
      id: 'ipad-mini',
      name: 'iPad mini',
      color: 'Starlight',
      storage: '128 GB',
      price: '1,999 SAR',
      originalPrice: null,
      discount: null,
      image: '/src/assets/iPad air.png',
      category: 'iPad'
    }
  ]

  const categories = ['all', 'iPhone', 'iPad', 'MacBook']

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  const handleProductClick = (productId) => {
    if (productId === 'iphone-16') {
      navigate('/product/iphone-16')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 flex items-center justify-center">
            <img 
              src="/src/assets/apple-house.png" 
              alt="Apple House"
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full bg-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-700"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`px-6 py-2 rounded-full text-sm ${
                activeCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border-gray-300'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg p-4 shadow-sm cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="flex">
                <div className="w-24 h-32 bg-gray-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-contain w-full h-full" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  
                  <div className="flex space-x-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">{product.color}</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">{product.storage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-800">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      )}
                    </div>
                    {product.discount && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.discount.startsWith('-') 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {product.discount}
                      </span>
                    )}
                  </div>
                  
                  <Button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white">
                    Add To Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center py-2">
            <Home className="w-6 h-6 text-black" />
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

export default ShopPage

