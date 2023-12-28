import React, { useState, useEffect } from "react";
import { PaginationControl } from "react-bootstrap-pagination-control";

const SessionLogin = () => {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(12);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/all-Trades", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTrades(data);
        } else {
          console.error(`Erreur HTTP! Statut: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des trades", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // Calculer l'index de début et de fin pour la pagination
  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade);

  // Fonction pour changer de page
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="grand-div">
      <div className="sub-navbar">
        <div className="button-demarrer-session">Demarrer une session</div>
      </div>
  
      <div className="table-trade">
        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom Actif</th>
                <th>Timeframe</th>
                <th>Point d'entrée</th>
                <th>TP</th>
                <th>SL</th>
                <th>Type Ordre</th>
                <th>Date Entrée</th>
                <th>Date Sortie</th>
                <th>Sens</th>
                <th>Type Situation</th>
              </tr>
            </thead>
            <tbody>
              {currentTrades.map((trade) => (
                <tr key={trade.id}>
                  <td>{trade.nom_actif}</td>
                  <td>{trade.timeframe}</td>
                  <td>{trade.PE}</td>
                  <td>{trade.TP}</td>
                  <td>{trade.SL}</td>
                  <td>{trade.type_ordre}</td>
                  <td>{trade.date_entree}</td>
                  <td>{trade.date_sortie}</td>
                  <td>{trade.sens}</td>
                  <td>{trade.type_situation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  
      <div className="centered-container">
        <PaginationControl
          page={currentPage}
          between={4}
          total={Math.ceil(trades.length / tradesPerPage)}
          limit={1}
          changePage={handlePageChange}
          ellipsis={1}
        />
      </div>
    </div>
  );
};

export default SessionLogin;
