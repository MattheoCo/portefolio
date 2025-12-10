FROM node:18-alpine
WORKDIR /app
# Copy proxy package.json relative to build context
COPY proxy/package.json ./package.json
RUN npm install --production
# Copy proxy service and frontend into the image (build context is project root)
COPY proxy ./proxy
COPY frontend ./frontend

# Run the proxy service
WORKDIR /app/proxy
EXPOSE 4100
CMD ["node","index.js"]
