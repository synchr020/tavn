if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const userRoutes = require("./routes/users")
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

const MongoDBStore = require('connect-mongo');


const dbUrl = process.env.DB_URL;
//const dbUrl="mongodb://127.0.0.1:27017/yelpcamp";
mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, {
    
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(mongoSanitize({
    replaceWith: "_"
}));

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: "thisshouldbeabettersecret!",
    touchAfter: 24 * 60 * 60
    
})


store.on("error",function(e){
console.log("SESSION STORE ERROR",e)
})
const sessionConfig = {
    store,
    name: "session",
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }


}

app.use(session(sessionConfig));
app.use(flash());
//app.use(helmet({contentSecurityPolicy:false}));
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dh312vfev",
    "https://thuthuatnhanh.com/"
];
//This is the array that needs added to
const styleSrcUrls = [
      "https://stackpath.bootstrapcdn.com/",
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dh312vfev/",
    "https://thuthuatnhanh.com/"
];
const connectSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://res.cloudinary.com/dh312vfev/",
    "https://thuthuatnhanh.com/"
];
const fontSrcUrls = ["https://res.cloudinary.com/dh321cfev/"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/",  
                "https://images.unsplash.com/",
                "https://thuthuatnhanh.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dh312cfev/" ],
            childSrc   : [ "blob:" ]
        },
        crossOriginEmbedderPolicy: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
 
  res.locals.currentUser = req.user;
  res.locals.success =  req.flash("success");
  res.locals.error = req.flash("error");
  
  next();
})

app.use("/",userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews",reviewsRoutes);


app.get("/", (req, res) => {
    res.render("home");
})



app.all("*", (req, res,next) => {
 next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";

    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("Serving on port 3000.");
})