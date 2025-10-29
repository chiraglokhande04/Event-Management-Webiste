
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Header from '../components/Header';
import { 
  User, Mail, Phone, Calendar, MapPin, Edit, Save, X, 
  Camera, Facebook, Twitter, Instagram, Loader 
} from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    mobile: '',
    bio: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      
      if (!userData.id) {
        navigate('/login');
        return;
      }

      const response = await API.get(`/user/profile/${userData.id}`);
      console.log('Fetched profile data:', response.data);
      setUser(response.data.userData);
      console.log('response data user:', response.data.userData);

      setFormData({
        username: response.data.userData.username || '',
        fullName: response.data.userData.fullName || '',
        email: response.data.userData.email || '',
        mobile: response.data.userData.mobile || '',
        bio: response.data.userData.bio || '',
        socialLinks: {
          facebook:response.data.userData.socialLinks?.facebook || '',
          twitter: response.data.userData.socialLinks?.twitter || '',
          instagram: response.data.userData.socialLinks?.instagram || ''
        }
      });
      setPreviewImage(response.data.userData.profilePicture || null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
      
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await API.put(`/user/profile/${userData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(response.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Update localStorage
      const updatedUser = { ...userData, username: formData.username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user.username || '',
      fullName: user.fullName || '',
      email: user.email || '',
      mobile: user.mobile || '',
      bio: user.bio || '',
      socialLinks: {
        facebook: user.socialLinks?.facebook || '',
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || ''
      }
    });
    setPreviewImage(user.profilePicture || null);
    setProfilePicture(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.username}</h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                {user?.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ Verified Account
                  </span>
                )}
              </div>

              {/* Edit Button */}
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                    >
                      {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-center">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Edit className="w-4 h-4 mr-2" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                />
                <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
                
                <div className="space-y-4">
                  {/* Facebook */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="social_facebook"
                      value={formData.socialLinks.facebook}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://facebook.com/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="social_twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://twitter.com/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="social_instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://instagram.com/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-800">{user?.hostedEvents?.length || 0}</p>
              <p className="text-gray-600">Hosted Events</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-800">{user?.attendedEvents?.length || 0}</p>
              <p className="text-gray-600">Attended Events</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-800">{user?.registeredEvents?.length || 0}</p>
              <p className="text-gray-600">Registered Events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
