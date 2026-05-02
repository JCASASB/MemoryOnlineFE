import type { PlayerStats } from "../../ui/pages/innerPages/PlayerStats";
import api from "./api"; // Tu instancia con interceptores
import type { AxiosResponse } from "axios";

// 1. Define tus interfaces de datos
interface UserStats {
  id: number;
  name: string;
}

// 2. Crea el objeto con tus métodos
export const apiService = {
  /*
  // Método para obtener usuarios
  getUsers: (): Promise<AxiosResponse<User[]>> => {
    return api.get<User[]>("/users");
  },
*/
  // Método para crear un producto
  loginUser: (username: string, password: string): Promise<AxiosResponse> => {
    return api.post("/Auth/login", {
      UserName: username.trim(),
      Password: password,
    });
  },

  // Método con parámetros dinámicos
  getUserStatsById: (id: string): Promise<AxiosResponse<PlayerStats>> => {
    return api.get<PlayerStats>(`/profiles/stats/${id}`);
  },
};
