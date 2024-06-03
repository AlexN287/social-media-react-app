import { useNavigate } from 'react-router-dom';

export const useUserNavigation = () => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return { handleUserClick };
};