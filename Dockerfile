FROM node:18-alpine
RUN apk update && apk add curl

WORKDIR /app
## To run as 'node' you must remove `child_process.spawn('ip',..` from server.js.
## Then 'localhost' needs to be used in payloads instead of '169.254.169.254'.
# RUN chown node /app
# USER node
COPY package*.json ./
COPY app/* ./
RUN npm ci --omit=dev

# Install ec2 IMDS mock
RUN curl -Lo ec2-metadata-mock https://github.com/aws/amazon-ec2-metadata-mock/releases/download/v1.11.2/ec2-metadata-mock-`uname | tr '[:upper:]' '[:lower:]'`-amd64
RUN chmod +x ec2-metadata-mock
EXPOSE 4000
CMD [ "node", "server.js" ]

