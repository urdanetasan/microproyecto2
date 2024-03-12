import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase-config';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    favoriteGame: '',
  });

  const [videoGames, setVideoGames] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchVideoGames = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'videogames'));
        const games = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideoGames(games);
      } catch (error) {
        console.error('Error al obtener la lista de videojuegos:', error);
      }
    };

    fetchVideoGames();
  }, []);

  const isUsernameEmailUnique = async () => {
    const usersCollectionRef = collection(firestore, 'users');
    const usernameQuery = query(usersCollectionRef, where('username', '==', formData.username));
    const emailQuery = query(usersCollectionRef, where('email', '==', formData.email));

    const [usernameResults, emailResults] = await Promise.all([getDocs(usernameQuery), getDocs(emailQuery)]);

    return usernameResults.empty && emailResults.empty;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (!(await isUsernameEmailUnique())) {
        setErrorMessage('Nombre de usuario o email ya están en uso.');
        return;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        favoriteGame: formData.favoriteGame,
        membresia: [],
      });

      console.log('Usuario registrado con éxito:', user);

      navigate('/clubs');
    } catch (error) {
      console.error('Error al registrar el usuario:', error.message);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userSnapshot = await getDocs(userDocRef);

      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          firstName: user.displayName.split(' ')[0] || '',
          lastName: user.displayName.split(' ')[1] || '',
          username: '',
          email: user.email || '',
          favoriteGame: '',
          membresia: [],
        });
      }

      navigate('/clubs');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error.message);
    }
  };

  return (
      <div style={styles.container}>
      <h2 style={styles.heading}>Registro</h2>
      <form style={styles.form} onSubmit={handleRegister}>
      <label>
          Nombre:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Apellido:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Nombre de Usuario:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
  Videojuego Favorito:
  <select
    name="favoriteGame"
    value={formData.favoriteGame}
    onChange={handleChange}
    required
  >
    <option value="" disabled>
      Seleccione un videojuego
    </option>
    <option value="The Witcher 3: Wild Hunt">The Witcher 3: Wild Hunt</option>
    <option value="Red Dead Redemption 2">Red Dead Redemption 2</option>
    <option value="The Legend of Zelda: Breath of the Wild">The Legend of Zelda: Breath of the Wild</option>
    <option value="Dark Souls III">Dark Souls III</option>
    <option value="Super Mario Odyssey">Super Mario Odyssey</option>
    <option value="Overwatch">Overwatch</option>
    <option value="Minecraft">Minecraft</option>
    <option value="Fortnite">Fortnite</option>
    <option value="FIFA 22">FIFA 22</option>
    <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
    <option value="Assassin's Creed Valhalla">Assassin's Creed Valhalla</option>
    <option value="Cyberpunk 2077">Cyberpunk 2077</option>
    <option value="Among Us">Among Us</option>
    <option value="Animal Crossing: New Horizons">Animal Crossing: New Horizons</option>
    <option value="League of Legends">League of Legends</option>
    <option value="Genshin Impact">Genshin Impact</option>
    <option value="Apex Legends">Apex Legends</option>
    <option value="World of Warcraft">World of Warcraft</option>
    <option value="Control">Control</option>
    <option value="Hades">Hades</option>
  </select>
</label>
        <br />
        <button type="submit" style={styles.button}>Registrarse</button>
      </form>
      <button onClick={handleGoogleRegister} style={styles.googleButton}>Registrarse con Google</button>
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      <p style={styles.loginLink}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default RegisterForm;

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
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
};