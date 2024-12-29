import { apiLogin, apiLogout } from '../API/utils'

export async function login(e : any) {
  try {
    const response = await apiLogin(e)
    return response; 
  } catch (error: any) {
    
    throw error.response.data; 
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await apiLogout()
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout failed');
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('access_token');
  return !!token; 
}
