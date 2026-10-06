export const SITE_URL = '';
export const API_URL = `${SITE_URL}${import.meta.env.VITE_API_URL}`;
export const TPL_URL = `${import.meta.env.VITE_ASSETS_PATH}${import.meta.env.VITE_TPL_PATH}`;

export const RESPONSE_DATA = {
  data: {},
  success: false,
  message: "Некорректный запрос",
};
