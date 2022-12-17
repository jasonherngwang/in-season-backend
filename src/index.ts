import http from 'http';
import config from './utils/config';
import app from './app';

const server = http.createServer(app);

server.listen(config.NODE_DOCKER_PORT || 8080, () => {
  console.log(`Server running on port ${config.NODE_DOCKER_PORT}`);
});
