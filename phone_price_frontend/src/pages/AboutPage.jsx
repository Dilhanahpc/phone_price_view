import { Target, Lightbulb, Users, Award, Facebook, Instagram, Twitter, Music } from 'lucide-react';

const AboutPage = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/profile.php?id=61584418607626',
      color: 'hover:bg-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/xenovix_solutions?igsh=MmV4dG1qeHdmOWs0',
      color: 'hover:bg-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500'
    },
    {
      name: 'TikTok',
      icon: Music,
      url: 'https://www.tiktok.com/@xenovix_solutions?_r=1&_t=ZS-921VNn0oUGW',
      color: 'hover:bg-black',
      bgColor: 'bg-black'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://x.com/xenovixsolution?t=a0GipLlpPrPPn_l2oziLWA&s=09',
      color: 'hover:bg-gray-900',
      bgColor: 'bg-gray-800'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower Sri Lankan consumers with accurate, real-time smartphone pricing information, making smart purchasing decisions effortless.',
      color: 'bg-indigo-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI technology to provide personalized recommendations and instant price comparisons across trusted retailers.',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by tech enthusiasts, for tech enthusiasts. We understand your frustrations and deliver solutions that truly matter.',
      color: 'bg-pink-500'
    },
    {
      icon: Award,
      title: 'Trust & Transparency',
      description: 'Every price, every shop, every detail - verified and updated in real-time. No hidden agendas, just honest information.',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0020]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-[#0c0020]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pricera</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing how Sri Lankans discover, compare, and purchase smartphones
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-[#0c0020]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-sm font-semibold border border-indigo-500/30">
                  Powered by Xenovix Software Solutions
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Born from a real problem, built with passion
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  We're <span className="text-indigo-400 font-semibold">Xenovix Software Solutions</span> – a team of developers, designers, and tech enthusiasts who were tired of the same frustrating experience every Sri Lankan faces when buying a smartphone.
                </p>
                <p>
                  <span className="text-white font-semibold">The Problem:</span> You want to buy a phone, but where do you start? Endless Google searches, outdated forums, unreliable Facebook groups, shops with no online presence, conflicting prices, zero transparency about deals...
                </p>
                <p>
                  Hours wasted. Confusion everywhere. No single source of truth.
                </p>
                <p className="text-white font-semibold text-xl">
                  So we decided to fix it. 
                </p>
                <p>
                  <span className="text-indigo-400 font-semibold">Pricera</span> is our answer – a platform that brings together real-time prices from trusted shops across Sri Lanka, AI-powered recommendations, instant price drop alerts, and a seamless shopping experience all in one place.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gray-800/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">❌</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Before Pricera</h4>
                      <p className="text-gray-400 text-sm">Endless searching, outdated info, wasted time</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700/50 pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">With Pricera</h4>
                        <p className="text-gray-400 text-sm">Instant comparisons, verified prices, smart decisions</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mt-6">
                    <p className="text-white font-semibold text-center text-lg">
                      "Stop searching. Start finding."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-gradient-to-b from-[#0c0020] to-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What drives us
            </h2>
            <p className="text-xl text-gray-400">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0c0020]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">100+</div>
                <div className="text-indigo-100">Phones Listed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">20+</div>
                <div className="text-indigo-100">Trusted Shops</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-indigo-100">Price Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-gradient-to-b from-[#0c0020] to-gray-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Connect with us
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Follow Xenovix on social media for updates, tech news, and exclusive deals
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`relative ${social.bgColor} rounded-2xl p-8 ${social.color} transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl`}>
                    <Icon className="h-12 w-12 text-white mx-auto mb-3" />
                    <p className="text-white font-semibold">{social.name}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-12 text-gray-400">
            <p>Stay updated with the latest smartphone deals and tech insights!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to find your perfect phone?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of smart shoppers who trust Pricera for their smartphone purchases
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/compare"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:scale-105"
            >
              Compare Prices Now
            </a>
            <a
              href="/ai-picks"
              className="bg-indigo-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-900 transition-all duration-200 border-2 border-white/20 hover:scale-105"
            >
              Get AI Recommendations
            </a>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-[#0c0020] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            Built with ❤️ in Sri Lanka by <span className="text-indigo-400 font-semibold">Xenovix Software Solutions</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2025 Pricera. Making smartphone shopping smarter, one price at a time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
