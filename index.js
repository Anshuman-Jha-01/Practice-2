const User = require("./model/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");

const session = require("express-session");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const flash = require("connect-flash");
const { MongoStore } = require("connect-mongo");

app.use(
  session({
    secret: "string",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://anshumanjha4181:cRFRA2wrFUhuYevb@practicecluster.f8cvn.mongodb.net/?appName=practiceCluster",
      crypto: {
        secret: "secretstring",
      },
      touchAfter: 2000,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

async function connect() {
  await mongoose.connect(
    "mongodb+srv://anshumanjha4181:cRFRA2wrFUhuYevb@practicecluster.f8cvn.mongodb.net/?appName=practiceCluster",
  );
}

app.listen(3000, async () => {
  console.log("Server started at port 3000");
  connect()
    .then((res) => {
      console.log("Database connection established");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  let { email, username, password } = req.body;
  const usr = new User({
    email: email,
    username: username,
  });
  let result = await User.register(usr, password);
  console.log(result);

  req.login(result, (err) => {
    if (err) res.redirect("/login");
  });

  res.render("user.ejs", { usr: req.user });
});

app.get("/login", (req, res) => {
  const msg = req.flash("Failure");
  res.locals.actualPath = req.session.actualPath||"";
  res.render("login.ejs", { msg });
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    let { original } = req.query;

    if (original) {
      res.redirect(original);
    } else {
      console.log(req.isAuthenticated());
      console.log(req.user);
      res.render("user.ejs", { usr: req.user });
    }
  },
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    console.log(req.isAuthenticated());
    console.log(req.user);
    res.redirect("/login");
  });
});

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated() == false) {
    console.log(req.originalUrl);
    req.session.actualPath = req.originalUrl;
    req.flash("Failure", "Please login to access the data");
    res.redirect("/login");
  } else {
    next();
  }
};

app.get("/data", loggedIn, (req, res) => {
  res.send([1, 2, 3, 4, 5]);
});
