FROM node:16
WORKDIR /app
COPY . /app
RUN wget https://github.com/joan2937/pigpio/archive/master.zip
RUN unzip master.zip && cd pigpio-master && make && make install
RUN npm install
CMD [ "npm", "start" ]