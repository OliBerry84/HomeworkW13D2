const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/public'));


// mongodb stuff here
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; //requires objectid that lets us select db data entries by id



MongoClient.connect('mongodb://localhost:27017', function(err, client){ // passes error first if there was one, then passes connection/client
  if (err){
    console.error(err); // if error, console the error, otherwise return and carry on
    return;
  }
  const db = client.db('star_wars') // grabs a specific database, this case star wars app
  console.log('Connected to DB');

  const quotesCollection = db.collection('quotes'); // connects to database and where to store data. NoSQL collections



// CREATE ROUTE
  server.post('/api/quotes', function(req, res){
    const newQuote = req.body;

    quotesCollection.save(newQuote, function(err, result){ // the function is to tell it what to do when it's done saving
      if(err){
        console.error(err);
        res.status(500); // response object res, calls method status which sets status code of response (500 is server errors); then send back
        res.send();
        return;
      }

      console.log('Saved!');
      // console.log(result);

      res.status(201); // 201 means created
      res.json( result.ops[0] );
    });
  });

  // INDEX ROUTE
  server.get('/api/quotes', function(req, res){
    quotesCollection.find().toArray(function(err, allQuotes){ // turns returned cursor into an array of objects, if error then error otherwise allQuotes for all quotes in the array, could be called anything
      if(err){
        console.error(err);
        res.status(500);
        res.send();
        return;
      }
      res.json(allQuotes)
    });
  });

  // RETURN BY ID
  server.get('/api/quotes/:id', function(req, res){

    const id = req.params.id;
    const objectID = ObjectID(id);

    quotesCollection.findOne({_id: objectID}, function(err, aQuote){ // turns returned cursor into an array of objects, if error then error otherwise allQuotes for all quotes in the array, could be called anything
      if(err){
        console.error(err);
        res.status(500);
        res.send();
        return;
      }
      res.json(aQuote)
    });
  });


  // DELETE

  server.delete('/api/quotes', function(req, res){
    //quotesCollection.deleteMany({}, function(){  <------------------------------------------------------------------------------------------
    //quotesCollection.deleteMany(null, function(){                                                                                           ^
      quotesCollection.deleteMany(function(err, result){ // can delete one just by using same method but putting in {filter object} as above  |
          if(err){
            console.error(err);
            res.status(500);
            res.send();
            return;
          }
          res.send();
    });
  });

  // DELETE ONE BY ID
  server.delete('/api/quotes/:id', function(req, res){

    const id = req.params.id;
    const objectID = ObjectID(id);

    quotesCollection.deleteMany({_id: objectID}, function(err, result){
      if(err){
        console.error(err);
        res.status(500);
        res.send();
      }
      res.send();
    });
  });

  // UPDATE

  server.put('/api/quotes/:id', function (req, res){

    const updatedQuote = req.body; //sent new data to certain route

    const id = req.params.id;
    const objectID = ObjectID(id);

    quotesCollection.update({_id: objectID}, updatedQuote, function(err, result){ //filtered object(updating this quote), what we passing, callback to update
      if(err){
        console.error(err);
        res.status(500);
        res.send();
      }
      res.send(result);
    });
  });




  server.listen(3000, function(){ // this is usually outside of this function but here it's running all the time for simplicity
    console.log("Listening on port 3000");
  });


});
