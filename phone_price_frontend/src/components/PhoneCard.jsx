import { Tag, MapPin, TrendingUp, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhoneCard = ({ phone, prices = [] }) => {
  const navigate = useNavigate();
  const minPrice = prices.length > 0 
    ? Math.min(...prices.map(p => p.price))
    : null;
  
  const maxPrice = prices.length > 0
    ? Math.max(...prices.map(p => p.price))
    : null;

  const bestPriceEntry = prices.find(p => p.price === minPrice);

  const openWhatsApp = (whatsappNumber, shopName, phoneName, price) => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      const message = `Hi ${shopName}! I'm interested in the ${phoneName} priced at ${price.toLocaleString()} LKR. Is this still available?`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  const getCategoryBadge = (category) => {
    const styles = {
      budget: 'bg-green-500/20 text-green-300 border-green-500/30',
      midrange: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      flagship: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      gaming: 'bg-red-500/20 text-red-300 border-red-500/30',
      foldable: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return styles[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      budget: '💰',
      midrange: '📱',
      flagship: '⭐',
      gaming: '🎮',
      foldable: '📲',
    };
    return icons[category] || '📱';
  };

  // Fallback image
  const displayImage = phone.image_url && phone.image_url !== 'string' && phone.image_url.length > 10
    ? phone.image_url
    : 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format&fit=crop';

  return (
    <div className="group cursor-pointer bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img 
          src={displayImage} 
          alt={`${phone.brand} ${phone.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getCategoryBadge(phone.category)} flex items-center gap-1.5`}>
          <span>{getCategoryIcon(phone.category)}</span>
          <span className="capitalize">{phone.category}</span>
        </div>

        {/* Year Badge if available */}
        {phone.release_year && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-sm border border-white/10">
            {phone.release_year}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
            {phone.brand}
          </h3>
          <p className="text-gray-400 font-medium">{phone.model}</p>
        </div>
        
        {/* Price Section */}
        {minPrice && maxPrice ? (
          <div className="pt-4 border-t border-gray-700/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Best Price</p>
                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
                  {minPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">LKR</p>
                {minPrice !== maxPrice && (
                  <p className="text-xs text-gray-500 mt-1">
                    up to {maxPrice.toLocaleString()} LKR
                  </p>
                )}
              </div>
              <div className="bg-indigo-500/20 p-2.5 rounded-lg">
                <Tag className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            
            {/* Best Price Shop Info */}
            {bestPriceEntry?.shopDetails && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">
                      {bestPriceEntry.shopDetails.name}
                    </span>
                    {bestPriceEntry.shopDetails.verified && (
                      <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                {bestPriceEntry.shopDetails.whatsapp && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openWhatsApp(
                        bestPriceEntry.shopDetails.whatsapp,
                        bestPriceEntry.shopDetails.name,
                        `${phone.brand} ${phone.model}`,
                        bestPriceEntry.price
                      );
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact on WhatsApp</span>
                  </button>
                )}
              </div>
            )}
            
            {/* Shop count */}
            <div className="mt-3 flex items-center text-sm text-gray-400">
              <MapPin className="h-4 w-4 mr-1.5 text-indigo-400" />
              Available at {prices.length} shop{prices.length !== 1 ? 's' : ''}
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-700/50">
            <p className="text-sm text-gray-500 italic">Price information not available</p>
          </div>
        )}

        {/* View Details Button */}
        <button 
          onClick={() => navigate(`/phone/${phone.id}`)}
          className="w-full mt-4 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group/btn border border-indigo-500/30"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PhoneCard;
