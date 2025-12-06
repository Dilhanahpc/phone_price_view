import { useState } from 'react';
import { pricesAPI } from '../services/api';
import { DollarSign, Search, Loader, Store, Smartphone } from 'lucide-react';

const PriceSearchPage = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!minPrice || !maxPrice) {
      alert('Please enter both minimum and maximum price');
      return;
    }

    if (parseInt(minPrice) > parseInt(maxPrice)) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }

    try {
      setLoading(true);
      const response = await pricesAPI.getByRange(parseInt(minPrice), parseInt(maxPrice));
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error searching prices:', error);
      alert('Error searching prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Search by Price Range</h1>
          <p className="text-xl text-purple-100">Find phones within your budget</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Price (LKR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="e.g., 50000"
                  className="input-field pl-12"
                />
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Price (LKR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g., 100000"
                  className="input-field pl-12"
                />
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button onClick={handleSearch} className="btn-primary w-full">
                <Search className="inline-block h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-12 w-12 text-purple-600 animate-spin" />
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {results.length} Result{results.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No phones found in this price range.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {results.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
                            <Smartphone className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {result.phone?.brand} {result.phone?.model}
                            </h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <Store className="h-4 w-4 mr-2" />
                              <span>{result.shop?.name}</span>
                              {result.shop?.city && (
                                <span className="ml-2 text-gray-400">• {result.shop.city}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-600">
                          {result.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{result.currency}</p>
                        {result.is_active && (
                          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PriceSearchPage;
