const env = process.env;
const localDB = 'mongodb://localhost:27017/chatDB';
export const nodeEnv = env.NODE_ENV || 'development';


export default {
  port: env.PORT || 8080,
  host: env.HOST || 'localhost',
  domain: env.DOMAIN || 'localhost',
  get serverUrl() {
    return `https://${this.host}:${this.port}`;
  },
  nodeEnv,
  //dbUrl : 'mongodb://localhost:27017/chatDB',
  dbUrl : nodeEnv==='development'?cloudDB:localDB,
  jwtSecret: 'Godsenal!3737',
  //sessionSecret: 'Godsenal!3737',
};
