import { IUser } from '@/interfaces/user.interface';

interface CRUDResponse {
  success: boolean;
  user?: IUser;
  message?: string;
}

export const userService = {
  /**
   * Obtiene la lista de todos los usuarios registrados (sin contraseña)
   */
  getUsers: async (): Promise<IUser[]> => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios del servidor.');
      }
      const data: IUser[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error en userService.getUsers:', error);
      return [];
    }
  },

  /**
   * Crea un nuevo usuario en el sistema
   */
  createUser: async (userData: Omit<IUser, '_id'>): Promise<CRUDResponse> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: CRUDResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en userService.createUser:', error);
      return { success: false, message: 'Error de red al intentar crear el usuario.' };
    }
  },

  /**
   * Actualiza los datos de un usuario por su ID
   */
  updateUser: async (id: string, userData: Partial<IUser>): Promise<CRUDResponse> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: CRUDResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en userService.updateUser:', error);
      return { success: false, message: 'Error de red al intentar actualizar el usuario.' };
    }
  },

  /**
   * Elimina un usuario del sistema por su ID
   */
  deleteUser: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en userService.deleteUser:', error);
      return { success: false, message: 'Error de red al intentar eliminar el usuario.' };
    }
  },
};