
const mongoose = require("mongoose");
const cities = require("./cities");
const Place = require('../models/place');
const { places, descriptors } = require("./seedHelpers");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/tavn", {
    useNewUrlParser: true,
    useUnifiedTopology: true

})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = (array) => array[Math.floor(Math.random() * array.length)];




const seedDB = async () => {
    await Place.deleteMany({});
    //xoa het du lieu

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Place({
            author: "63f8d226b71ecbb6f39b7b6b",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "come with us, the place have nice view and beautiful tent!",
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dh312cfev/image/upload/v1676173552/xmzthlkr8ynynukmpaoo.jpg',
                    filename: 'YelpCamp/xmzthlkr8ynynukmpaoo'

                },
                {
                    url: 'https://res.cloudinary.com/dh312cfev/image/upload/v1676175731/YelpCamp/mebacua0yxujzlfz40j7.jpg',
                    filename: 'YelpCamp/clohqevtxljzir81eufn'
                }

            ]
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});