export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://orb-algo-server-image-ckdbs7u4gq-uc.a.run.app'
    : 'http://localhost:6000';
export const ORB_ALGO = `${BASE_URL}/orb`;
export const GET_STOCK = `${BASE_URL}/stock`;
