// src/hooks/useUserAuth.js
import { useEffect, useState } from "react";
import api from "../../utils/api";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/perfil", { withCredentials: true });
        setUser(response.data.usuario);
      } catch (err) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    fetchUser();
  }, []);

  return { user, checking, setUser };
};

export default useUser;
