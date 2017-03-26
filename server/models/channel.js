import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const channelSchema = new Schema({
  name: String,
  id: String,
  private: Boolean,
  participants: Array,
  type: { type:String, default:'CHANNEL' },
  channelID: String,
});

export default mongoose.model('channel', channelSchema);
