import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [navigateFlag, setNavigateFlag] = useState(false);

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
      event.preventDefault();
      
      const loginData = {
        email: email,
        password: password,
      };
    
      const config = {
        method: 'post',
        url: 'http://localhost:8000/api/login',
        data: loginData,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };
    
      try {
        const response = await axios(config);
        console.log('Connexion réussie, redirection vers /home...');
        setNavigateFlag(true); // Met à jour l'état pour déclencher la navigation
      } catch (error) {
        console.error('Erreur de connexion :', error);
        setError("Adresse mail ou mot de passe incorrect"); // Met à jour l'état de l'erreur
      }
    };
    
    useEffect(() => {
      if (navigateFlag) {
        navigate('/session'); // Effectue la navigation
        console.log('Redirection vers userlogin effectuée.');
        window.location.reload(); // Recharge la page après la navigation
      }
    }, [navigateFlag, navigate]);
    

  return (

      <div className="card-login-body position-absolute top-50 start-50 translate-middle">
        
        <h1 className="card-login-title">Connexion</h1>



        <div className="form-login-container">
        {error && <div className="error-signalement">{error}</div>}



            <form className="form-login-container" onSubmit={handleLogin}>
         
              <div className="form-group form-input-spacing">

                <input

                  type="email"

                  placeholder="Adresse mail"

                  className="form-control custom-height"

                  name="email"

                  value={email}

                  onChange={(e) => setEmail(e.target.value)}

                />
                
              </div>

              <div className="form-group form-input-spacing">

                  <input

                    type="password"

                    placeholder="Mot de passe"

                    className="form-control custom-height"

                    name="password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                  />

              </div>


              <div className="button-login">

                <button type="submit" className="btn-login">

                  je me connecte

                </button>

              </div>

            </form>

          </div>

        </div>

   

);

}

export default Login;
