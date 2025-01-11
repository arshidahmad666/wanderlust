const mongoose = require("mongoose");
const review = require("./review");
const { ref, required } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
    // type: String,
    // default:
    //   "https://unsplash.com/photos/a-lone-tree-in-a-foggy-field-8j35T0jGvFI",
    // set: (v) =>
    //   v === ""
    //     ? "https://unsplash.com/photos/a-lone-tree-in-a-foggy-field-8j35T0jGvFI"
    //     : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String, //Don't do {location:{type:String}}
      enum: ["Point"], //location.type must be Point
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
//Handling deletion
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
