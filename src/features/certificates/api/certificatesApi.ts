import apiClient from '../../../lib/axios';
import type { Certificate } from '../types/certificate.types';

export const getMyCertificates = async (): Promise<Certificate[]> => {
  const response = await apiClient.get<Certificate[]>('/Certificates/user/my-certificates');
  return response.data;
};

export const getCertificateById = async (id: string): Promise<Certificate> => {
  const response = await apiClient.get<Certificate>(`/Certificates/${id}`);
  return response.data;
};

export const getCertificateDownloadUrl = (id: string): string => {
  const baseURL = apiClient.defaults.baseURL || 'http://localhost:5000/api';
  return `${baseURL}/Certificates/${id}/download`;
};
