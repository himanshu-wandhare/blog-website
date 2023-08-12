const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const {homeStartingContent,aboutContent,contactContent} = require("./titles");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema =  new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}).then(post => {
    res.render("home", {
      homeContent: homeStartingContent,
      posts: post
    });
  })
});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  const post = new Post({title: postTitle, content: postBody});

  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", (req, res) => {
   const postId = req.params.postId;
   Post.findOne({_id: postId}).then(post => {
    res.render("post",{posts: post})
   })
});

app.listen( process.env.PORT ||3000, function() {
  console.log(`Server started on port ${process.env.PORT}`);
});