const Review = require("../models/review");
const Places = require('../models/place');


module.exports.createReview = async(req,res)=>{
    const place = await Places.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("success", "Đánh giá thành công!");
    res.redirect(`/places/${place._id}`);

}
module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Places.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash("success","Xóa thành công review!")
    res.redirect(`/places/${id}`)
}