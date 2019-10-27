FROM nikolaik/python-nodejs:python3.8-nodejs8
WORKDIR /app
COPY . ./
WORKDIR /app/server
RUN yarn install --frozen-lockfile
EXPOSE 5000
CMD [ "yarn", "start" ]