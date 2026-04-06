import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { addToCart } from '../redux/slices/cartSlice';
import { setProducts, setLoading } from '../redux/slices/productsSlice';
import apiClient from '../api/client';
import { getImageUrl } from '../utils/imageUrl';

export const MenuPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: products, isLoading } = useSelector((state: RootState) => state.products);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiClient.get('/products');
        dispatch(setProducts(response.data.products || response.data));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
      })
    );
    
    // Show animation feedback
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 600);
  };

  const getCartQuantity = (productId: string): number => {
    return cartItems.find((item) => item.product_id === productId)?.quantity || 0;
  };

  const groupedProducts = products.reduce((acc: any, product: any) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <style>{`
        @keyframes pulse-add {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .btn-add-animate {
          animation: pulse-add 0.6s ease-out;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-600">🍔 Menu</h1>
          <button
            onClick={() => navigate('/cart')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded relative shadow-lg"
          >
            🛒 Cart ({cartItems.length})
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : (
          Object.entries(groupedProducts).map(([category, items]: [string, any]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((product: any) => {
                  const cartQty = getCartQuantity(product.id);
                  const isAnimating = addedProductId === product.id;
                  
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
                      {product.image_url && (
                        <div className="bg-gray-100 flex items-center justify-center h-40">
                          <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-40 object-contain" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-red-600">Rp {product.price.toLocaleString()}</span>
                          {cartQty > 0 && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              In cart: {cartQty}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition shadow-md ${
                            isAnimating ? 'btn-add-animate bg-green-800' : ''
                          }`}
                        >
                          {isAnimating ? '✓ Added!' : '➕ Add to Cart'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
