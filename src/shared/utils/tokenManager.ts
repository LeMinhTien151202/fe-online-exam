const ACCESS_TOKEN_KEY = 'access_token';

let accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);

export const tokenManager = {
  getAccessToken: (): string | null => accessToken,

  setAccessToken: (token: string): void => {
    accessToken = token;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken: (): void => {
    accessToken = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
