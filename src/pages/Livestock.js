import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrendingUp, FiDroplet, FiActivity, FiEdit, FiTrash2, FiUser, FiHeart, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import LivestockModal from '../components/LivestockModal';
import { supabase } from '../lib/supabase';
import './Livestock.css';

const Livestock = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
  
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          const errorMsg = 'Livestock table not found. Please create it in Supabase first.';
          showError(errorMsg);
          
          setLoading(false);
          return;
        }
        throw error;
      }
      
      // Transform data to match component structure
      const transformedAnimals = (data || []).map(animal => ({
        id: animal.id,
        tagId: animal.tag_id,
        animalType: animal.animal_type,
        breed: animal.breed || 'Mixed',
        dateAcquired: animal.date_acquired,
        purchasePrice: animal.purchase_price || 0,
        gender: animal.gender,
        age: animal.age || 0,
        weight: animal.weight || 0,
        healthStatus: animal.health_status || 'healthy',
        penNumber: animal.pen_number || 'Pen A',
        notes: animal.notes || '',
      }));
      
      setAnimals(transformedAnimals);
    
    } catch (error) {
      console.error('Error fetching livestock:', error);
      showError('Failed to load livestock. Please check your connection.');
      
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculateTotalInvestment = () => {
    return animals.reduce((sum, animal) => sum + (animal.purchasePrice || 0), 0);
  };

  const calculateTotalAnimals = () => {
    return animals.length;
  };

  const calculateFemales = () => {
    return animals.filter(animal => animal.gender === 'female').length;
  };

  const calculateMales = () => {
    return animals.filter(animal => animal.gender === 'male').length;
  };

  const handleAddAnimal = () => {
    setSelectedAnimal(null);
    setIsModalOpen(true);
  };

  const handleEditAnimal = (animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const handleDeleteAnimal = async (animalId) => {
    const animalTag = animals.find(animal => animal.id === animalId)?.tagId;
    
    if (window.confirm(`Are you sure you want to delete "${animalTag}"? This action cannot be undone.`)) {
      const loadingToast = showLoading(`Deleting "${animalTag}"...`);
      
      try {
        const { error } = await supabase
          .from('livestock')
          .delete()
          .eq('id', animalId);

        if (error) throw error;
        
        setAnimals(animals.filter(animal => animal.id !== animalId));
        dismiss(loadingToast);
        showSuccess(`"${animalTag}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting livestock:', error);
        dismiss(loadingToast);
        showError('Failed to delete animal. Please try again.');
      }
    }
  };

  const handleSaveAnimal = async (animalData) => {
    const isEditing = !!selectedAnimal;
   
    
    try {
      await fetchAnimals();
      setIsModalOpen(false);
      setSelectedAnimal(null);
      
    
      showSuccess(
        isEditing 
          ? 'Animal updated successfully!' 
          : 'New animal added successfully!'
      );
    } catch (error) {
      console.error('Error handling save:', error);
 
      showError('Failed to save animal. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchAnimals();
  };

  const getHealthStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return '#4CAF50';
      case 'sick': return '#F44336';
      case 'injured': return '#FF9800';
      case 'pregnant': return '#9C27B0';
      case 'recovering': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getAnimalTypeIcon = (type) => {
    switch(type) {
      case 'goat': return <FiUser />;
      case 'sheep': return <FiHeart />;
      case 'cattle': return <FiTrendingUp />;
      case 'pig': return <FiDroplet />;
      default: return <FiActivity />;
    }
  };

  const getAnimalTypeDisplay = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';
  };

  return (
    <div className="livestock-page">
      <div className="page-header">
        <h1>Livestock Management</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={handleAddAnimal} disabled={loading}>
            <FiPlus /> Add Animal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading livestock...</div>
        </div>
      ) : (
        <>
          <div className="livestock-stats">
            <div className="livestock-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}>
                <FiUser />
              </div>
              <div className="stat-info">
                <h3>Total Animals</h3>
                <div className="stat-value">{calculateTotalAnimals()}</div>
                <div className="stat-label">Live Animals</div>
              </div>
            </div>
            
            <div className="livestock-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
                <FiDollarSign />
              </div>
              <div className="stat-info">
                <h3>Total Investment</h3>
                <div className="stat-value">{formatCurrency(calculateTotalInvestment())}</div>
                <div className="stat-label">Animal Purchase</div>
              </div>
            </div>
            
            <div className="livestock-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
                <FiUser />
              </div>
              <div className="stat-info">
                <h3>Female Animals</h3>
                <div className="stat-value">{calculateFemales()}</div>
                <div className="stat-label">Breeding Stock</div>
              </div>
            </div>
            
            <div className="livestock-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
                <FiUser />
              </div>
              <div className="stat-info">
                <h3>Male Animals</h3>
                <div className="stat-value">{calculateMales()}</div>
                <div className="stat-label">Breeding Stock</div>
              </div>
            </div>
          </div>

          <div className="animals-section">
            <div className="section-header">
              <h2>Animal Inventory</h2>
              <div className="inventory-summary">
                <span>Total Animals: {animals.length}</span>
                <span>Total Value: {formatCurrency(calculateTotalInvestment())}</span>
              </div>
            </div>
            
            {animals.length === 0 ? (
              <div className="empty-state">
                <FiUser size={48} />
                <h3>No Livestock Found</h3>
                <p>Get started by adding your first animal.</p>
                <button className="btn btn-primary" onClick={handleAddAnimal}>
                  <FiPlus /> Add First Animal
                </button>
              </div>
            ) : (
              <div className="animals-grid">
                {animals.map(animal => (
                  <div key={animal.id} className="animal-card">
                    <div className="animal-header">
                      <div>
                        <h3>{animal.tagId}</h3>
                        <div className="animal-meta">
                          <span className="animal-type">{getAnimalTypeDisplay(animal.animalType)}</span>
                          <span className="animal-breed">{animal.breed}</span>
                        </div>
                      </div>
                      <div className="animal-header-actions">
                        <span 
                          className="animal-health" 
                          style={{ 
                            backgroundColor: `${getHealthStatusColor(animal.healthStatus)}20`,
                            color: getHealthStatusColor(animal.healthStatus)
                          }}
                        >
                          {animal.healthStatus}
                        </span>
                        <div className="animal-actions">
                          <button 
                            className="icon-btn" 
                            onClick={() => handleEditAnimal(animal)}
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button 
                            className="icon-btn delete" 
                            onClick={() => handleDeleteAnimal(animal.id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="animal-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Gender:</span>
                          <span className="detail-value">{animal.gender}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Age:</span>
                          <span className="detail-value">{animal.age || 'N/A'} months</span>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Weight:</span>
                          <span className="detail-value">{animal.weight || 'N/A'} kg</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Pen:</span>
                          <span className="detail-value">{animal.penNumber}</span>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Acquired:</span>
                          <span className="detail-value">{animal.dateAcquired}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">{formatCurrency(animal.purchasePrice)}</span>
                        </div>
                      </div>
                      
                      {animal.notes && (
                        <div className="animal-notes">
                          <span className="notes-label">Notes:</span>
                          <p className="notes-content">{animal.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="animal-actions-buttons">
                      <button className="btn btn-sm btn-primary">Health Record</button>
                      <button className="btn btn-sm btn-secondary">Feeding</button>
                      <button className="btn btn-sm btn-secondary">Breeding</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="upcoming-tasks">
            <h2>Upcoming Tasks</h2>
            <div className="tasks-grid">
              <div className="task-card">
                <div className="task-icon">
                  <FiActivity />
                </div>
                <div className="task-content">
                  <h4>Vaccination Schedule</h4>
                  <p>All animals due for vaccination in 2 weeks</p>
                  <div className="task-meta">Due: 2024-02-01</div>
                </div>
              </div>
              
              <div className="task-card">
                <div className="task-icon">
                  <FiHeart />
                </div>
                <div className="task-content">
                  <h4>Breeding Check</h4>
                  <p>Check pregnant animals for upcoming births</p>
                  <div className="task-meta">Due: 2024-01-25</div>
                </div>
              </div>
              
              <div className="task-card">
                <div className="task-icon">
                  <FiDroplet />
                </div>
                <div className="task-content">
                  <h4>Pen Cleaning</h4>
                  <p>Schedule deep cleaning of all pens</p>
                  <div className="task-meta">Due: Weekly</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <LivestockModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAnimal}
        animal={selectedAnimal}
      />
    </div>
  );
};

export default Livestock;