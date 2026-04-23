import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Shield, Key, Bell, Camera } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';


export default function Profile() {
  const { user } = useAuth();
  const nameParts = (user?.fullname || 'User Account').split(' ');
  const initialFirstName = nameParts[0] || 'User';
  const initialLastName = nameParts.slice(1).join(' ') || 'Account';
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user?.email || '',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently',
    bio: 'Passionate investor and tech enthusiast. Always looking for the next big opportunity in the stock market.',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your personal information and account settings</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2962FF] text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isEditing ? (
            <>Save Changes</>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-white shadow-lg">
                {userInfo.firstName[0]}{userInfo.lastName[0]}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-gray-200 dark:bg-gray-800 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userInfo.firstName} {userInfo.lastName}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Registered Member</p>

            <div className="w-full pt-4 border-t border-gray-300 dark:border-gray-800 space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm">Joined {userInfo.joinedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">Email Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4" />
                <span>Change Password</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4" />
                <span>Two-Factor Auth</span>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Enabled</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.firstName}
                    onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
                    <User className="w-4 h-4 text-slate-500" />
                    {userInfo.firstName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.lastName}
                    onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
                    <User className="w-4 h-4 text-slate-500" />
                    {userInfo.lastName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {userInfo.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-500" />
                    {userInfo.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.location}
                    onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {userInfo.location}
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Bio</label>
                {isEditing ? (
                  <textarea
                    value={userInfo.bio}
                    onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                ) : (
                  <div className="text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/50 px-4 py-3 rounded-lg text-sm leading-relaxed">
                    {userInfo.bio}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily market summaries</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
