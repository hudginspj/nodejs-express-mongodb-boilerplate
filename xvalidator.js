var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/video';


console.log('hello');


var contactValidator = {
    $or:
    [
        { phone: { $type: "string"} },
        { email: { $regex: /@mongodb\.com$/} },
        { status: { $in: [ "Unknown", "Incomplete"]} }
    ]
}

// var noteValidator = {
//     {$or: [
//         {tnm_source: { $in: ["Not Stated"]} },
//         {tnm_source: { $in: ["Other"]}}
//     ]}
// }

var val1 = {
    $and: [
        {date: { $type: "string"} },
        {$or: [
            {phone: { $type: "string"}},
            {email: { $type: "string"}}
        ]}]
}

var noteValidator = {
    $and: [
        {patient_id: { $type: "string"} },
        {icd: { $in: ["162", "C34"]} },
        {date: { $type: "date"} },
        {$or: [
            {   staging_system_source: { $in: ["Not Stated"]} },
            {
                staging_system_source: { $in: ["Consult", "Addendum", "Other"]},
                staging_system_date: { $type: "date"},
                staging_system: { $in: ["AJCC","IASLC","UICC" ]}
            }
        ]},
        {$or: [
            {   stage_source: { $in: ["Not Stated"]} },
            {
                stage_source: { $in: ["Consult", "Addendum", "Other"]},
                stage_date: { $type: "date"},
                stage: { $in: ["I","Ia","IIb" ]}
            }
        ]}
    ]
}



MongoClient.connect(mongoUri, function(err, db) {


    assert.equal(null, err);
    console.log('Successfully connected to mondodb');

    // db.collection('patients').find({}).toArray(function (err, docs) {
    //         console.log(docs);
    //     });


    db.createCollection("notes",
        { validator: noteValidator });

    db.collection('notes').insertOne({
            patient_id: '123456789',
            icd: "162",
            date: new Date(2017,9,22),
            staging_system_source: 'Consult',
            staging_system_date: new Date(2017,9,10),
            staging_system: "AJCC",
            stage_source: 'Not Stated'
        }, function(err, doc) {
            assert.equal(null, err);
            console.log('inserted');
        }
    );
    // db.collection('patients').insertOne({
    //         firstName: "A",
    //         lastName: "B"
    //     }, function(err, doc) {
    //         assert.equal(null, err);
    //     }
    // );

    // db.collection('contacts').insertOne({
    //         phone: '123456789'
    //     }, function(err, doc) {
    //         assert.equal(null, err);
    //         console.log('inserted');
    //     }
    // );
    console.log('done');

});










