const env = process.env;
const localDB = 'mongodb://localhost:27017/chatDB';
const cloudDB = 'mongodb://godsenal:xogmltjdrhd77@ds129600.mlab.com:29600/heroku_k4k7hk8l';
export const nodeEnv = env.NODE_ENV || 'development';


export default {
  port: env.PORT || 8080,
  host: env.HOST || 'localhost',
  domain: env.DOMAIN || 'localhost',
  get serverUrl() {
    return `https://${this.host}:${this.port}`;
  },
  //dbUrl : 'mongodb://localhost:27017/chatDB',
  dbUrl : nodeEnv==='development'?cloudDB:localDB,
  jwtSecret: 'Godsenal!3737',
  //sessionSecret: 'Godsenal!3737',
};
