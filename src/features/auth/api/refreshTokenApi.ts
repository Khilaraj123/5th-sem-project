import apiClient from '../../../lib/axios';

interface RefreshTokenResponse {
  token: string; // The new access token
}

/**
 * Requests a new access token using the stored refresh token.
 * @returns RefreshTokenResponse containing the new access token
 */
export const refreshTokenApi = async (): Promise<RefreshTokenResponse> => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await apiClient.post<any>('/auth/refresh', {
    accessToken: token || '',
    refreshToken: refreshToken || '',
  });
  return {
    token: response.data.accessToken,
  };
};

export default refreshTokenApi;
