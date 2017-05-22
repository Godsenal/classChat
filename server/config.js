const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';


export default {
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  get serverUrl() {
    return `https://${this.host}:${this.port}`;
  },
  //dbUrl : 'mongodb://localhost:27017/chatDB',
  dbUrl : 'mongodb://godsenal:xogmltjdrhd77@ds129600.mlab.com:29600/heroku_k4k7hk8l',
  jwtSecret: 'Godsenal!3737',
  //sessionSecret: 'Godsenal!3737',
};
