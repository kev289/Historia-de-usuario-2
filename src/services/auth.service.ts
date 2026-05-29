import { UserSession } from '@/interfaces/user.interface';

interface LoginResponse {
  success: boolean;
  user?: UserSession;
  message?: string;
}

export const authService = {
  /**
   * Envía las credenciales al backend para autenticar al usuario
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      return {
        success: false,
        message: 'No se pudo conectar con el servidor.',
      };
    }
  },
};