const express = require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route(return all listing) //Create Route
router.route("/").get(wrapAsyc(listingController.index)).post(
  isLoggedIn,

  upload.single("listing[image]"),
  validateListing,
  wrapAsyc(listingController.createListing)
);

//New Route(form render)
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route(Read all listing)
router
  .route("/:id")
  .get(wrapAsyc(listingController.showListing))
  //Update Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsyc(listingController.updateListing)
  )
  //Delete Route
  .delete(isLoggedIn, isOwner, wrapAsyc(listingController.destroyListing));

//Edit Route(form edit)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsyc(listingController.renderEditForm)
);

module.exports = router;
