// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { register } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await register(username, email, password);
//       login(response.data.user, response.data.token);
//       navigate('/inventory');
//     } catch (error) {
//       console.error('Registration failed', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="auth-form">
//       <h2>Register</h2>
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Username"
//         required
//       />
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//         required
//       />
//       <button type="submit">Register</button>
//     </form>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ username, email, password });
      login(response.data.user, response.data.token);
      navigate('/inventory');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;