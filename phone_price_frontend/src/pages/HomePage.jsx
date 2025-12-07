import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { phonesAPI, pricesAPI, shopsAPI, getTrendingPhones } from '../services/api';
import { Search, Sparkles, TrendingUp, MessageCircle, ArrowRight } from 'lucide-react';
import PhoneCard from '../components/PhoneCard';
import SubscriptionModal from '../components/SubscriptionModal';
// Local assets
import iphoneLineupImg from '../assets/img1.jpeg';
import heroCoverImg from '../assets/img2.jpeg';
import samsungLogo from '../assets/samsung-logo.png';
import appleLogo from '../assets/apple-logo.png';
import xiaomiLogo from '../assets/xiaomi-logo.png';
import oneplusLogo from '../assets/oneplus-logo.png';
import oppoLogo from '../assets/oppo-logo.png';
import vivoLogo from '../assets/vivo-logo.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [trendingPhones, setTrendingPhones] = useState([]);
  const [phonesWithPrices, setPhonesWithPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroImage, setHeroImage] = useState(heroCoverImg);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch trending phones
      const trending = await getTrendingPhones(6);
      setTrendingPhones(trending);

      // Fetch all shops first
      const shopsRes = await shopsAPI.getAll();
      const shopsData = shopsRes.data || [];
      
      // Create shop lookup map
      const shopMap = {};
      shopsData.forEach(shop => {
        shopMap[shop.id] = shop;
      });

      // Fetch phones with their prices for the preview section
      const phonesResponse = await phonesAPI.getAll(0, 6);
      const phones = phonesResponse.data || [];
      
      // Fetch prices for each phone and enrich with shop details
      const phonesWithPricesData = await Promise.all(
        phones.map(async (phone) => {
          try {
            const pricesResponse = await pricesAPI.getAll(phone.id);
            const enrichedPrices = (pricesResponse.data || []).map(price => ({
              ...price,
              shopDetails: shopMap[price.shop_id] || null
            }));
            return {
              ...phone,
              prices: enrichedPrices
            };
          } catch (err) {
            console.warn(`Could not fetch prices for phone ${phone.id}:`, err);
            return { ...phone, prices: [] };
          }
        })
      );
      
      setPhonesWithPrices(phonesWithPricesData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load phone data. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0020]">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-[#0c0020]">
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 max-w-2xl">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                Your next phone,
                <br />
                <span className="text-indigo-400">
                  reimagined
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-xl font-normal">
                Explore, compare, and discover the perfect smartphone for you. Get real-time prices, specs, and AI-powered picks always fresh, always tailored. Welcome to the future of phone shopping in Sri Lanka.
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <button 
                  onClick={() => navigate('/compare')}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/50 hover:shadow-xl hover:shadow-indigo-600/60 hover:scale-[1.02]"
                >
                  Compare
                </button>
                <button 
                  onClick={() => navigate('/ai-picks')}
                  className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  Ask AI
                </button>
              </div>
            </div>

            {/* Right Image - Phone with dramatic lighting */}
            <div className="relative flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-[1200px] lg:max-w-[1400px]">
                {/* Dramatic blue glow emanating from phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-500/30 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/40 rounded-full blur-[80px]"></div>
                
                {/* Phone image with soft fade at bottom */}
                <div className="relative z-10">
                  <img 
                    src={heroCoverImg}
                    alt="Modern smartphone"
                    className="w-full h-auto drop-shadow-2xl rounded-3xl"
                    style={{ 
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = heroCoverImg;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partnered with tomorrow's tech leaders
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Meet the innovators powering your smarter phone choices. We team up with top brands to bring you the best prices, trusted reviews, and a seamless, future-ready experience so you always stay ahead of the curve.
            </p>
          </div>

          {/* Brand Logos */}
          <div className="grid grid-cols-3 gap-8 items-center max-w-4xl mx-auto">
              {/* Row 1 */}
              <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                <img 
                  src={samsungLogo} 
                  alt="Samsung" 
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                <img 
                  src={appleLogo} 
                  alt="Apple" 
                  className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                <img 
                  src={xiaomiLogo} 
                  alt="Xiaomi" 
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                <img 
                  src={oneplusLogo} 
                  alt="OnePlus" 
                  className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                <img 
                  src={oppoLogo} 
                  alt="Oppo" 
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                <img 
                  src={vivoLogo} 
                  alt="Vivo" 
                  className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0c0020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Next-gen phone shopping, reimagined
            </h2>
            <p className="text-xl text-gray-400">
              Discover the smartest way to shop for smartphones in Sri Lanka. Instantly compare prices, specs, and reviews plus get AI-powered recommendations tailored just for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: 'Instant price comparison',
                description: 'Compare real-time prices from trusted shops in seconds. Skip the hassle—see the best deals, always up to date.',
                color: 'bg-blue-500'
              },
              {
                icon: TrendingUp,
                title: 'Live price tracking',
                description: 'Monitor price drops with dynamic charts and instant alerts. Stay ahead and never miss a deal.',
                color: 'bg-purple-500'
              },
              {
                icon: Sparkles,
                title: 'AI-powered recommendations',
                description: 'Let smart AI match you with phones that fit your style, budget, and needs. Find your perfect device, effortlessly.',
                color: 'bg-indigo-500'
              },
              {
                icon: MessageCircle,
                title: 'Specs, ratings, and reviews',
                description: 'Explore detailed specs, user ratings, and real feedback. Make confident choices with all the info you need.',
                color: 'bg-pink-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Phones Preview */}
      <section className="py-20 bg-[#0c0020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-white">
                Your next phone, discovered today
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Dive into the future of smartphones with real-time price drops, trending models, and expert tips. Compare, save, and get AI-powered picks tailored to your style and budget right here, right now.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "This week's hottest phones", category: 'Trends', image: iphoneLineupImg },
                { title: 'Find your perfect device', category: 'Guides', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400' },
                { title: 'Smart picks, powered by AI', category: 'Insights', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400' },
                { title: 'Top deals in Sri Lanka', category: 'Deals', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400' }
              ].map((item, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-3 bg-[#0c0020]">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80&auto=format&fit=crop'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  <p className="text-xs text-indigo-400 font-semibold mb-1">{item.category}</p>
                  <h3 className="text-white font-bold">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Phones from Backend */}
      {error && (
        <section className="py-12 bg-[#0c0020]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-red-300 mb-2">⚠️ {error}</p>
              <p className="text-sm text-red-400">Make sure the backend server is running at http://localhost:8000</p>
              <button 
                onClick={fetchData}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <section className="py-20 bg-[#0c0020]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
              <p className="text-gray-400">Loading phones from backend...</p>
            </div>
          </div>
        </section>
      ) : phonesWithPrices.length > 0 && (
        <section className="py-20 bg-[#0c0020]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Latest phones from our database
                </h2>
                <p className="text-gray-400">
                  Live data from the backend with real-time pricing
                </p>
              </div>
              <button 
                onClick={() => navigate('/compare')}
                className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phonesWithPrices.map((phone) => (
                <PhoneCard key={phone.id} phone={phone} prices={phone.prices} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Never miss a price drop
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get instant email alerts when your favorite phones go on sale. Be the first to know about price drops, new releases, and exclusive deals delivered straight to your inbox.
          </p>
          <button 
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:scale-105"
          >
            Get in Touch
          </button>
        </div>
      </section>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)} 
      />

      {/* Footer */}
      <footer className="bg-[#0c0020] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-white p-1.5 rounded-lg">
                  <Search className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-lg font-bold text-white">PRICERA</span>
              </div>
              <p className="text-gray-400 text-sm">
                Smarter phone choices, brighter tech journeys.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Compare prices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI picks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Price alerts</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">support@pricera.lk</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-wrap justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Pricera. All rights reserved.</p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Dribbble</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
