var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const ary = {query:"質問",replys:[{reply:"s1",total:0},{reply:"s2",total:0}]};
const str = JSON.stringify(ary);
const arystr = JSON.parse(str);
console.log(ary);
console.log(str);
console.log(arystr);


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
//insert({query:"質問",replys:[{reply:"1",total:0},{reply:"2",total:0}]});
