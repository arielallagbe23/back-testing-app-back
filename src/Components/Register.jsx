import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../Api/axios';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        emailVerification: '',
        password: '',
        passwordVerification: '',
    });

    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState('');

    const [passwordHelpActive, setPasswordHelpActive] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const showPasswordHelp = () => {
        setPasswordHelpActive(true);
    };

    const hidePasswordHelp = () => {
        setPasswordHelpActive(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!EMAIL_REGEX.test(formData.email)) {
            newErrors.email = 'Adresse e-mail invalide.';
        }

        if (formData.email !== formData.emailVerification) {
            newErrors.emailVerification = 'Les adresses e-mail ne correspondent pas.';
        }

        if (formData.password !== formData.passwordVerification) {
            newErrors.passwordVerification = 'Les mots de passe ne correspondent pas.';
        }

        if (!PWD_REGEX.test(formData.password)) {
            newErrors.password = 'Mot de passe invalide. Assurez-vous qu\'il respecte les critères.';
        }

        if (Object.keys(newErrors).length > 0) {

            setErrors(newErrors);

            setSuccessMessage('');

            return;
        }

        try {
            const response = await axios.post('api/register/', formData);

            setSuccessMessage(response.data.message);

            setErrors({});

            setTimeout(() => {

                setSuccessMessage('');

                navigate('/login');

            }, 3000);

        } catch (error) {

            if (error.response && error.response.data && error.response.data.errors) {

                setErrors(error.response.data.errors);

                setSuccessMessage('');

            } else {

                setErrors({ general: 'Une erreur s\'est produite lors de l\'inscription.' });

                setSuccessMessage('');

            }
        }
    };

    return (
        <div className="card-register">

            <div className="card-register-body">

                <h1 className="card-register-title">Inscription</h1>

                    <div className='alert-haut-page'>

                        {errors.general && (

                        <div className="alert alert-danger">

                            {errors.general}

                        </div>

                        )}

                        {successMessage && (
                        <div className="alert alert-success">
                            {successMessage}
                        </div>
                        )}

                    </div>

                    

                <div className="form-register-container">

                    

                   

                    <form onSubmit={handleSubmit}>

                        <div className="form-group form-input-spacing">

                            <input

                                type="text"

                                placeholder="Name"

                                className="form-control custom-height"

                                name="name"

                                value={formData.name}

                                onChange={handleChange}

                            />
                        </div>

                        <div className="form-group form-input-spacing">

                            <input

                                type="email"

                                placeholder="Adresse e-mail"

                                className="form-control custom-height"

                                name="email"

                                value={formData.email}

                                onChange={handleChange}

                            />

                            {errors.email && <div className="alert alert-danger">{errors.email}</div>}

                        </div>

                        <div className="form-group form-input-spacing">

                            <input

                                type="email"

                                placeholder="Vérification de l'adresse e-mail"

                                className="form-control custom-height"

                                name="emailVerification"

                                value={formData.emailVerification}

                                onChange={handleChange}

                            />
                            {errors.emailVerification && <div className="alert alert-danger">{errors.emailVerification}</div>}
                       
                        </div>

                        <div className="form-group form-input-spacing">

                            <input

                                type="password"

                                placeholder="Mot de passe"

                                className="form-control custom-height"

                                name="password"

                                value={formData.password}

                                onChange={handleChange}

                                onFocus={showPasswordHelp}

                                onBlur={hidePasswordHelp}

                            />

                            {passwordHelpActive && (

                                <div className="password-help">

                                    Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (! @ # $ % .).
                                    Il doit avoir une longueur de 8 à 24 caractères.

                                </div>

                            )}

                            {errors.password && <div className="alert alert-danger">{errors.password}</div>}
                        
                        </div>

                        
                        <div className="form-group form-input-spacing">

                            <input

                                type="password"

                                placeholder="Vérification du mot de passe"

                                className="form-control custom-height"

                                name="passwordVerification"

                                value={formData.passwordVerification}

                                onChange={handleChange}

                            />

                            {errors.passwordVerification && <div className="alert alert-danger">{errors.passwordVerification}</div>}
                        
                        </div>

                        <div className="button-register">

                            <button type="submit" className="btn-register">

                                Je m'inscris

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Register;
