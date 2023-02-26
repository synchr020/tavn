const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const places = require("../controllers/places");
const { isLoggedIn, isAuthor, validatePlace, placePagination, reviewPagination } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });


router.route('/')
    .get(placePagination, catchAsync(places.index))
    .post(isLoggedIn, upload.array('image'), validatePlace, catchAsync(places.createPlace));


router.get("/page_:page",placePagination , catchAsync(places.index))


router.get("/new", isLoggedIn, places.renderNewForm);


router.route("/:id")
    .get(reviewPagination,catchAsync(places.showPlace))
    .put(isLoggedIn, isAuthor, upload.array("image"), validatePlace, catchAsync(places.updatePlace))
    .delete(isLoggedIn, isAuthor, catchAsync(places.deletePlace));

router.get("/:id/page_:page",reviewPagination,catchAsync(places.showPlace))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(places.renderEditForm))


module.exports = router;