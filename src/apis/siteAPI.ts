import axios from './axios';
import { CreateSiteRequest, Site } from '../types/site';

export const createSiteApi = async (payload: CreateSiteRequest): Promise<Site> => {
  const response = await axios.post<Site>('/api/sites', payload);
  return response.data;
};

export const getSitesByUserApi = async (userId: string): Promise<Site[]> => {
  const response = await axios.get<Site[]>(`/api/sites/user/${userId}`);
  return response.data;
};
