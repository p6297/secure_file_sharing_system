const express = require("express");
const multer = require("multer");
const {ConnectDB} = require("./config/dbConnection");
const bcrypt = require("bcrypt");
const File = require("./models/file");

const app = express();

app.use(express.urlencoded({extended: true}));

const upload = multer({dest:"uploads"})
app.set("view engine","ejs");

const PORT = process.env.PORT || 5000;
ConnectDB();

//dummy
app.get("/",(req,res)=> {
    res.render("index")
})


app.post("/upload",upload.single("file"),async(req,res)=> {
    const FileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }

    if(req.body.password != null && req.body.password != "" ) {
        FileData.password = await bcrypt.hash(req.body.password,10)
    }

    const file = await File.create(FileData);
    res.render("index",{fileLink: `${req.headers.origin}/file/${file.id}` })


})

app.get("/file/:id",handleDownload)
app.post("/file/:id",handleDownload)

async function handleDownload(req,res) {
    const file = await File.findById(req.params.id);

    if(file.password != null) {
        if(req.body.password == null) {
            res.render("password");
            return;
        }
        if(!(await bcrypt.compare(req.body.password, file.password))) {
            res.render("password",{error:true})
            return;
        }
    }

    file.downloadCount++
    await file.save()
    console.log(file.downloadCount);
    res.download(file.path,file.originalName);


}




app.listen(PORT,()=> console.log(`Server is running on ${PORT}`));