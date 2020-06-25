FROM node:12-alpine AS build
WORKDIR /opt/app
COPY package.json package-lock.json tsconfig.json /opt/app/
COPY src/ /opt/app/src/
RUN npm install
RUN npm run build

FROM node:12-alpine
ENV DOCKER true
ENV PORT 8080
EXPOSE 8080
WORKDIR /opt/app
COPY package.json package-lock.json /opt/app/
RUN npm install --production
COPY --from=build /opt/app/out/ /opt/app/out/
CMD [ "node", "out" ]
