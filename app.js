const express = require("express");
const app = express();
const mongoose=require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todoDB",{useNewUrlParser:true});
const itemSchema = new mongoose.Schema({
    name:String
});
const Items = mongoose.model("Items",itemSchema);
const Items1 = mongoose.model("Items1",itemSchema);
app.get("/", function (req, res) {
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var date = new Date();

    var current_date = date.toLocaleDateString("en-US", options);
    Items.find({},function(err,founditems){
            res.render("list", { kindofday: "Its a " + current_date, newlistitems: founditems});
    });
});
app.post("/", function (req, res) {
    let item = req.body.litem;
    console.log(req.body);
    if(req.body.button ==="WORK")
    {
        const item_list1 = new Items1({
            name:item
        })
        item_list1.save();
        res.redirect("/work");
    }
    else{
    const  item_list = new Items({
        name:item
    })
    item_list.save();
    res.redirect("/");
    }
});
app.post("/delete",function(req,res){
    const item_id=req.body.checkbox;
    console.log(req.body.delete);
    if(req.body.delete ==="WORK")
    {
        Items1.findByIdAndRemove(item_id,function(err){
            if(err)
            {
                console.log(err);
            }
            else{
                
                res.redirect("/work");
            }
        });
    }
    else{
    Items.findByIdAndRemove(item_id,function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            
            res.redirect("/");
        }
    });
}
});
app.get("/work", function (req, res) {
    Items1.find({},function(err,founditems1){
        res.render("list", { kindofday: "WORK DAY", newlistitems:founditems1 });
    });
    
});
app.get("/about",function(req,res){
    res.render("about");
});
app.listen(3000, function () {
    console.log("the server is working fine");
});