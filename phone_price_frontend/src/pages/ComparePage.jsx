import { useState, useEffect } from 'react';
import { phonesAPI, pricesAPI, shopsAPI, getCategories } from '../services/api';
import { Search, X, ArrowLeftRight, TrendingDown, Store, MessageCircle } from 'lucide-react';
import PhoneCard from '../components/PhoneCard';

const ComparePage = () => {
  const [allPhones, setAllPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [shops, setShops] = useState([]);

  const categories = ['all', ...getCategories()];

  const openWhatsApp = (whatsappNumber, shopName, phoneName, price) => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      const message = `Hi ${shopName}! I'm interested in the ${phoneName} priced at ${price.toLocaleString()} LKR. Is this still available?`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  useEffect(() => {
    filterPhones();
  }, [searchQuery, selectedCategory, allPhones]);

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const response = await phonesAPI.getAll(0, 100);
      const phones = response.data || [];
      setAllPhones(phones);
      setFilteredPhones(phones);
    } catch (error) {
      console.error('Error fetching phones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPhones = () => {
    let filtered = allPhones;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(phone => phone.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(phone =>
        phone.brand.toLowerCase().includes(query) ||
        phone.model.toLowerCase().includes(query)
      );
    }

    setFilteredPhones(filtered);
  };

  const togglePhoneSelection = (phone) => {
    if (selectedPhones.find(p => p.id === phone.id)) {
      setSelectedPhones(selectedPhones.filter(p => p.id !== phone.id));
    } else if (selectedPhones.length < 3) {
      setSelectedPhones([...selectedPhones, phone]);
    }
  };

  const startComparison = async () => {
    if (selectedPhones.length < 2) return;

    try {
      setComparing(true);
      
      // Fetch all shops first
      const shopsRes = await shopsAPI.getAll();
      const shopsData = shopsRes.data || [];
      setShops(shopsData);
      
      // Create shop lookup map for faster access
      const shopMap = {};
      shopsData.forEach(shop => {
        shopMap[shop.id] = shop;
      });

      const comparisonPromises = selectedPhones.map(async (phone) => {
        const pricesRes = await pricesAPI.getAll(phone.id);
        // Enrich prices with shop details
        const enrichedPrices = (pricesRes.data || []).map(price => ({
          ...price,
          shopDetails: shopMap[price.shop_id] || null
        }));
        return {
          phone,
          prices: enrichedPrices
        };
      });

      const results = await Promise.all(comparisonPromises);
      setComparisonData(results);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setComparing(false);
    }
  };

  const clearComparison = () => {
    setSelectedPhones([]);
    setComparisonData([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Compare <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Phones</span>
          </h1>
          <p className="text-xl text-gray-400">
            Select up to 3 phones to compare prices and features side by side
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Phones Bar */}
        {selectedPhones.length > 0 && (
          <div className="mb-8 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Selected Phones ({selectedPhones.length}/3)
              </h3>
              <button
                onClick={clearComparison}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedPhones.map((phone) => (
                <div
                  key={phone.id}
                  className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
                >
                  <span className="text-white font-medium">{phone.brand} {phone.model}</span>
                  <button
                    onClick={() => togglePhoneSelection(phone)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={startComparison}
              disabled={selectedPhones.length < 2 || comparing}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {comparing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Comparing...</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="h-5 w-5" />
                  <span>Compare Selected Phones</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Comparison Results</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonData.map(({ phone, prices }) => {
                const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null;
                const lowestPriceShop = prices.find(p => p.price === minPrice);

                return (
                  <div key={phone.id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{phone.brand}</h3>
                    <p className="text-gray-400 mb-4">{phone.model}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Category</span>
                        <span className="text-white font-medium capitalize">{phone.category}</span>
                      </div>
                      {phone.release_year && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Release Year</span>
                          <span className="text-white font-medium">{phone.release_year}</span>
                        </div>
                      )}
                      {minPrice && (
                        <>
                          <div className="flex items-center justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-400">Best Price</span>
                            <span className="text-indigo-400 font-bold text-lg">
                              {minPrice.toLocaleString()} LKR
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-gray-400">Available Shops</span>
                            <span className="text-white font-medium">{prices.length}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {prices.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          Price comparison
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {prices.sort((a, b) => a.price - b.price).map((priceEntry, idx) => (
                            <div key={idx} className={`flex items-center justify-between gap-2 p-2 rounded ${idx === 0 ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800/50'}`}>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium truncate ${idx === 0 ? 'text-green-400' : 'text-gray-300'}`}>
                                    {priceEntry.shopDetails?.name || `Shop #${priceEntry.shop_id}`}
                                  </span>
                                  {priceEntry.shopDetails?.verified && (
                                    <svg className="h-4 w-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-lg font-bold ${idx === 0 ? 'text-green-400' : 'text-gray-200'}`}>
                                    {priceEntry.price.toLocaleString()} LKR
                                  </span>
                                  {priceEntry.shopDetails?.whatsapp && (
                                    <button
                                      onClick={() => openWhatsApp(
                                        priceEntry.shopDetails.whatsapp,
                                        priceEntry.shopDetails.name,
                                        `${phone.brand} ${phone.model}`,
                                        priceEntry.price
                                      )}
                                      className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                                      title={`Contact ${priceEntry.shopDetails.name} on WhatsApp`}
                                    >
                                      <MessageCircle className="h-3 w-3" />
                                      <span>Chat</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phone Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-gray-400">Loading phones...</p>
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No phones found matching your criteria</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Select phones to compare ({filteredPhones.length} available)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhones.map((phone) => {
                const isSelected = selectedPhones.find(p => p.id === phone.id);
                const canSelect = selectedPhones.length < 3 || isSelected;

                return (
                  <div
                    key={phone.id}
                    onClick={() => canSelect && togglePhoneSelection(phone)}
                    className={`relative cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 scale-95'
                        : canSelect
                        ? 'hover:scale-105'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 z-10 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        ✓
                      </div>
                    )}
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-indigo-500/50 transition-all">
                      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                        <img
                          src={
                            phone.image_url && phone.image_url !== 'string' && phone.image_url.length > 10
                              ? phone.image_url
                              : 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format&fit=crop'
                          }
                          alt={`${phone.brand} ${phone.model}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-sm border border-white/10 capitalize">
                          {phone.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white">{phone.brand}</h3>
                        <p className="text-gray-400 text-sm">{phone.model}</p>
                        {phone.release_year && (
                          <p className="text-xs text-gray-500 mt-1">{phone.release_year}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
