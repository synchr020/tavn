const User = require("../models/user");
const passport = require('passport');


module.exports.renderRegister = (req, res) => {
            req.flash("error", 
"TAVN version 1.0.1 đã hoàn thành! Cập nhật thêm đăng nhập bằng gu gồ và phân trang! Developed by Đạt - AaronOfROD");

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
                req.flash("error", 
"TAVN version 1.0.1 đã hoàn thành! Cập nhật thêm đăng nhập bằng gu gồ và phân trang! Developed by Đạt - AaronOfROD");

            //req.flash("success", "Chào mừng bạn đến với TAVN");
            res.redirect("/places");
        })


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }



}


module.exports.renderLogin = (req, res) => {
    req.flash("error", 
"TAVN version 1.0.1 đã hoàn thành! Cập nhật thêm đăng nhập bằng gu gồ và phân trang! Developed by Đạt - AaronOfROD");

    res.render("users/login");

}

module.exports.login = (req, res) => {
    req.flash("error", 
"TAVN version 1.0.1 đã hoàn thành! Cập nhật thêm đăng nhập bằng gu gồ và phân trang! Developed by Đạt - AaronOfROD");

  //  req.flash("success",  `Chào mừng bạn trở lại!`);
    const redirectUrl = req.session.returnTo || "/places";
    delete req.session.returnTo;
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
        req.flash("error", 
"TAVN version 1.0.1 đã hoàn thành! Cập nhật thêm đăng nhập bằng gu gồ và phân trang! Developed by Đạt - AaronOfROD");

     // req.flash('success', `Chào mừng bạn !`);
       const redirectUrl = req.session.returnTo || "/places";
      delete req.session.returnTo;
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


