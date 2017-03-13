const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';


export default {
  port: env.OPENSHIFT_NODEJS_PORT || 8080,
  host: env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  },
  dbUrl : 'mongodb://localhost:27017/dbTest',
};
