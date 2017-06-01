import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userlogSchema = new Schema({
  username: String,
  lastAccess: Array
});

export default mongoose.model('userlog', userlogSchema);
