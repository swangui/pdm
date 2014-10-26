var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('survey.db');

var tb = 'id,shopname,contactperson,tel,email,province,city,district,scope,shop,boughtfromus,majorsource,monthlyquota,currentbrands,created';

db.serialize(function() {
  var tbs = tb.split(',').map(function(t){return t + ' text'}).join(',');
  var sql = 'create table survey ('+tbs+');';
  console.log(sql);
  db.run(sql);

/*
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
*/
});

db.close();

