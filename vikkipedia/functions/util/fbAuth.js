const {db,admin}=require('./admin');

module.exports=(req,res,next)=>{
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken=req.headers.authorization.split('Bearer ')[1];
        console.log(idToken);

    }else{
        console.error('No token found!');
        return res.status(403).json({error:'Unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken=>{
        req.user=decodedToken;
        //console.log('Decoded Token',decodedToken);
        //console.log(req.user);
        return db.collection('users').
        where('userId','==', req.user.uid)
        .limit(1)
        .get();
        //.then((data)=>{
           // console.log(data.docs[0].data());
       // })
    })
    .then(data=>{
        console.log(data.docs[0].data().username);
       req.user.username=data.docs[0].data().username;
       return next();
   })
    .catch(err=>{
        console.error('Error verifying Token',err);
        return res.status(403).json(err);
    })
}