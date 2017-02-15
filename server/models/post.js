import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: String,
  authorNickname: String,
  comment: String,
  published_date: { type: Date, default: Date.now  }
});

const postSchema = new Schema({
  type: String,
  author: String,
  authorNickname: String,
  title: String,
  contents: String,
  comments: [commentSchema],
  published_date: { type: Date, default: Date.now  }
});



export default mongoose.model('post', postSchema);
