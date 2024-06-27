import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  useEffect(() => { !token ? navigate('/login') : navigate('/dashboard') });
};
export default Home;
