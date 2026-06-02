import React, { useState } from 'react';

const CreateHarvestPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productType: '',
    quantityKg: '',
    qualityCategory: '',
    pricePerKgFcfa: '',
    latitude: null,
    longitude: null,
    villageName: 'Mon Village', // par défaut pour le formulaire
    region: 'Ouest' // par défaut pour le formulaire
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          alert('Position GPS capturée avec succès !');
        },
        (error) => {
          alert('Erreur lors de la récupération de la position : ' + error.message);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const response = await fetch('http://localhost:8080/api/harvests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Récolte publiée avec succès !' });
        setTimeout(() => {
          window.location.href = '/dashboard'; // Redirection simple
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitMessage({ type: 'error', text: 'Erreur lors de la publication : ' + (errorData.message || 'Erreur inconnue') });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' },
    title: { textAlign: 'center', color: '#333' },
    progressBar: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
    stepIndicator: (active) => ({ flex: 1, textAlign: 'center', padding: '10px', borderBottom: active ? '3px solid #ff8c00' : '3px solid #eee', fontWeight: active ? 'bold' : 'normal', color: active ? '#ff8c00' : '#999' }),
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' },
    input: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
    buttonRow: { display: 'flex', justifyContent: 'space-between', marginTop: '30px' },
    btnBack: { padding: '10px 20px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    btnNext: { padding: '10px 20px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    btnSubmit: { padding: '10px 20px', border: 'none', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    btnGps: { padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px', fontSize: '16px' },
    message: (type) => ({ padding: '15px', marginTop: '20px', borderRadius: '4px', backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da', color: type === 'success' ? '#155724' : '#721c24' })
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Publier une nouvelle récolte</h2>
      
      <div style={styles.progressBar}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={styles.stepIndicator(step === s)}>Étape {s}</div>
        ))}
      </div>

      {/* Étape 1 : Choix du produit */}
      {step === 1 && (
        <div>
          <h3>Quel produit souhaitez-vous vendre ?</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type de produit</label>
            <select name="productType" value={formData.productType} onChange={handleChange} style={styles.select}>
              <option value="">Sélectionnez un produit...</option>
              <option value="TOMATO">Tomate</option>
              <option value="CASSAVA">Manioc</option>
              <option value="PLANTAIN">Plantain</option>
              <option value="MACABO">Macabo</option>
              <option value="OTHER">Autre / Maïs</option>
            </select>
          </div>
        </div>
      )}

      {/* Étape 2 : Quantité & Qualité */}
      {step === 2 && (
        <div>
          <h3>Quantité et Qualité</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantité estimée (en Kg)</label>
            <input type="number" name="quantityKg" value={formData.quantityKg} onChange={handleChange} style={styles.input} placeholder="Ex: 500" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Catégorie de qualité</label>
            <select name="qualityCategory" value={formData.qualityCategory} onChange={handleChange} style={styles.select}>
              <option value="">Sélectionnez la qualité...</option>
              <option value="CAT_A">Catégorie A (Premium)</option>
              <option value="CAT_B">Catégorie B (Standard)</option>
              <option value="CAT_C">Catégorie C (Déclassé)</option>
            </select>
          </div>
        </div>
      )}

      {/* Étape 3 : Prix souhaité */}
      {step === 3 && (
        <div>
          <h3>Fixez votre prix</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prix demandé (FCFA / Kg)</label>
            <input type="number" name="pricePerKgFcfa" value={formData.pricePerKgFcfa} onChange={handleChange} style={styles.input} placeholder="Ex: 400" />
          </div>
        </div>
      )}

      {/* Étape 4 : Localisation GPS */}
      {step === 4 && (
        <div>
          <h3>Localisation de la récolte</h3>
          <p style={{ color: '#666' }}>Afin que les transporteurs puissent vous trouver facilement, veuillez enregistrer votre position GPS.</p>
          
          <button onClick={getGPSLocation} style={styles.btnGps}>
            📍 Capturer ma position GPS actuelle
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <p><strong>Latitude :</strong> {formData.latitude || 'Non définie'}</p>
            <p><strong>Longitude :</strong> {formData.longitude || 'Non définie'}</p>
          </div>
        </div>
      )}

      {submitMessage && (
        <div style={styles.message(submitMessage.type)}>
          {submitMessage.text}
        </div>
      )}

      <div style={styles.buttonRow}>
        <button 
          onClick={handlePrev} 
          style={{...styles.btnBack, visibility: step === 1 ? 'hidden' : 'visible'}}
          disabled={isSubmitting}
        >
          Retour
        </button>

        {step < 4 ? (
          <button onClick={handleNext} style={styles.btnNext}>Suivant</button>
        ) : (
          <button onClick={handleSubmit} style={styles.btnSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Publication...' : 'Publier la récolte'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateHarvestPage;
