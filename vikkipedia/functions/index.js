const functions = require('firebase-functions');
const express=require('express');
const app=express();
const cors = require('cors');
app.use(cors());
const {getAllPosts,createPost}=require('./handlers/posts');
const {signup,login}=require('./handlers/users');
const fbAuth=require('./util/fbAuth')

// const admin=require('firebase-admin');
// admin.initializeApp();

//Post Routes
app.get('/posts',getAllPosts);
app.post('/posts',fbAuth,createPost);

//user routes
app.post('/signup',signup);
app.post('/login',login);


exports.api=functions.https.onRequest(app);