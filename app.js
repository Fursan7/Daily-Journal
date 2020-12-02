const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://ahmad-admin:6XauHWQ1qJJPfb1Y@blog-database.k6afp.mongodb.net/Blog_Database?retryWrites=true&w=majority";
mongoose.connect(connectionString, { useNewUrlParser: true });

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model("Post", postSchema);

const posts = [];
const homeStartingContent =
  "Article written by Fursan. You can compose your own journal text here with a title and body.";
const aboutContent =
  "You can compose your own journal text here with a title and body.";
const contactContent =
  "Fursan Afzal - sp18-bse-083@cuilahore.edu.pk";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, foundItems) {
    res.render("home", { home: homeStartingContent, posts: foundItems });
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  const newPost = new Post({ title: postTitle, body: postBody });
  newPost.save();

  // posts.push(post);
  res.redirect("/");
});

app.get("/posts/:topic", function (req, res) {

  Post.find({}, function (err, foundItems) {
    
    foundItems.forEach(function (post) {
      const storedTitle = post.title;
      if (storedTitle === req.params.topic) {
        res.render("post", {
          title: post.title,
          body: post.body
        });
      }
    });
  });
  
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.btn;
  console.log(checkedItemId);
  Post.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
    else{
      console.log(err);
    }
  });
});

let port = process.env.PORT;
app.listen(port, function () {
  console.log("Server started on port 3000");
});
