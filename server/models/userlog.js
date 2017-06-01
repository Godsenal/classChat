import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userlogSchema = new Schema({
  username: String,
  channellogs: Object,
});

export default mongoose.model('userlog', userlogSchema);
