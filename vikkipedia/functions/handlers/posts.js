const {db}=require('../util/admin');
const Joi=require('@hapi/joi');

exports.getAllPosts=(req,res)=>{
    db.collection('posts').get()
    .then(data=>{
        let posts=[];
        data.forEach(doc => {
            posts.push({
                postId:doc.id,
                title:doc.data().title,
                body:doc.data().body,
                image:doc.data().image,
                author:doc.data().author,
                createdAt:doc.data().createdAt
            });
        });
        return res.status(200).json(posts);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    })
}

exports.createPost=(req,res)=>{
    let newPost={
        title:req.body.title,
        body:req.body.body,
        author:req.user.username, //req.body.userHandle
        image:"",
        createdAt: new Date().toISOString()  
    }

    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        author: Joi.string(),
        image: Joi.string().allow("").optional(),
        createdAt:Joi.string()
    })

    const result = Joi.validate(newPost, schema,{abortEarly: false}); //{abortEarly: false} to display all errors
    if(result.error){
        let errors={}
        result.error.details.forEach((err)=>{
            errors[err.context.label]=err.message;
        })
        return res.status(400).json(errors);
    }

    db.collection('posts').add(newPost)
    .then(doc=>{
        res.json({message:`Document ${doc.id} added successfully`})
    })
    .catch(err=>{
        res.status(500).json({error:"something went wrong"});
        console.log(err);
    })
}