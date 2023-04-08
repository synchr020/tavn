const User = require("../models/user");
const passport = require('passport');


module.exports.renderRegister = (req, res) => {
         
    res.render("users/register");
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
          
            res.redirect("/places");
        })


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }



}


module.exports.renderLogin = (req, res) => {

    res.render("users/login");

}

module.exports.login = (req, res) => {
    //|| "/places"
    
    const redirectUrl = req.session.returnTo || "/places" ;
    
    delete req.session.returnTo;
    
    req.flash("success",  `Chào mừng bạn trở lại!`);
    res.redirect(redirectUrl);
    
}
module.exports.loginWithGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

module.exports.loginWithGoogleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Không thể đăng nhập bằng Google');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
       const redirectUrl = req.session.returnTo || "/places";
      delete req.session.returnTo;
      req.flash("success",  `Chào mừng bạn trở lại!`);
      res.redirect(redirectUrl);
      
    });
  })(req, res, next);
};

module.exports.logout = (req,res,next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "Tạm biệt!");
        res.redirect("/places");
    })
    }


