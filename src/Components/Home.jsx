import React, { useState, useEffect } from "react";
import moment from "moment";
import { Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { InfinitySpin } from "react-loader-spinner";
import { useSpring, animated } from "react-spring";

const getResultatsColorClass = (resultats) => {
  switch (resultats) {
    case "SL":
      return "resultats-red";
    case "TP":
      return "resultats-green";
    case "BE":
      return "resultats-yellow";
    default:
      return "";
  }
};

const calculateDuration = (date_entree, date_sortie) => {
  const entryDate = moment(date_entree);
  const exitDate = moment(date_sortie);
  const duration = moment.duration(exitDate.diff(entryDate));
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const formattedDuration = [];

  if (years > 0) {
    formattedDuration.push(`${years} ${years === 1 ? "year" : "years"}`);
  }
  if (months > 0) {
    formattedDuration.push(`${months} ${months === 1 ? "month" : "months"}`);
  }
  if (days > 0) {
    formattedDuration.push(`${days} ${days === 1 ? "day" : "days"}`);
  }
  if (hours > 0) {
    formattedDuration.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }
  if (minutes > 0) {
    formattedDuration.push(
      `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
    );
  }

  return formattedDuration.join(", ");
};

const Home = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isAnimationVisible, setIsAnimationVisible] = useState(true);

  const slideAnimation = useSpring({
    from: { transform: "translateX(100%)" },
    to: {
      transform: isAnimationVisible ? "translateX(0%)" : "translateX(0%)",
    },
    config: { duration: 9000 }, // Durée de l'animation en millisecondes (5 secondes)
    onRest: () => setIsAnimationVisible(false), // Cache l'élément une fois l'animation terminée
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 5000 millisecondes (5 secondes)

    return () => clearTimeout(timer); // Nettoyez le timer lorsque le composant est démonté
  }, []);

  


  return (
    <div>
      {isLoading ? (
        <div className="loading-wrapper">
          <InfinitySpin
            visible={true}
            color="#073763"
            ariaLabel="infinity-spin-loading"
            className="scaled-spinner"
          />
        </div>
      ) : (
        // Affichez le contenu principal une fois que le chargement est terminé
        <div>
  
            <div className="is-not-logged">
              <div className="image-container">
                <animated.div style={slideAnimation}>
                  <img
                    src="/images/kondoTheNew.png"
                    className="card-img-top"
                    alt=""
                  />
                </animated.div>
              </div>
              <div className="action-to-do">
                Veuillez vous connecter pour accéder à votre session
              </div>
            </div>
       
        </div>
      )}
    </div>
  );
};

export default Home;