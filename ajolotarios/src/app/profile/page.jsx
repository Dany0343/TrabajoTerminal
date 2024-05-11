import { useSession } from 'next-auth/react';
import UserProfile from '../../components/userProfile';

const UserPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return <p>Acceso denegado. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <UserProfile />
    </div>
  );
};

export default UserPage;
