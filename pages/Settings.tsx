import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '../components/ui/Icon';

const themes = [
    { name: 'Indigo', color: 'bg-indigo-600', key: 'indigo' },
    { name: 'Blue', color: 'bg-blue-500', key: 'blue' },
    { name: 'Green', color: 'bg-green-500', key: 'green' },
    { name: 'Rose', color: 'bg-rose-600', key: 'rose' },
    { name: 'Teal', color: 'bg-cyan-500', key: 'teal' },
];

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Theme Customization</h2>
        <p className="text-slate-500 mt-2 mb-6">Personalize the look and feel of your dashboard by selecting a primary color.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {themes.map((themeOption) => (
            <div key={themeOption.key}>
              <button
                onClick={() => setTheme(themeOption.key)}
                className={`w-full h-24 rounded-lg flex items-center justify-center transition-all duration-200 ${themeOption.color} ${theme === themeOption.key ? 'ring-4 ring-offset-2 ring-primary' : 'hover:opacity-90'}`}
              >
                {theme === themeOption.key && (
                  <div className="bg-white/30 rounded-full p-2">
                    <Icon name="check-circle" className="w-8 h-8 text-white" />
                  </div>
                )}
              </button>
              <p className="text-center mt-2 font-medium text-slate-700">{themeOption.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;