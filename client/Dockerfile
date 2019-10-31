FROM nikolaik/python-nodejs:python3.8-nodejs8 as react-build
WORKDIR /app
COPY . ./
WORKDIR /app/client
RUN yarn install --frozen-lockfile
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]