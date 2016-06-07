FROM node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install  && npm install gulp -g && npm install gulp-cli -g

# Bundle app source
COPY . /usr/src/app

EXPOSE 9000
CMD [ "node", "bin/www" ]
