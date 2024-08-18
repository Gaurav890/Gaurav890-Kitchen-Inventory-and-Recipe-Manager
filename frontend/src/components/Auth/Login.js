// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { login: authLogin } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await login(email, password);
//       authLogin(response.data.user, response.data.token);
//       navigate('/inventory');
//     } catch (error) {
//       console.error('Login failed', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="auth-form">
//       <h2>Login</h2>
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
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      authLogin(response.data.user, response.data.token);
      navigate('/inventory');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;