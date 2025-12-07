import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Filter, TrendingUp, Award, Edit2, X, Check } from 'lucide-react';
import { phonesAPI } from '../services/api';
import { reviewsAPI } from '../services/reviewsAPI';

const ReviewsPage = () => {
  const [phones, setPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total_reviews: 0, average_rating: 0, rating_distribution: {} });
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: '',
    phoneId: null
  });
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [currentUserName, setCurrentUserName] = useState('');

  // Mock reviews data - In production, this would come from your backend
  const mockReviews = [
    {
      id: 1,
      phoneId: 1,
      userName: 'Kasun Perera',
      rating: 5,
      comment: 'Excellent phone! Camera quality is outstanding and battery lasts all day. Highly recommended for photography enthusiasts.',
      date: '2025-12-05',
      helpful: 24,
      phoneName: 'Samsung Galaxy S24'
    },
    {
      id: 2,
      phoneId: 1,
      userName: 'Nimal Silva',
      rating: 4,
      comment: 'Great performance and display. Only downside is it gets a bit warm during heavy gaming sessions.',
      date: '2025-12-03',
      helpful: 15,
      phoneName: 'Samsung Galaxy S24'
    },
    {
      id: 3,
      phoneId: 2,
      userName: 'Ayesha Fernando',
      rating: 5,
      comment: 'Best iPhone yet! The camera is incredible, and the battery life is much better than previous models.',
      date: '2025-12-01',
      helpful: 32,
      phoneName: 'iPhone 15 Pro Max'
    }
  ];

  useEffect(() => {
    fetchPhones();
    fetchReviews();
    fetchStats();
  }, []);

  const fetchPhones = async () => {
    try {
      const response = await phonesAPI.getAll(0, 50);
      setPhones(response.data || []);
    } catch (error) {
      console.error('Error fetching phones:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getAll();
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedPhone || !newReview.userName || !newReview.comment) {
      alert('Please fill all fields and select a phone');
      return;
    }

    try {
      const reviewData = {
        phone_id: selectedPhone.id,
        user_name: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment
      };

      await reviewsAPI.create(reviewData);
      
      // Refresh reviews and stats
      await fetchReviews();
      await fetchStats();
      
      // Reset form
      setNewReview({ userName: '', rating: 5, comment: '', phoneId: null });
      setSelectedPhone(null);
      
      alert('Review submitted successfully! ✨');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await reviewsAPI.incrementHelpful(reviewId);
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
    setCurrentUserName(review.user_name);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: '' });
    setCurrentUserName('');
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      await reviewsAPI.update(
        reviewId,
        currentUserName,
        editForm.rating,
        editForm.comment
      );
      
      // Refresh reviews
      await fetchReviews();
      
      // Reset edit state
      setEditingReview(null);
      setEditForm({ rating: 5, comment: '' });
      setCurrentUserName('');
      
      alert('Review updated successfully! ✨');
    } catch (error) {
      console.error('Error updating review:', error);
      if (error.response?.status === 403) {
        alert('You can only edit your own reviews!');
      } else {
        alert('Failed to update review. Please try again.');
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  }).sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const averageRating = stats.average_rating || 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: stats.rating_distribution?.[rating] || 0,
    percentage: stats.total_reviews > 0 
      ? ((stats.rating_distribution?.[rating] || 0) / stats.total_reviews) * 100 
      : 0
  }));

  return (
    <div className="min-h-screen bg-[#0c0020]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-[#0c0020]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Reviews</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real experiences from real users. Share your phone journey and help others make informed decisions.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">{stats.total_reviews}</div>
              <div className="text-gray-400">Total Reviews</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-yellow-400">{averageRating}</span>
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl font-bold text-green-400">{phones.length}+</div>
              <div className="text-gray-400">Phones Reviewed</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Submit Review Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-indigo-400" />
                  Share Your Experience
                </h2>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={newReview.userName}
                      onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Select Phone
                    </label>
                    <select
                      value={selectedPhone?.id || ''}
                      onChange={(e) => {
                        const phone = phones.find(p => p.id === parseInt(e.target.value));
                        setSelectedPhone(phone);
                      }}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Choose a phone</option>
                      {phones.map(phone => (
                        <option key={phone.id} value={phone.id}>
                          {phone.brand} {phone.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= newReview.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Share your experience with this phone..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/50"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Rating Distribution */}
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-gray-400">{rating}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Reviews List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-indigo-400" />
                  <span className="text-white font-semibold">Filter by:</span>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {loading ? (
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-lg">Loading reviews...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No reviews found. Be the first to share your experience!</p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                  >
                    {editingReview === review.id ? (
                      /* Edit Mode */
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{review.user_name}</h3>
                            <p className="text-sm text-indigo-400">{review.phone_name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(review.id)}
                              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                              title="Save changes"
                            >
                              <Check className="h-5 w-5 text-white" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              title="Cancel editing"
                            >
                              <X className="h-5 w-5 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Edit Rating */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditForm({ ...editForm, rating: star })}
                                className="focus:outline-none hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= editForm.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Edit Comment */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Comment</label>
                          <textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            placeholder="Edit your review..."
                          />
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{review.user_name}</h3>
                            <p className="text-sm text-indigo-400">{review.phone_name}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                          <button 
                            onClick={() => handleHelpful(review.id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors hover:scale-105 transform"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">Helpful ({review.helpful})</span>
                          </button>
                          
                          {/* Edit button - ask for user name verification */}
                          <button
                            onClick={() => {
                              const userName = prompt('Enter your name to edit this review:');
                              if (userName && userName.trim() === review.user_name) {
                                handleEditClick(review);
                              } else if (userName) {
                                alert('You can only edit your own reviews!');
                              }
                            }}
                            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors hover:scale-105 transform"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="text-sm">Edit</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
