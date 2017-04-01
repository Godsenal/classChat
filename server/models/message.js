import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: String,
  channelID: String,
  contents: String,
  types : { type: String, default: 'message'},
  url : { type: String, default: ''},
  userName: Object,
  created: { type: Date, default: Date.now },
});

export default mongoose.model('message', messageSchema);
