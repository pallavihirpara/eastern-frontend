import { get, post, del } from './https';

export const apiLogin = (params: any): Promise<any> => { return post('/login', params) };
export const apiLogout = (): Promise<any> => { return get('/logout') }

//Users Api
export const apiGetUsers = (params: any): Promise<any> => { return get('/users', params) };
export const apiCreateUser = (params: any): Promise<any> => { return post('/users', params) };
export const apiEditUser = (id: any, params: any): Promise<any> => { return post(`/users/${id}`, params) };
export const apiGetUser = (params: any): Promise<any> => { return get(`/users/${params}`) };
export const apiDeleteUsers = (params: any): Promise<any> => { return del(`/users/${params}`) };
export const apiDeleteMultipleUsers = (params: any): Promise<any> => { return del('/users-delete-multiple', params) };


export const apiRole = (): Promise<any> => { return get(`/Role`) };
export const apiUser = (): Promise<any> => { return get(`/User/1`) };

// rolesList