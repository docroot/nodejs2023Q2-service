import { Logger } from '@nestjs/common';

const cryptSalt = process.env['CRYPT_SALT']
  ? parseInt(process.env['CRYPT_SALT'])
  : 10;
const jwtSecretKey = process.env['JWT_SECRET_KEY'] ?? 'THERE IS NO ANY SECRET';
const jwtSecretRefreshKey =
  process.env['JWT_SECRET_REFRESH_KEY'] ?? 'THERE IS NO ANY SECRET';
const tokenExpireTime = timeIntToMs(process.env['TOKEN_EXPIRE_TIME'])
  ? timeIntToMs(process.env['TOKEN_EXPIRE_TIME'])
  : 3600;
const tokenRefreshExpireTime = timeIntToMs(
  process.env['TOKEN_REFRESH_EXPIRE_TIME'],
)
  ? timeIntToMs(process.env['TOKEN_REFRESH_EXPIRE_TIME'])
  : 86400;

Logger.debug(`Auth serivice's config:`);
Logger.debug(`CRYPT_SALT: [${cryptSalt}]`);
Logger.debug(`JWT_SECRET_KEY: [${jwtSecretKey}]`);
Logger.debug(`TOKEN_EXPIRE_TIME: [${tokenExpireTime}]`);
Logger.debug(`JWT_SECRET_REFRESH_KEY: [${jwtSecretRefreshKey}]`);
Logger.debug(`TOKEN_REFRESH_EXPIRE_TIME: [${tokenRefreshExpireTime}]`);

export const jwtConstants = {
  cryptSalt: cryptSalt,
  jwtSecretKey: jwtSecretKey,
  jwtSecretRefreshKey: jwtSecretRefreshKey,
  tokenExpireTime: tokenExpireTime,
  tokenRefreshExpireTime: tokenRefreshExpireTime,
};

function timeIntToMs(interval: string): number | null {
  const regex = /^(\d+)([mhd])$/;

  const match = interval.match(regex);

  if (!match) {
    return null;
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'm':
      return value * 60 * 1000;

    case 'h':
      return value * 3600 * 1000;

    case 'd':
      return value * 86400 * 1000;

    default:
      return null;
  }
}
