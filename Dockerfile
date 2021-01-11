FROM node:latest as summernote-node

USER node

EXPOSE 8080

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Create app directory
WORKDIR /usr/src/app

CMD ["node"]
