import mongoose from "mongoose";
let Schema = mongoose.Schema;

let collection = new Schema({
  account_id: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  collection_name: {
    type: String,
    required: false,
  },
});
mongoose.models = {};
let Collection = mongoose.model("Collection", collection);

export default Collection;
