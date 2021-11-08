#stage1
FROM node as builder
WORKDIR /usr/app
COPY package*.json ./
COPY requirements.txt ./
RUN npm install
COPY . .
RUN npm run build
#stage 2
FROM node
WORKDIR /usr/app
COPY package*.json ./
ADD python-utils ./python-utils/
COPY requirements.txt ./
RUN apt-get update -y 
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip3 install -r ./requirements.txt 
RUN npm install
COPY --from=builder /usr/app/build ./build
COPY .env .
EXPOSE 4002
CMD npm run start
