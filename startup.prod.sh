#!/usr/bin bash
set -e

npm run prisma:generate
npm run migrate:deploy
npm run start:prod
