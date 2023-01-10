const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema(
  {
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    organizerName: String,
    date: Date,
    description: String,
    location: String,
    interested: [String],
    imageUrl: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
