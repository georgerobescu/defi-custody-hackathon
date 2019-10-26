FROM nikolaik/python-nodejs:python3.8-nodejs12 as react-build
WORKDIR /app
COPY . ./
WORKDIR /app/server
RUN yarn install --frozen-lockfile
EXPOSE 500
CMD [ "yarn", "start" ]