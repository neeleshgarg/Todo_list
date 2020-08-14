
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
mongoose.connect('mongodb+srv://admin-neelesh:Test123@cluster0.vh3mb.mongodb.net/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
  name: String
};

const Item = new mongoose.model("Item", itemsSchema);

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List = new mongoose.model("List", listSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = []; */

/* const item1 = new Item({
  name: "Buy Food"
});
const item2 = new Item({
  name: "Cook Food"
});
const item3 = new Item({
  name: "Eat Food"
});
const defaultItems = [item1, item2, item3]; */
app.get("/", function (req, res) {
  Item.find(function (err, items) {

 /*    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err)
          console.log(err);
        else
          console.log("Successfully created default items");
      })
      res.redirect("/");
    }
    else */
      res.render("list", { listTitle: "Today", newListItems: items });

  })
});

app.post("/", function (req, res) {

  const newItem = req.body.newItem;
  const listName= req.body.list;
  const item=new Item({
    name:newItem
  });
  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
  }

});

app.post("/delete",(req,res)=>{
  const checkedItem=req.body.checkbox;
  const listName=req.body.ListName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItem,function(err){
      if(!err)
      res.redirect("/");
    });
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function(err,items){
      if(!err){
        res.redirect("/"+listName);
      };
    });
  }
  
});

app.get("/:customListName",(req,res)=>{
  const customListName= _.capitalize( req.params.customListName);
  List.findOne({name:customListName},function(err,list){
    if(!err){
      if(!list){
        const list=new List({
          name:customListName,
          items:[]
        })
        list.save();
        res.redirect("/"+customListName);
      }
      else{
        res.render("list", { listTitle: customListName, newListItems: list.items });
      }
    }
  })
})

app.get("/about", function (req, res) {
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});
