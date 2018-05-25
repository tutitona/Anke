
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.render("index",{});
});
/** 検索処理　現在すべてのデータを返すだけ**/
app.post('/search/',function(req,res){
  find({},{},function(JSON){
    res.json(JSON);
  });
});
/** 質問投稿 **/
app.post('/post/',function(req,res){
  const obj = req.body;
  const rep = [];
  for(let i in obj.ansers){
    rep[i] = {anser:obj.ansers[i],total:0};
  }
  obj.ansers = rep;
  insert(obj);
  res.json(obj);
});
/** 投票 **/
app.post('/vote/',function(req,res){
  vote(req.body.id,req.body.index);
  find({_id:mongo.ObjectID(req.body.id)},{},function(JSON){
    res.json(JSON[0].ansers);
  });
});

app.listen(80);

//callback関数に検索結果を適用する。ただし,totalは返さない
function find(key,filter,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    dbo.collection("question").find(key,filter).toArray(function(err, result) {
      if (err) throw err;
      database.close();
      callback(result);
    });
  });
};
//投票する
function vote(id,index){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const objId = mongo.ObjectID(id);
    dbo.collection("question").updateOne({_id:objId},{$inc:{[`ansers.${index}.total`]: 1}},
    function(err, res) {
      if (err) throw err;
      database.close();
    });
  })
}
//ObjectをDBに挿入する
function insert(obj){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    dbo.collection("question").insertOne(obj, function(err, result) {
      if (err) throw err;
      database.close();
    });
  });
}
