import mongoose from "mongoose";
const { Schema } = mongoose;

const roomsSchema = new Schema({
  Id: String,
  name: String,
});

export default mongoose.model("RoomDb", roomsSchema);