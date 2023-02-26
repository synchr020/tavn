
const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const ImagesSchema = new Schema({
    url: String,
    filename: String
})


ImagesSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_160");
})

const opts = { toJSON: { virtuals: true } };

const PlaceSchema = new Schema({
    title: String,
    images: [ImagesSchema],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
},opts);

PlaceSchema.virtual("properties.popUpMarkup").get(function(){
    return `
    <strong> <a href="/places/${this._id}" >${this.title}</a></strong>
    <p>${this.description.substring(0,50)}...</p>    
    `;
})

PlaceSchema.post("findOneAndDelete",async function(doc){
    if(doc){
        await Review.deleteMany({
           _id:{
            $in:doc.reviews
           }
        })
    }

} )

module.exports = mongoose.model("Place", PlaceSchema);

