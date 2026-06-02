import React, { useState } from 'react';

const MyHarvestsPage = () => {
  // Simulation des récoltes de l'agriculteur connecté
  const [harvests] = useState([
    { id: 1, product: "Tomates fraîches", quantity: "50 sacs", price: "75 000 FCFA", quality: "CAT_A", status: "AVAILABLE", date: "15 Juin 2026" },
    { id: 2, product: "Maïs sec", quantity: "120 kg", price: "36 000 FCFA", quality: "CAT_B", status: "GROUPED", date: "20 Juin 2026" },
    { id: 3, product: "Manioc", quantity: "300 kg", price: "90 000 FCFA", quality: "CAT_C", status: "DELIVERED", date: "10 Mai 2026" }
  ]);

  // Fonction pour afficher des badges colorés selon le statut (Demandé par le guide !)
  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return { text: "Disponible", bg: '#E6F4EA', color: '#137333' }; // Vert
      case "GROUPED":
        return { text: "Groupé (Logistique)", bg: '#E8F0FE', color: '#1A73E8' }; // Bleu
      case "DELIVERED":
        return { text: "Livré & Payé", bg: '#F1F3F4', color: '#5F6368' }; // Gris
      default:
        return { text: status, bg: '#FFF0D4', color: '#B06000' };
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#F4F6F4', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <h2 style={{ color: '#1A6233', marginBottom: '20px', textAlign: 'center' }}>Mon Historique de Récoltes</h2>
        
        {harvests.map((h) => {
          const badge = getStatusBadge(h.status);
          return (
            <div key={h.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#111' }}>{h.product}</h4>
                  <span style={{ fontSize: '11px', backgroundColor: '#F0F0F0', color: '#555', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block', marginTop: '4px' }}>
                    {h.quality === 'CAT_A' ? '🌟 Qualité Supérieure (A)' : h.quality === 'CAT_B' ? '👍 Qualité Standard (B)' : '🥣 À transformer (C)'}
                  </span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A6233' }}>{h.price}</span>
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#555' }}>
                <strong>Quantité :</strong> {h.quantity}
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid #F0F0F0', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>📅 Enregistré le {h.date}</span>
                <span style={{ backgroundColor: badge.bg, color: badge.color, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                  {badge.text}
                </span>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default MyHarvestsPage;