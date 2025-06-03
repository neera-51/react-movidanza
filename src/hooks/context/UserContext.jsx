import { createContext, useContext, useEffect, useState } from "react";
import api from "../../utils/api";

// Establecer un valor por defecto explícito para evitar undefined
const UserContext = createContext({
  user: null,
  checking: true,
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/perfil", { withCredentials: true });
        setUser(res.data.usuario);
      } catch (err) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, checking, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
