import mongoose from "mongoose";
const { Schema } = mongoose;

const roomsSchema = new Schema({
  id: String,
  name: String,
});

export default mongoose.model("RoomDb", roomsSchema);