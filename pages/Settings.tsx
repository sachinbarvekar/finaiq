
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-slate-700">Application Settings</h2>
        <p className="text-slate-500 mt-2">Manage your application preferences, user roles, and integrations here.</p>
        <div className="mt-6 border-t pt-6 space-y-4">
            <div className="flex justify-between items-center">
                <p className="font-medium text-slate-700">Enable Email Notifications</p>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
             <div className="flex justify-between items-center">
                <p className="font-medium text-slate-700">Dark Mode</p>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer"/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
