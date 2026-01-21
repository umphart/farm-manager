import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Modal.css';

const LivestockModal = ({ isOpen, onClose, onSave, animal }) => {
  const [formData, setFormData] = useState({
    tag_id: '',
    animal_type: 'goat',
    breed: '',
    date_acquired: '',
    purchase_price: '',
    gender: 'male',
    notes: '',
  });

  // Define breed options
  const goatBreeds = ['West African Dwarf', 'Red Sokoto', 'Sahelian', 'Boer', 'Mixed'];
  const sheepBreeds = ['Yankasa', 'Uda', 'Balami', 'Dorper', 'Mixed'];
  const cattleBreeds = ['White Fulani', 'Red Bororo', 'Muturu', 'N\'Dama', 'Mixed'];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (animal) {
      setFormData({
        tag_id: animal.tagId || '',
        animal_type: animal.animalType || 'goat',
        breed: animal.breed || '',
        date_acquired: animal.dateAcquired || new Date().toISOString().split('T')[0],
        purchase_price: animal.purchasePrice || '',
        gender: animal.gender || 'male',
        notes: animal.notes || '',
      });
    } else {
      setFormData({
        tag_id: `LIV-${Date.now().toString().slice(-6)}`,
        animal_type: 'goat',
        breed: '',
        date_acquired: new Date().toISOString().split('T')[0],
        purchase_price: '',
        gender: 'male',
        notes: '',
      });
    }
    setError('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const animalData = {
        tag_id: formData.tag_id,
        animal_type: formData.animal_type,
        breed: formData.breed || 'Mixed',
        date_acquired: formData.date_acquired,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        gender: formData.gender,
        health_status: 'healthy',
        pen_number: 'Pen A',
        notes: formData.notes || '',
      };

      let result;
      
      if (animal) {
        // Update existing animal
        result = await supabase
          .from('livestock')
          .update(animalData)
          .eq('id', animal.id)
          .select();
      } else {
        // Create new animal
        result = await supabase
          .from('livestock')
          .insert([animalData])
          .select();
      }

      if (result.error) throw result.error;

      // Transform the saved data to match component structure
      const savedAnimal = result.data[0];
      const transformedAnimal = {
        id: savedAnimal.id,
        tagId: savedAnimal.tag_id,
        animalType: savedAnimal.animal_type,
        breed: savedAnimal.breed,
        dateAcquired: savedAnimal.date_acquired,
        purchasePrice: savedAnimal.purchase_price || 0,
        gender: savedAnimal.gender,
        age: savedAnimal.age || 0,
        weight: savedAnimal.weight || 0,
        healthStatus: savedAnimal.health_status || 'healthy',
        penNumber: savedAnimal.pen_number || 'Pen A',
        notes: savedAnimal.notes || '',
      };

      onSave(transformedAnimal);
      onClose();
    } catch (error) {
      console.error('Error saving livestock:', error);
      setError(error.message || 'Failed to save animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const animalTypes = [
    { value: 'goat', label: 'Goat' },
    { value: 'sheep', label: 'Sheep' },
    { value: 'cattle', label: 'Cattle' },
    { value: 'rabbit', label: 'Rabbit' },
  ];

  const currentBreeds = getBreeds(formData.animal_type);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{animal ? 'Edit Animal' : 'Add New Animal'}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            disabled={loading}
          >
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tag_id">Tag ID *</label>
                <input
                  type="text"
                  id="tag_id"
                  name="tag_id"
                  value={formData.tag_id}
                  onChange={handleChange}
                  placeholder="e.g., GOAT-001"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="animal_type">Animal Type *</label>
                <select
                  id="animal_type"
                  name="animal_type"
                  value={formData.animal_type}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="">Select breed</option>
                  {currentBreeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date_acquired">Date Acquired *</label>
                <input
                  type="date"
                  id="date_acquired"
                  name="date_acquired"
                  value={formData.date_acquired}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchase_price">Purchase Price (₦)</label>
                <input
                  type="number"
                  id="purchase_price"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  placeholder="Enter purchase price"
                  min="0"
                  step="100"
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : animal ? 'Update Animal' : 'Add Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivestockModal;