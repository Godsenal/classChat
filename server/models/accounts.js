import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  id: String,
  password: String,
  nickname: String,
  created: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false},
});

export default mongoose.model('account', accountSchema);
