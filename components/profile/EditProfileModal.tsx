
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { EditableProfileData, ProfileUser } from '../../contexts/ProfileContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditableProfileData) => void;
  currentUser: ProfileUser;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState<EditableProfileData>({
    name: '',
    phone: '',
    team: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        phone: currentUser.phone,
        team: currentUser.team,
      });
    }
  }, [currentUser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const InputField: React.FC<{label:string, name:keyof EditableProfileData, value:string, onChange: any, placeholder?: string }> = ({label, name, value, onChange, placeholder}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
     </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
        <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
        <InputField label="Team" name="team" value={formData.team} onChange={handleChange} placeholder="e.g. Platform Operations" />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
