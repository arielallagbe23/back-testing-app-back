import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTrade = ({ onTradeAdded, setLoading }) => {
  const fetchApiData = async (url, setterFunction) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setterFunction(data);
      } else {
        console.error(`Erreur HTTP! Statut: ${response.status}`);
      }
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données depuis ${url}`,
        error
      );
    }
  };

  const [selectedDateEntree, setSelectedDateEntree] = useState("");
  const [selectedDateSortie, setSelectedDateSortie] = useState("");
  const [selectedActif, setSelectedActif] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [selectedStrategie, setSelectedStrategie] = useState("");
  const [selectedTypeOrdre, setSelectedTypeOrdre] = useState("");
  const [selectedSituation, setSelectedSituation] = useState("");
  const [selectedPE, setSelectedPE] = useState("");
  const [selectedTP, setSelectedTP] = useState("");
  const [selectedSL, setSelectedSL] = useState("");
  const [selectedSens, setSelectedSens] = useState("");
  const [selectedRisque, setSelectedRisque] = useState("");
  const [selectedProfit, setSelectedProfit] = useState("");
  const [selectedResultats, setSelectedResultats] = useState("");
  const [selectedNbPipEchapPE, setSelectedNbPipEchapPE] = useState("");
  const [selectedNbPipEchapTP, setSelectedNbPipEchapTP] = useState("");

  const handleDateEntreeChange = (event) => {
    setSelectedDateEntree(event.target.value);
  };

  const handleDateSortieChange = (event) => {
    setSelectedDateSortie(event.target.value);
  };

  const handleActifChange = (event) => {
    setSelectedActif(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
  };

  const handleStrategieChange = (event) => {
    setSelectedStrategie(event.target.value);
  };

  const handleTypeOrdreChange = (event) => {
    setSelectedTypeOrdre(event.target.value);
  };

  const handleSituationChange = (event) => {
    setSelectedSituation(event.target.value);
  };

  const handlePEChange = (event) => {
    setSelectedPE(event.target.value);
  };

  const handleTPChange = (event) => {
    setSelectedTP(event.target.value);
  };

  const handleSLChange = (event) => {
    setSelectedSL(event.target.value);
  };

  const handleSensChange = (event) => {
    setSelectedSens(event.target.value);
  };

  const handleRisqueChange = (event) => {
    setSelectedRisque(event.target.value);
  };

  const handleProfitChange = (event) => {
    setSelectedProfit(event.target.value);
  };

  const handleResultatsChange = (event) => {
    setSelectedResultats(event.target.value);
  };

  const handleNbPipEchapPEChange = (event) => {
    setSelectedNbPipEchapPE(event.target.value);
  };

  const handleNbPipEchapTPChange = (event) => {
    setSelectedNbPipEchapTP(event.target.value);
  };

  const [actifs, setActifs] = useState([]);
  const [timeframes, setTimeframes] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [typesOrdre, setTypesOrdre] = useState([]);
  const [situations, setSituations] = useState([]);

  useEffect(() => {
    fetchApiData("http://127.0.0.1:8000/api/all-Actifs", setActifs);
    fetchApiData("http://127.0.0.1:8000/api/all-timeframes", setTimeframes);
    fetchApiData("http://127.0.0.1:8000/api/all-Strategies", setStrategies);
    fetchApiData("http://127.0.0.1:8000/api/all-type-ordres", setTypesOrdre);
    fetchApiData("http://127.0.0.1:8000/api/all-Situations", setSituations);
  }, []);

  const handleSubmit = async (event) => {
    setLoading(true);
    const startTime = Date.now(); // Enregistrez le temps de début

    // Récupération des données du formulaire
    const tradeData = {
      date_entree: selectedDateEntree,
      date_sortie: selectedDateSortie,
      actif_id: selectedActif,
      timeframe_id: selectedTimeframe,
      strategie_id: selectedStrategie,
      type_ordre_id: selectedTypeOrdre,
      situation_id: selectedSituation,
      PE: selectedPE,
      TP: selectedTP,
      SL: selectedSL,
      sens: selectedSens,
      risque: selectedRisque,
      profit: selectedProfit,
      resultats: selectedResultats,
      nbPipEchapPE: selectedNbPipEchapPE,
      nbPipEchapTP: selectedNbPipEchapTP,
    };

    // Obtention du token
    const response = await axios.get(
      "http://localhost:8000/api/get-token-cookie",
      { withCredentials: true }
    );
    const tokenFromCookie = response.data.token;

    try {
      // Envoi de la requête pour créer le trade
      const config = {
        method: "post",
        url: "http://127.0.0.1:8000/api/create-trade",
        data: tradeData,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromCookie}`,
        },
      };

      const response = await axios(config);

      // Traitement de la réponse
      if (response.status === 201) {
        const responseData = response.data;
        console.log("Trade ajouté avec succès !");
        onTradeAdded(responseData);
        // Réinitialisation des champs du formulaire
        setSelectedDateEntree("");
        setSelectedDateSortie("");
        setSelectedStrategie("");
        setSelectedTypeOrdre("");
        setSelectedSituation("");
        setSelectedPE("");
        setSelectedTP("");
        setSelectedSL("");
        setSelectedSens("");
        setSelectedRisque("");
        setSelectedProfit("");
        setSelectedResultats("");
        setSelectedNbPipEchapPE("");
        setSelectedNbPipEchapTP("");
      } else {
        console.error(`Erreur HTTP! Statut: ${response.status}`);
        const errorData = response.data;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du trade:", error);
    } finally {
      // Délai de 5 secondes avant de désactiver le chargement
      setTimeout(() => {
        setLoading(false); // Désactivation du chargement après la requête
      }, 5000);
    }
  };

  return (
    <div className="form-trade-1 centered-form">
      <form onSubmit={handleSubmit}>
        <div className="seine">
          <div className="Rive-gauche">
            <select value={selectedActif} onChange={handleActifChange}>
              <option value="">Actif</option>
              {actifs.map((actif) => (
                <option key={actif.id} value={actif.id}>
                  {actif.nom_actif}
                </option>
              ))}
            </select>

            <select value={selectedTimeframe} onChange={handleTimeframeChange}>
              <option value="">Timeframe</option>
              {timeframes.map((timeframe) => (
                <option key={timeframe.id} value={timeframe.id}>
                  {timeframe.timeframe}
                </option>
              ))}
            </select>

            <select value={selectedTypeOrdre} onChange={handleTypeOrdreChange}>
              <option value="">Type Ordre</option>
              {typesOrdre.map((typeOrdre) => (
                <option key={typeOrdre.id} value={typeOrdre.id}>
                  {typeOrdre.type_ordre}
                </option>
              ))}
            </select>

            <select value={selectedSens} onChange={handleSensChange}>
              <option value="">Sens</option>
              <option value="SHORT">SHORT</option>
              <option value="LONG">LONG</option>
            </select>

            <select value={selectedResultats} onChange={handleResultatsChange}>
              <option value="">Résultat</option>
              <option value="TP">TP</option>
              <option value="BE">BE</option>
              <option value="SL">SL</option>
            </select>

            <select value={selectedSituation} onChange={handleSituationChange}>
              <option value="">situation</option>
              {situations.map((situation) => (
                <option key={situation.id} value={situation.id}>
                  {situation.type_situation}
                </option>
              ))}
            </select>

            <select value={selectedStrategie} onChange={handleStrategieChange}>
              <option value="">Stratégies</option>
              {strategies.map((strategie) => (
                <option key={strategie.id} value={strategie.id}>
                  {strategie.nom_strategie}
                </option>
              ))}
            </select>
          </div>

          <div className="Rive-droite">
            <div className="date-entree-div">
              <div>
                <label>Date Entrée</label>
              </div>
              <div>
                <input
                  type="datetime-local"
                  value={selectedDateEntree}
                  onChange={handleDateEntreeChange}
                />
              </div>
            </div>

            <div className="date-sortie-div">
              <div>
                <label>Date Sortie</label>
              </div>
              <div>
                <input
                  type="datetime-local"
                  value={selectedDateSortie}
                  onChange={handleDateSortieChange}
                />
              </div>
            </div>

            <div className="PE">
              <div>
                <label>PE</label>
              </div>
              <div>
                <input
                  type="text"
                  value={selectedPE}
                  onChange={handlePEChange}
                />
              </div>
            </div>

            <div className="SL">
              <div>
                <label>SL</label>
              </div>
              <div>
                <input
                  type="text"
                  value={selectedSL}
                  onChange={handleSLChange}
                />
              </div>
            </div>

            <div className="TP">
              <div>
                <label>TP</label>
              </div>
              <div>
                <input
                  type="text"
                  value={selectedTP}
                  onChange={handleTPChange}
                />
              </div>
            </div>

            <div className="situation">
              <div>
                <div>
                  <label>echap_PE</label>
                </div>
                <div>
                  <input
                    type="text"
                    value={selectedNbPipEchapPE}
                    onChange={handleNbPipEchapPEChange}
                  />
                </div>
              </div>
              <div className="ECTP">
                <div>
                  <label>echap_TP</label>
                </div>
                <div>
                  <input
                    type="text"
                    value={selectedNbPipEchapTP}
                    onChange={handleNbPipEchapTPChange}
                  />
                </div>
              </div>
            </div>

            <div className="RR">
              <div className="Risque">
                <div>
                  <label>Risque</label>
                </div>
                <div>
                  <input
                    type="text"
                    value={selectedRisque}
                    onChange={handleRisqueChange}
                  />
                </div>
              </div>

              <div className="Profit">
                <div>
                  <label>Profit</label>
                </div>
                <div>
                  <input
                    type="text"
                    value={selectedProfit}
                    onChange={handleProfitChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          type="submit"
          className="create-trade-button"
          onClick={handleSubmit}
        >
          Create
        </div>
      </form>
    </div>
  );
};

export default AddTrade;
