require('dotenv').config();

export const jwtConstants = {
    secret: process.env.TOKEN_REFRESH_SECRET,
  };