
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const InputField: React.FC<{
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility?: () => void;
  showPassword?: boolean;
}> = ({ label, name, type, value, onChange, onToggleVisibility, showPassword }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      {onToggleVisibility && (
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-primary"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Current Password"
          name="currentPassword"
          type={showCurrentPassword ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
          showPassword={showCurrentPassword}
        />
        <InputField
          label="New Password"
          name="newPassword"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
          showPassword={showNewPassword}
        />
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          type={showNewPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Update Password</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;