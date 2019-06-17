# PRODUCTION DOCKERFILE
# ---------------------
# This Dockerfile allows to build a Docker image of the NestJS application
# and based on a NodeJS 8 image. The multi-stage mechanism allows to build
# the application in a "builder" stage and then create a lightweight production
# image containing the required dependencies and the JS build files.
#
# Dockerfile best practices
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# Dockerized NodeJS best practices
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# https://www.bretfisher.com/node-docker-good-defaults/
# http://goldbergyoni.com/checklist-best-practice-of-node-js-in-production/

# TODO: use node:10-alpine later
# NOTE: Now we use node: 10 instead of node: 10-alpine
# because in node: 10-alpine there were problems about archiving a cous

FROM node:10.15 as builder_dependencies

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY ./package.json /home/node/
COPY ./yarn.lock /home/node/

RUN yarn install --pure-lockfile

# ---

FROM node:10.15 as production_dependencies

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY ./package.json /home/node/
COPY ./yarn.lock /home/node/

RUN yarn install --pure-lockfile

# ---

FROM node:10.15 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --from=builder_dependencies /home/node/node_modules/ /home/node/node_modules/
COPY . /home/node

RUN yarn run tsc:build

# ---

FROM node:10.15

ENV NODE_ENV production

USER node
WORKDIR /home/node
COPY --from=builder /home/node/.env.example /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/fonts/ /home/node/fonts/
COPY --from=builder /home/node/email-templates/ /home/node/email-templates/
COPY --from=production_dependencies /home/node/node_modules/ /home/node/node_modules/

CMD ["node", "dist/main.js"]