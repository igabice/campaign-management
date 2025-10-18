import http from "../lib/http";

export const authService = {
  checkAdminStatus: async (): Promise<boolean> => {
    try {
      const response = await http.get("/auth/is-admin");
      return response.data.isAdmin;
    } catch (error) {
      return false;
    }
  },
};
