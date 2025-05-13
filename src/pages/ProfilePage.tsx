import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, LogOut, Camera } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      
      <div className="space-y-6">
        {/* Profile Overview */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-semibold border-4 border-white shadow-lg">
                  {formData.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconLeft={<Settings size={16} />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconLeft={<LogOut size={16} />}
                  className="text-danger-600 hover:bg-danger-50 hover:border-danger-300"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Edit Profile Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Edit Profile</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  disabled
                  helper="Email cannot be changed"
                />
                
                <Input
                  label="Profile Picture URL"
                  name="profilePicture"
                  value={formData.profilePicture || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  fullWidth
                  icon={<Camera size={18} />}
                  helper="Enter a URL for your profile picture"
                />
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
        
        {/* Account Information */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Account Information</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">January 1, 2025</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Subscription</p>
              <p className="font-medium">Free Plan</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Connected Devices</p>
              <div className="flex items-center mt-1">
                <div className="w-8 h-8 rounded-full bg-complementary-100 flex items-center justify-center text-complementary-600 mr-2">
                  <User size={16} />
                </div>
                <span>No devices connected</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Privacy Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates and reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-gray-500">Allow others to see your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Share Workout Data</p>
                <p className="text-sm text-gray-500">Share workout data with partners</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;