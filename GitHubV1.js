'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hdb = require('hdb');
var cron = require('node-cron');
var datetime = require('node-datetime');
var request = require('request');
var qs = require('querystring')

// databases //

var dbpar = "database";

//define hana string connection
  var client = hdb.createClient({
      host     : '192.168.0.1',
      port     : 30015,
      user     : 'SYSTEM',
      password : 'Admin123'
    });

//check if are some errors withe the network
client.on('error', function (err) {
  console.error('Network connection error', err);
});

const app = express()
const port = process.env.PORT || 1235
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                               END POINT                                                     /////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//GET FUNCTION LIST
app.get('/api/OPCH', (req, res) => {
  var dt = datetime.create();
  var formatted = dt.format('m/d/Y H:M:S');

console.log('CISA /api/OPCH/ ' + formatted);


  //CHECK IF CONECCTION IS OPEN
  client.connect(function (err) {
    if (err) {
      //return console.error('Connect error', err);
    }
  });

  client.exec('select TOP 40 "DocDate","DocEntry","DocNum","U_DocNumNSA","CardCode","CardName","DocCur","DocTotal","DocTotalFC","NumAtCard","JrnlMemo","CreateDate","LicTradNum","U_AutPago","U_AutorizantePago" from "' + dbpar + '"."OPCH" where "U_AutorizantePago" is not null and "U_DocNumNSA" is null and "U_AutPago" = \'NO\' order by "OPCH"."DocNum" desc', function (err, rows) {
  client.end();
    if (err) {
      return console.error('Execute error:', err);
    }

    res.status(200).send(rows)

  });
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                               SERVER UP                                                     /////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Api Rest esta corriendo en puerto ${port}`);
})
