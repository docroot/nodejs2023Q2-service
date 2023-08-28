const cryptSalt = process.env['CRYPT_SALT']
  ? parseInt(process.env['CRYPT_SALT'])
  : 10;
const jwtSecretKey = process.env['JWT_SECRET_KEY'] ?? 'THERE IS NO ANY SECRET';
const jwtSecretRefreshKey =
  process.env['JWT_SECRET_REFRESH_KEY'] ?? 'THERE IS NO ANY SECRET';
const tokenExpireTime = process.env['TOKEN_EXPIRE_TIME'] ?? '1h';
const tokenRefreshExpireTime =
  process.env['TOKEN_REFRESH_EXPIRE_TIME'] ?? '24h';

export const jwtConstants = {
  cryptSalt: cryptSalt,
  jwtSecretKey: jwtSecretKey,
  jwtSecretRefreshKey: jwtSecretRefreshKey,
  tokenExpireTime: tokenExpireTime,
  tokenRefreshExpireTime: tokenRefreshExpireTime,
};
