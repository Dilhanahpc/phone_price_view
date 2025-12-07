import { useState, useEffect } from 'react';
import { phonesAPI, pricesAPI, shopsAPI, getCategories } from '../services/api';
import { Sparkles, SlidersHorizontal, TrendingUp, Award, Zap } from 'lucide-react';
import PhoneCard from '../components/PhoneCard';

const AIPicksPage = () => {
  const [phones, setPhones] = useState([]);
  const [phonesWithPrices, setPhonesWithPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['all', ...getCategories()];

  useEffect(() => {
    fetchPhones();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, sortBy, phones]);

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const response = await phonesAPI.getAll(0, 100);
      setPhones(response.data || []);
    } catch (error) {
      console.error('Error fetching phones:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      let filtered = phones;

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(phone => phone.category === selectedCategory);
      }

      // Fetch all shops first
      const shopsRes = await shopsAPI.getAll();
      const shopsData = shopsRes.data || [];
      
      // Create shop lookup map
      const shopMap = {};
      shopsData.forEach(shop => {
        shopMap[shop.id] = shop;
      });

      // Fetch prices for filtered phones and enrich with shop details
      const phonesWithPricesData = await Promise.all(
        filtered.map(async (phone) => {
          try {
            const pricesResponse = await pricesAPI.getAll(phone.id);
            const enrichedPrices = (pricesResponse.data || []).map(price => ({
              ...price,
              shopDetails: shopMap[price.shop_id] || null
            }));
            const minPrice = enrichedPrices.length > 0 ? Math.min(...enrichedPrices.map(p => p.price)) : 0;
            
            return {
              ...phone,
              prices: enrichedPrices,
              minPrice
            };
          } catch (err) {
            return { ...phone, prices: [], minPrice: 0 };
          }
        })
      );

      // Filter by price range
      let priceFiltered = phonesWithPricesData.filter(phone => {
        if (phone.minPrice === 0) return true; // Include phones without prices
        return phone.minPrice >= priceRange.min && phone.minPrice <= priceRange.max;
      });

      // Sort
      switch (sortBy) {
        case 'price-low':
          priceFiltered.sort((a, b) => (a.minPrice || Infinity) - (b.minPrice || Infinity));
          break;
        case 'price-high':
          priceFiltered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
          break;
        case 'newest':
          priceFiltered.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
          break;
        case 'recommended':
        default:
          // AI recommendation logic (simplified: prioritize flagship/gaming with good prices)
          priceFiltered.sort((a, b) => {
            const scoreA = getRecommendationScore(a);
            const scoreB = getRecommendationScore(b);
            return scoreB - scoreA;
          });
          break;
      }

      setPhonesWithPrices(priceFiltered);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const getRecommendationScore = (phone) => {
    let score = 0;
    
    // Category scoring
    const categoryScores = {
      flagship: 10,
      gaming: 9,
      foldable: 8,
      midrange: 7,
      budget: 6
    };
    score += categoryScores[phone.category] || 5;

    // Recent phones get bonus points
    const currentYear = new Date().getFullYear();
    if (phone.release_year && phone.release_year >= currentYear - 1) {
      score += 5;
    } else if (phone.release_year && phone.release_year >= currentYear - 2) {
      score += 3;
    }

    // Phones with competitive prices get bonus
    if (phone.prices && phone.prices.length > 2) {
      score += 3; // Available in multiple shops
    }

    return score;
  };

  const recommendations = [
    {
      icon: Award,
      title: 'Best Overall',
      description: 'Top-rated phones combining performance, features, and value',
      gradient: 'from-yellow-500 to-orange-500',
      filter: () => setPhonesWithPrices(prev => [...prev].sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a)))
    },
    {
      icon: Zap,
      title: 'Best Performance',
      description: 'Flagship and gaming phones with cutting-edge specs',
      gradient: 'from-red-500 to-pink-500',
      filter: () => {
        setSelectedCategory('all');
        const flagshipGaming = phonesWithPrices.filter(p => p.category === 'flagship' || p.category === 'gaming');
        setPhonesWithPrices(flagshipGaming.sort((a, b) => (b.release_year || 0) - (a.release_year || 0)));
      }
    },
    {
      icon: TrendingUp,
      title: 'Best Value',
      description: 'Midrange phones offering great features for the price',
      gradient: 'from-green-500 to-teal-500',
      filter: () => {
        setSelectedCategory('midrange');
        setSortBy('price-low');
      }
    },
    {
      icon: Sparkles,
      title: 'Budget Picks',
      description: 'Affordable phones that don\'t compromise on essentials',
      gradient: 'from-blue-500 to-cyan-500',
      filter: () => {
        setSelectedCategory('budget');
        setSortBy('recommended');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Recommendations</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Smart Phone <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Picks</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Let AI match you with the perfect phone based on your preferences and budget
          </p>
        </div>

        {/* Recommendation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <button
                key={index}
                onClick={rec.filter}
                className="group text-left bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${rec.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{rec.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{rec.description}</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Filters</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Price Range (LKR)
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{priceRange.min.toLocaleString()}</span>
                  <span className="text-white font-semibold">{priceRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="recommended">AI Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-gray-400">Loading AI recommendations...</p>
          </div>
        ) : phonesWithPrices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No phones found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange({ min: 0, max: 1000000 });
                setSortBy('recommended');
              }}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {phonesWithPrices.length} Recommended Phone{phonesWithPrices.length !== 1 ? 's' : ''}
              </h2>
              <div className="text-sm text-gray-400">
                Sorted by: <span className="text-indigo-400 font-medium">{sortBy === 'recommended' ? 'AI Recommendation' : sortBy.replace('-', ' ')}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phonesWithPrices.map((phone) => (
                <PhoneCard key={phone.id} phone={phone} prices={phone.prices} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPicksPage;
