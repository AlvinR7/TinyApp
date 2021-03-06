var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
    for (var i = 6; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  return result;
};

app.post("/urls", (req, res) => {
   let newShortUrl = generateRandomString();
   let newLongUrl = req.body.longURL;
   urlDatabase[newShortUrl] = newLongUrl;
   res.redirect("/urls/"+newShortUrl);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  console.log(req)
  let templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL];
  let templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls')
});

app.post("/urls/:id", (req, res) => {
   const shortURL = req.params.id;
   urlDatabase[shortURL] = req.body.longURL;
   res.redirect('/urls')
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username)
  res.redirect('/urls')
});

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
