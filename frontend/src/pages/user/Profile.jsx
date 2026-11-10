import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { FITNESS_GOALS } from '../../utils/constants';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
    fitnessGoals: user?.fitnessGoals || 'General Fitness'
  });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || '');
  const fileInputRef = useRef(null);

  // 📤 Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return toast.error('Please select an image file');
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image must be less than 5MB');
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser(data.data);
      setPreviewImage(data.data.profilePicture);
      toast.success('Profile picture updated! 🎉');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
      // Revert preview on error
      setPreviewImage(user?.profilePicture || '');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 🗑️ Remove profile picture
  const handleRemoveImage = async () => {
    if (!confirm('Remove profile picture?')) return;
    setUploading(true);
    try {
      // Set to default avatar
      const { data } = await api.put('/auth/profile', {
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1/default-avatar'
      });
      updateUser(data.data);
      setPreviewImage(data.data.profilePicture);
      toast.success('Profile picture removed');
    } catch {
      toast.error('Failed to remove');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', {
        ...form,
        age: Number(form.age) || undefined,
        height: Number(form.height) || undefined,
        weight: Number(form.weight) || undefined
      });
      updateUser(data.data);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success('Password changed');
      setPasswords({ current: '', new: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">👤 Profile</h1>

      {/* PROFILE PICTURE UPLOAD CARD */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Profile Picture</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-4 ring-primary-500/20">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={user?.fullName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1/default-avatar';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {user?.fullName?.charAt(0).toUpperCase() || '👤'}
                </div>
              )}
            </div>

            {/* Overlay on hover */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CameraIcon className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <PhotoIcon className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>

              {previewImage && !previewImage.includes('default-avatar') && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="btn-secondary text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400">
              JPG, PNG or WebP • Max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFO CARD */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Personal Info</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                className="input"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Gender</label>
              <select
                className="input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input
                type="number"
                className="input"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="input"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Fitness Goal</label>
            <select
              className="input"
              value={form.fitnessGoals}
              onChange={(e) => setForm({ ...form, fitnessGoals: e.target.value })}
            >
              {FITNESS_GOALS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* PASSWORD CARD */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              required
              className="input"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              required
              className="input"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}