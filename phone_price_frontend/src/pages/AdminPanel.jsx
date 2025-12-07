import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Store, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save,
  Search,
  Filter,
  LogOut
} from 'lucide-react';
import { phonesAPI, shopsAPI, pricesAPI } from '../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('phones'); // phones, shops, prices
  const [phones, setPhones] = useState([]);
  const [shops, setShops] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add or edit
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('adminAuth');
      sessionStorage.removeItem('adminAuthTime');
      navigate('/admin-login');
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'phones') {
        const response = await phonesAPI.getAll(0, 100);
        setPhones(response.data || []);
      } else if (activeTab === 'shops') {
        const response = await shopsAPI.getAll();
        setShops(response.data || []);
      } else if (activeTab === 'prices') {
        // Fetch prices, phones, and shops for the dropdown
        const [pricesRes, phonesRes, shopsRes] = await Promise.all([
          pricesAPI.getAll(),
          phonesAPI.getAll(0, 100),
          shopsAPI.getAll()
        ]);
        setPrices(pricesRes.data || []);
        setPhones(phonesRes.data || []);
        setShops(shopsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'phones') {
        await phonesAPI.delete(id);
      } else if (activeTab === 'shops') {
        await shopsAPI.delete(id);
      } else if (activeTab === 'prices') {
        await pricesAPI.delete(id);
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. It may be referenced by other records.');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (activeTab === 'phones') {
        if (modalMode === 'add') {
          await phonesAPI.create(formData);
        } else {
          await phonesAPI.update(currentItem.id, formData);
        }
      } else if (activeTab === 'shops') {
        if (modalMode === 'add') {
          await shopsAPI.create(formData);
        } else {
          await shopsAPI.update(currentItem.id, formData);
        }
      } else if (activeTab === 'prices') {
        // Convert string values to integers for price data
        const priceData = {
          ...formData,
          phone_id: parseInt(formData.phone_id),
          shop_id: parseInt(formData.shop_id),
          price: parseInt(formData.price),
          is_active: formData.is_active !== undefined ? formData.is_active : true
        };
        
        if (modalMode === 'add') {
          await pricesAPI.create(priceData);
        } else {
          await pricesAPI.update(currentItem.id, priceData);
        }
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Please check the form data.');
    }
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'phones') {
      return phones.filter(p => 
        p.brand?.toLowerCase().includes(term) || 
        p.model?.toLowerCase().includes(term)
      );
    } else if (activeTab === 'shops') {
      return shops.filter(s => 
        s.name?.toLowerCase().includes(term) || 
        s.city?.toLowerCase().includes(term)
      );
    }
    return prices;
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage phones, shops, and prices</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-600/20 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('phones')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
              activeTab === 'phones'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone size={20} />
            Phones
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
              activeTab === 'shops'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Store size={20} />
            Shops
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
              activeTab === 'prices'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign size={20} />
            Prices
          </button>
        </div>

        {/* Search & Add Button */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            {activeTab === 'phones' && <PhonesTable data={filteredData()} onEdit={handleEdit} onDelete={handleDelete} />}
            {activeTab === 'shops' && <ShopsTable data={filteredData()} onEdit={handleEdit} onDelete={handleDelete} />}
            {activeTab === 'prices' && <PricesTable data={prices} onEdit={handleEdit} onDelete={handleDelete} phones={phones} shops={shops} />}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          mode={modalMode}
          type={activeTab}
          item={currentItem}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          phones={phones}
          shops={shops}
        />
      )}
    </div>
  );
};

// Phones Table Component
const PhonesTable = ({ data, onEdit, onDelete }) => (
  <table className="w-full">
    <thead className="bg-white/5">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Brand</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Model</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Release Year</th>
        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-white/5">
      {data.map((phone) => (
        <tr key={phone.id} className="hover:bg-white/5 transition-colors">
          <td className="px-6 py-4 text-white">{phone.brand}</td>
          <td className="px-6 py-4 text-white">{phone.model}</td>
          <td className="px-6 py-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300">
              {phone.category}
            </span>
          </td>
          <td className="px-6 py-4 text-gray-400">{phone.release_year || 'N/A'}</td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(phone)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(phone.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Shops Table Component
const ShopsTable = ({ data, onEdit, onDelete }) => {
  const openWhatsApp = (whatsappNumber) => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  return (
    <table className="w-full">
      <thead className="bg-white/5">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">City</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Contact</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">WhatsApp</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.map((shop) => (
          <tr key={shop.id} className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-white font-medium">{shop.name}</td>
            <td className="px-6 py-4 text-gray-400">{shop.city || 'N/A'}</td>
            <td className="px-6 py-4 text-gray-400">{shop.contact_number || 'N/A'}</td>
            <td className="px-6 py-4">
              {shop.whatsapp ? (
                <button
                  onClick={() => openWhatsApp(shop.whatsapp)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat
                </button>
              ) : (
                <span className="text-gray-500 text-xs">No WhatsApp</span>
              )}
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                {shop.is_verified && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                    Verified
                  </span>
                )}
                {shop.is_featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                    Featured
                  </span>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(shop)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(shop.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Prices Table Component
const PricesTable = ({ data, onEdit, onDelete, phones, shops }) => {
  const getPhoneName = (phoneId) => {
    const phone = phones.find(p => p.id === phoneId);
    return phone ? `${phone.brand} ${phone.model}` : `Phone #${phoneId}`;
    };

  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : `Shop #${shopId}`;
  };

  return (
    <table className="w-full">
      <thead className="bg-white/5">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phone</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Shop</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.map((price) => (
          <tr key={price.id} className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-white">{getPhoneName(price.phone_id)}</td>
            <td className="px-6 py-4 text-gray-400">{getShopName(price.shop_id)}</td>
            <td className="px-6 py-4 text-white font-semibold">
              {price.currency} {price.price?.toLocaleString()}
            </td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                price.is_active 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {price.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(price)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(price.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Modal Component
const Modal = ({ mode, type, item, onSave, onClose, phones, shops }) => {
  const [formData, setFormData] = useState(item || {});

  // Update formData when item changes (important for edit mode)
  useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'add' ? 'Add New' : 'Edit'} {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === 'phones' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category || 'midrange'}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="budget">Budget</option>
                  <option value="midrange">Midrange</option>
                  <option value="flagship">Flagship</option>
                  <option value="gaming">Gaming</option>
                  <option value="foldable">Foldable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/phone-image.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste image URL from Unsplash, Imgur, or any direct image link
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
                <input
                  type="number"
                  name="release_year"
                  value={formData.release_year || new Date().getFullYear()}
                  onChange={handleChange}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
            </>
          )}

          {type === 'shops' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number || ''}
                  onChange={handleChange}
                  placeholder="0771234567"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp || ''}
                  onChange={handleChange}
                  placeholder="94771234567 (include country code without +)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter number with country code (e.g., 94771234567 for Sri Lanka)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified || false}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-300">Verified Shop</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured || false}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-300">Featured Shop</span>
                </label>
              </div>
            </>
          )}

          {type === 'prices' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <select
                  name="phone_id"
                  value={formData.phone_id || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="">Select a phone</option>
                  {phones.map(phone => (
                    <option key={phone.id} value={phone.id}>
                      {phone.brand} {phone.model}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Shop</label>
                <select
                  name="shop_id"
                  value={formData.shop_id || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="">Select a shop</option>
                  {shops.map(shop => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency || 'LKR'}
                  onChange={handleChange}
                  required
                  maxLength="3"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active !== undefined ? formData.is_active : true}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Active Price</span>
              </label>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              <Save size={20} />
              {mode === 'add' ? 'Create' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
