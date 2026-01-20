import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi'; // Removed FiDollarSign
import './Modal.css';
const LivestockModal = ({ isOpen, onClose, onSave, animal }) => {
  const [formData, setFormData] = useState({
    tagId: '',
    animalType: 'goat',
    breed: '',
    dateAcquired: '',
    purchasePrice: '',
    gender: 'male',
    age: '',
    weight: '',
    healthStatus: 'healthy',
    penNumber: '',
    notes: '',
  });

  // Define breed options
  const goatBreeds = ['West African Dwarf', 'Red Sokoto', 'Sahelian', 'Boer', 'Mixed'];
  const sheepBreeds = ['Yankasa', 'Uda', 'Balami', 'Dorper', 'Mixed'];
  const cattleBreeds = ['White Fulani', 'Red Bororo', 'Muturu', 'N\'Dama', 'Mixed'];

  useEffect(() => {
    if (animal) {
      setFormData({
        tagId: animal.tagId || '',
        animalType: animal.animalType || 'goat',
        breed: animal.breed || '',
        dateAcquired: animal.dateAcquired || new Date().toISOString().split('T')[0],
        purchasePrice: animal.purchasePrice || '',
        gender: animal.gender || 'male',
        age: animal.age || '',
        weight: animal.weight || '',
        healthStatus: animal.healthStatus || 'healthy',
        penNumber: animal.penNumber || '',
        notes: animal.notes || '',
      });
    } else {
      setFormData({
        tagId: `LIV-${Date.now().toString().slice(-6)}`,
        animalType: 'goat',
        breed: '',
        dateAcquired: new Date().toISOString().split('T')[0],
        purchasePrice: '',
        gender: 'male',
        age: '',
        weight: '',
        healthStatus: 'healthy',
        penNumber: '',
        notes: '',
      });
    }
  }, [animal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getBreeds = (animalType) => {
    switch(animalType) {
      case 'goat': return goatBreeds;
      case 'sheep': return sheepBreeds;
      case 'cattle': return cattleBreeds;
      default: return ['Mixed'];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const animalTypes = [
    { value: 'goat', label: 'Goat' },
    { value: 'sheep', label: 'Sheep' },
    { value: 'cattle', label: 'Cattle' },
    { value: 'pig', label: 'Pig' },
    { value: 'rabbit', label: 'Rabbit' },
  ];

  const healthStatuses = [
    { value: 'healthy', label: 'Healthy' },
    { value: 'sick', label: 'Sick' },
    { value: 'injured', label: 'Injured' },
    { value: 'pregnant', label: 'Pregnant' },
    { value: 'recovering', label: 'Recovering' },
  ];

  const currentBreeds = getBreeds(formData.animalType);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{animal ? 'Edit Animal' : 'Add New Animal'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tagId">Tag ID *</label>
                <input
                  type="text"
                  id="tagId"
                  name="tagId"
                  value={formData.tagId}
                  onChange={handleChange}
                  placeholder="e.g., GOAT-001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="animalType">Animal Type *</label>
                <select
                  id="animalType"
                  name="animalType"
                  value={formData.animalType}
                  onChange={handleChange}
                  required
                >
                  {animalTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                >
                  <option value="">Select breed</option>
                  {currentBreeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dateAcquired">Date Acquired *</label>
                <input
                  type="date"
                  id="dateAcquired"
                  name="dateAcquired"
                  value={formData.dateAcquired}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchasePrice">Purchase Price (₦)</label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="Enter purchase price"
                  min="0"
                  step="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age (months)</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 12"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 25.5"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="healthStatus">Health Status</label>
                <select
                  id="healthStatus"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                >
                  {healthStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="penNumber">Pen/House Number</label>
                <input
                  type="text"
                  id="penNumber"
                  name="penNumber"
                  value={formData.penNumber}
                  onChange={handleChange}
                  placeholder="e.g., Pen A, House 1"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Health notes, special requirements, etc."
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {animal ? 'Update Animal' : 'Add Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivestockModal;