export const getAllPost = async(req,res) => {
    const userId= req.userId
    console.log("its in the getfollowed posgt in postController",userId);
    try {
     const followers=await UserModel.find()
      const CurrentUserPost = await PostModel.find({userId:userId})
      const followingPost = await UserModel.aggregate([
         {
             '$match': {
               '_id': mongoose.Types.ObjectId(userId)
             }
           }, {
             '$lookup': {
               'from': 'posts',
               'localField': 'following',
               'foreignField': 'userId',
               'as': 'followingPost'
             }
           }, {
             '$project': {
               'followingPost': 1
             }
           }, {
             '$lookup': {
               'from': 'posts',
               'localField': '_id',
               'foreignField': 'userId',
               'as': 'userPost'
             }
           }, {
             '$project': {
               '_id': 0,
               'allPosts': {
                 '$concatArrays': [
                   '$followingPost', '$userPost'
                 ]
               }
             }
           }, {
             '$unwind': {
               'path': '$allPosts'
             }
           }, {
             '$lookup': {
               'from': 'users',
               'localField': 'allPosts.userId',
               'foreignField': '_id',
               'as': 'user'
             }
           }, {
             '$unwind': {
               'path': '$user'
             }
           }, {
             '$project': {
               'allPosts': 1,
               'user.username': 1,
               'user.email': 1,
               'user.profilePicture':1,
             }
           }, {
             '$replaceRoot': {
               'newRoot': {
                 '$mergeObjects': [
                   '$allPosts', '$user'
                 ]
               }
             }
           }, {
             '$sort': {
               'createdAt': -1
             }
         }
      ])
      console.log("spaam",followingPost)
      let posts = followingPost
      res.status(200).json({posts,userId})
    } catch (error) {
     res.status(500).json(error)
    }
 }
 
 //Get a post
 export const getPost = async (req,res) => {
     const id=req.params.id
     console.log("Enterd to getposet with id",id)
     try {
         const post = await PostModel.findById(id)
         res.json(200).json(post)
     } catch (error) {
         res.status(500).json(error)
         
     }
 }