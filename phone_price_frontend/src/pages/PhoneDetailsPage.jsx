import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { phonesAPI, pricesAPI, shopsAPI } from '../services/api';
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Globe,
  TrendingUp,
  Calendar,
  Tag,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const PhoneDetailsPage = () => {
  const { phoneId } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [prices, setPrices] = useState([]);
  const [shops, setShops] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhoneDetails();
  }, [phoneId]);

  const fetchPhoneDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch phone details
      const phoneResponse = await phonesAPI.getById(phoneId);
      setPhone(phoneResponse.data);

      // Fetch phone specifications
      try {
        const specsResponse = await phonesAPI.getSpecs(phoneId);
        setSpecs(specsResponse.data || []);
      } catch (err) {
        console.warn('No specs found for this phone:', err);
        setSpecs([]);
      }

      // Fetch prices for this phone
      const pricesResponse = await pricesAPI.getAll(phoneId);
      const pricesData = pricesResponse.data || [];
      setPrices(pricesData);

      // Fetch all shops
      const shopsResponse = await shopsAPI.getAll();
      const shopsData = shopsResponse.data || [];
      
      // Create shops lookup map
      const shopsMap = {};
      shopsData.forEach(shop => {
        shopsMap[shop.id] = shop;
      });
      setShops(shopsMap);

    } catch (err) {
      console.error('Error fetching phone details:', err);
      setError('Failed to load phone details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading phone details...</p>
        </div>
      </div>
    );
  }

  if (error || !phone) {
    return (
      <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Phone not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices.map(p => p.price)) : null;
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);

  const displayImage = phone.image_url && phone.image_url !== 'string' && phone.image_url.length > 10
    ? phone.image_url
    : 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-[#0a0a1f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Phone Details Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <div className="relative">
            <div className="sticky top-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50">
              <img
                src={displayImage}
                alt={`${phone.brand} ${phone.model}`}
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getCategoryBadge(phone.category)} flex items-center gap-2`}>
                  <span>{getCategoryIcon(phone.category)}</span>
                  <span className="capitalize">{phone.category}</span>
                </div>
                {phone.release_year && (
                  <div className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-800/50 text-gray-300 backdrop-blur-sm border border-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {phone.release_year}
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {phone.brand}
              </h1>
              <p className="text-2xl text-gray-400 font-medium">{phone.model}</p>
            </div>

            {/* Price Summary */}
            {minPrice && (
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm text-indigo-300 font-semibold uppercase tracking-wide">
                    Price Range
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
                    {minPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400">LKR</span>
                </div>
                {minPrice !== maxPrice && (
                  <p className="text-gray-400">
                    up to <span className="text-white font-semibold">{maxPrice.toLocaleString()}</span> LKR
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-indigo-500/30">
                  <div className="flex items-center gap-2 text-sm text-indigo-300">
                    <Store className="h-4 w-4" />
                    <span>Available at {prices.length} shop{prices.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Phone Specs */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Technical Specifications
              </h2>
              
              {specs.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {specs.map((spec, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between py-2 border-b border-gray-700 last:border-0"
                    >
                      <span className="text-gray-400 capitalize">
                        {spec.key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-white font-medium text-right max-w-[60%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Brand</span>
                    <span className="text-white font-medium">{phone.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Model</span>
                    <span className="text-white font-medium">{phone.model}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-medium capitalize">{phone.category}</span>
                  </div>
                  {phone.release_year && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Release Year</span>
                      <span className="text-white font-medium">{phone.release_year}</span>
                    </div>
                  )}
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      Detailed specifications are being updated. Check back soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Specifications Section - Below the main grid */}
        {specs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-indigo-400" />
              Complete Hardware & Technical Details
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specs.map((spec, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-indigo-400 font-semibold uppercase tracking-wide">
                      {spec.key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-white font-medium">
                      {spec.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Shops Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Store className="h-8 w-8 text-indigo-400" />
            Available at These Shops
          </h2>

          {sortedPrices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPrices.map((priceEntry, idx) => {
                const shop = shops[priceEntry.shop_id];
                if (!shop) return null;

                const isLowestPrice = idx === 0;

                return (
                  <div
                    key={priceEntry.id}
                    className={`bg-gray-800/30 backdrop-blur-sm rounded-xl border ${
                      isLowestPrice 
                        ? 'border-green-500/50 ring-2 ring-green-500/20' 
                        : 'border-gray-700/50'
                    } overflow-hidden hover:border-indigo-500/50 transition-all duration-300`}
                  >
                    {isLowestPrice && (
                      <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 text-center">
                        <span className="text-white font-bold text-sm flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          BEST PRICE
                        </span>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Shop Name */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            {shop.name}
                            {shop.verified && (
                              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </h3>
                          {shop.featured && (
                            <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-4 pb-4 border-t border-b border-gray-700">
                        <p className="text-sm text-gray-400 mb-1">Price</p>
                        <p className={`text-3xl font-bold ${isLowestPrice ? 'text-green-400' : 'text-white'}`}>
                          {priceEntry.price.toLocaleString()}
                          <span className="text-lg text-gray-400 ml-2">LKR</span>
                        </p>
                      </div>

                      {/* Location */}
                      {shop.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-400">Location</p>
                            <p className="text-white font-medium">{shop.city}</p>
                            {shop.address && (
                              <p className="text-sm text-gray-400 mt-1">{shop.address}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-3 pt-4 border-t border-gray-700">
                        {/* Phone */}
                        {shop.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a
                              href={`tel:${shop.phone}`}
                              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                              {shop.phone}
                            </a>
                          </div>
                        )}

                        {/* Website */}
                        {shop.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a
                              href={shop.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        {/* WhatsApp Button */}
                        {shop.whatsapp && (
                          <button
                            onClick={() => openWhatsApp(
                              shop.whatsapp,
                              shop.name,
                              `${phone.brand} ${phone.model}`,
                              priceEntry.price
                            )}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-green-500/20"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span>Contact on WhatsApp</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-12 text-center">
              <Store className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No pricing information available for this phone yet.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Check back later or contact us for more details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDetailsPage;
