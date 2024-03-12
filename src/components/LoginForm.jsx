import React from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase-config';

const LoginForm = () => {
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Iniciar Sesión</h2>
      <form style={styles.form} onSubmit={handleEmailLogin}>
        <label>
          Email:
          <input type="email" name="email" style={styles.input} required />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" name="password" style={styles.input} required />
        </label>
        <br />
        <button type="submit" style={styles.button}>Iniciar Sesión</button>
      </form>
      <button onClick={handleGoogleLogin} style={styles.googleButton}>Iniciar Sesión con Google</button>
      <p style={styles.registerLink}>
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default LoginForm;

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
};