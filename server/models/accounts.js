import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  email: String,
  id: String,
  password: String,
  created: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false},
});

export default mongoose.model('account', accountSchema);
