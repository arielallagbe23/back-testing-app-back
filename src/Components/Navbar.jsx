import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsMenuOpen(false);
      navigate('/home');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          KONDO
        </a>

        {userData && userData.user && (
          <>
            <button
              className="navbar-nav btnMonCompte btn rounded-pill"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-grow text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                userData.user.name
              )}
            </button>

            {isMenuOpen && (
              <div className="card-list-group">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <a
                      href="/session"
                      className="list-group-item list-group-item-action"
                      onClick={closeMenu}
                    >
                      Profile
                    </a>
                  </li>
                  <li className="list-group-item">
                    <button
                      onClick={handleLogout}
                      className="list-group-item list-group-item-action"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}

        {!userData && (
          <button
            className="navbar-nav btnMonCompte btn rounded-pill"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-grow text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              'Mon compte'
            )}
          </button>
        )}

        {!userData && isMenuOpen && (
          <div className="card-list-group">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <a
                  href="/login"
                  className="list-group-item list-group-item-action"
                  onClick={closeMenu}
                >
                  Login
                </a>
              </li>
              <li className="list-group-item">
                <a
                  href="/register"
                  className="list-group-item list-group-item-action"
                  onClick={closeMenu}
                >
                  Register
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
