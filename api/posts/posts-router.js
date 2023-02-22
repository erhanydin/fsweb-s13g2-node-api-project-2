// posts için gerekli routerları buraya yazın

const express = require("express");
const Post = require("./posts-model");

const router = express.Router();


// GET Api
router.get("/", (req, res) => {
    Post.find().then((posts) => {
        res.status(200).json(posts);
    }).catch((err) => {
        res.status(500).json({message: "Gönderiler alınamadı"});
    });
});

// GET by id Api

router.get("/:id", (req, res) => {
    Post.findById(req.params.id).then((post) => {
        if(!post) {
            res.status(404).json({message: "Belirtilen ID'li gönderi bulunamadı" });
        } else {
            res.json(post);
        }
    }).catch(err => {
        res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

// POST Api
// router.post("/", (req, res) => {
//     const { title, contents} = req.body;
//     if(!title && !contents) {
//         res.status(400).json({message: "Lütfen gönderi için bir title ve contents sağlayın"});
//     } else {

//         Post.insert({title, contents}).then(({id}) => {
//             Post.findById(id).then((findedPost) => {
//                 res.status(201).json(findedPost);
//             });
//         }).catch(err => {
//             res.status(500).json({message: "Veritabanına kaydedilirken bir hata oluştu"});
//         });
//     }
// });

router.post("/", async (req, res) => {
    const { title, contents} = req.body;
    if(!title || !contents) {
        res.status(400).json({message: "Lütfen gönderi için bir title ve contents sağlayın"});
    } else {
        try {
            let { id } =await Post.insert({title, contents});
            let insertedPost =await Post.findById(id);
            res.status(201).json(insertedPost);

        } catch (error) {
            res.status(500).json({message: "Veritabanına kaydedilirken bir hata oluştu"});
        }   
       
    }
});

// PUT Api

router.put("/:id", async (req, res) => {
    let existPost = await Post.findById(req.params.id);
    if(!existPost) {
        res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
        let {title, contents} = req.body;
        if(!title || !contents) {
            res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
        } else {
            try {
                let updatedPostId = await Post.update(req.params.id, req.body);
                let updatedPost = await Post.findById(updatedPostId);
                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
            }
        }
    }
});

// DELETE Api

router.delete("/:id", async (req, res) => {
    try {
        let existPost = await Post.findById(req.params.id);
        if(!existPost) {
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        } else {
            await Post.remove(req.params.id);
            res.status(200).json(existPost);
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi silinemedi"});
    }
});

// GET COMMENTS Api

router.get("/:id/comments", async (req, res) => {
    try {
        let existPost = await Post.findById(req.params.id);
        if(!existPost) {
            res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
        } else {
            let comments = await Post.findPostComments(req.params.id);
            res.status(200).json(comments);
        }
    } catch (error) {
        res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
    }
})





module.exports = router;
