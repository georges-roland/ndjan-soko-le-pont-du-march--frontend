import React, { useState, useEffect } from 'react';

const FarmerDashboard = () => {
  const [harvests, setHarvests] = useState([]);

  useEffect(() => {
    // Dans un vrai cas, nous ferions un fetch vers /api/harvests ou /api/harvests/farmer/1
    // Pour l'interface, on utilise des données de test
    setHarvests([
      { id: 1, product: 'Tomates fraîches', quantity: 500, price: 400, status: 'En attente de camion' },
      { id: 2, product: 'Maïs sec', quantity: 1000, price: 250, status: 'Transporteur trouvé' }
    ]);
  }, []);

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #eee',
      paddingBottom: '20px',
      marginBottom: '20px'
    },
    title: {
      color: '#333',
      margin: 0
    },
    button: {
      backgroundColor: '#ff8c00', // Orange color requested
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '8px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    },
    statsCard: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #ddd',
      marginBottom: '30px',
      textAlign: 'center'
    },
    statsAmount: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#28a745',
      margin: '10px 0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    th: {
      backgroundColor: '#f4f4f4',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    statusBadge: (status) => ({
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      backgroundColor: status === 'En attente de camion' ? '#fff3cd' : '#d4edda',
      color: status === 'En attente de camion' ? '#856404' : '#155724'
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tableau de bord Agriculteur</h1>
        <a href="/create-harvest" style={styles.button}>+ Publier une récolte</a>
      </div>

      <div style={styles.statsCard}>
        <h3>Revenus mensuels estimés</h3>
        <p style={styles.statsAmount}>231 000 FCFA</p>
        <p style={{ color: '#666', margin: 0 }}>Basé sur vos ventes confirmées de ce mois</p>
      </div>

      <div>
        <h2>Mes ventes en attente</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Produit</th>
              <th style={styles.th}>Quantité (kg)</th>
              <th style={styles.th}>Prix demandé (FCFA/kg)</th>
              <th style={styles.th}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {harvests.map(harvest => (
              <tr key={harvest.id}>
                <td style={styles.td}><strong>{harvest.product}</strong></td>
                <td style={styles.td}>{harvest.quantity} kg</td>
                <td style={styles.td}>{harvest.price} FCFA</td>
                <td style={styles.td}>
                  <span style={styles.statusBadge(harvest.status)}>
                    {harvest.status}
                  </span>
                </td>
              </tr>
            ))}
            {harvests.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  Aucune vente en attente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerDashboard;
