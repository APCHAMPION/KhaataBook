const { render } = require("ejs");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static('public'));
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/",(req,res)=>{
    fs.readdir("./files", (err,files)=>{
        if(err) console.log(err);
        res.render("main",{files :files});
    })
    
});

app.get("/createNew", (req, res) => {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth(); 
    let year = currentDate.getFullYear();
    const filename = `${day}-${month}-${year}`;

    fs.readdir("./files", (err, files) => {
        if (err) {
            return res.send("Error reading directory");
        }

        let flag = false;

        files.forEach((file) => {
            if (file.substring(0,9) === filename) {
                flag = true;
                return file;
            }
        });

        if (flag) {
            return res.redirect(`/edit/${filename}.txt`);
        }

        res.render("CreateNew", { filename: filename});
    });
});


app.post("/createNew/:filename",(req,res)=>{
    fs.writeFile(`./files/${req.params.filename}.txt` ,req.body.fileData,(err)=>{
        if(err) res.send(err);
        res.redirect("/");
    });
    
});

app.get('/edit/:filename', (req, res) => {
    let filename = req.params.filename;
    const filedata = fs.readFile(`./files/${filename}`,'utf-8',(err,filedata)=>{
        if(err) return res.status(500).send("Something went Wrong");
        res.render("Edit", { filename: filename , filedata : filedata});
    })
});

app.post("/update/:filename",(req,res)=>{
    fs.writeFile(`./files/${req.params.filename}` ,req.body.fileData,(err)=>{
        if(err) res.send(err);
        res.redirect("/");
    });
    
});

app.get("/hisaab/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,filedata)=>{
        if(err) return res.status(500).send("Something went Wrong");
        res.render("Hisaab",{filename : req.params.filename,filedata : filedata});
    })
    
})

app.get("/delete/:filename",(req,res)=>{
    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        if(err) return res.status(500).send("something went wrong");
        res.redirect("/");
    })
})


app.listen(3000,(err)=>{
    if(err) console.log("server error!");

})
