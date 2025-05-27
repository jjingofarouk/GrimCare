import { useRouter } from 'next/navigation';

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const requireAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    
    if (!isAuthenticated()) {
      router.push('/auth');
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};