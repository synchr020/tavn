const { placeSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Place = require('./models/place');
const Review = require("./models/review");



module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Bạn phải có tài khoản!");
    return res.redirect("/login");
  }
  next();
}



module.exports.isLoggedInWithGoogle = (req, res, next) => {
  if (req.isAuthenticated() || req.user.googleId) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Bạn phải có tài khoản!");
    return res.redirect("/login");
  }
}
module.exports.isLoggedInGoogle = (req, res, next) => {
  if (req.isAuthenticated() || req.user.provider === 'google') {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'You must be logged in with a Google account to access this page.');
  return res.redirect('/login');
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (!place.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/places/${place._id}`)
  }
  next();


}

module.exports.placePagination = async (req, res, next) => {
  let perPage = 6;
  let page = req.params.page || 1;
  const xxx = await Place.find();
  Place
    .find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, places) => {
      Place.countDocuments(async (err, count) => {
        if (err) return next(err);
        
        res.render("places/index", {
          places,
          current: page,
          pages: Math.ceil(count / perPage),
          xxx
        });
      })
    });
}
module.exports.reviewPagination = async (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  
  try {
    const place = await Place.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      })
      .populate("author");

    if (!place) {
      req.flash("error", "Không tìm thấy khu du lịch này!")
      return res.redirect("/places");
    }

    const reviews = place.reviews.slice((perPage * page) - perPage, perPage * page);
    const count = place.reviews.length;

    res.render("places/show", {
      reviews,
      place,
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllPlaces = (req, res, next) => {
  Place.find({}, (err, places) => {
    if (err) return next(err);
    res.locals.AllPlaces = places;
    console.log(res.locals.AllPlaces);
    next();
  });
};

// module.exports.renderMapPage = async (req, res) => {
//   try {
//     const allPlaces = await Place.find();
//     res.render("map", {
//       mapToken: process.env.MAPBOX_TOKEN,
//       AllPlaces: allPlaces
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// };


module.exports.validatePlace = (req, res, next) => {

  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next();
  }

}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  const place = await Place.findById(id);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/places/${place._id}`)
  }
  next();


}
