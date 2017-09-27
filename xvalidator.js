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

var ropa1FieldValidator = {
    $and: [
        {patient_id: { $type: "string"} },

        {date: { $type: "date"} },
        {$or: [
            {icd: { $in: ["162.*", "C34.*"]} },
            //{   : { $in: [""]} },
            {   surgery: { $in: ["Yes", "No"]} },
            {   tnm_source: { $in: ["Not Stated"]} },
            {
                tnm_source: { $in: ["Consult", "Addendum", "Other"]},
                tnm_date: { $type: "date"},
                tx: { $in: ["Tis","T1","T1a","T1b","T2","T2a","T2b","T2c","T3","T4", "Not Stated"]},
                nx : { $in: ["N0", "N1", "N2", "N3", "Not Stated"]},
                mx : { $in: ["M0", "M1a", "M1b", "Not Stated"]}
            },
            {
                staging_system_source: { $in: ["Consult", "Addendum", "Other"]},
                staging_system_date: { $type: "date"},
                staging_system: { $in: ["AJCC","IASLC","UICC" ]}
            },
            {   stage_source: { $in: ["Not Stated"]} },
            {
                stage_source: { $in: ["Consult", "Addendum", "Other"]},
                stage_date: { $type: "date"},
                stage: { $in: ["O","I","Ia","Ib","II","IIa","IIb","III","IIIa","IIIb","IV"]}
            },
            {   follow_up: { $in: ["yes", "no"]} }
        ]}
    ]
}

var ropa2FieldValidator = {
    $and: [
        {patient_id: { $type: "string"} },

        {date: { $type: "date"} },
        {$or: [
            {icd: { $in: ["162.*", "C34.*"]} },
            //{   : { $in: [""]} },
            {   surgery: { $in: ["Yes", "No"]} },
            {   tnm_source: { $in: ["Not Stated"]} },
            {
                tnm_source: { $in: ["Consult", "Addendum", "Other"]},
                tnm_date: { $type: "date"},
                tx: { $in: ["Tis","T1","T1a","T1b","T2","T2a","T2b","T2c","T3","T4", "Not Stated"]},
                nx : { $in: ["N0", "N1", "N2", "N3", "Not Stated"]},
                mx : { $in: ["M0", "M1a", "M1b", "Not Stated"]}
            },
            {
                staging_system_source: { $in: ["Consult", "Addendum", "Other"]},
                staging_system_date: { $type: "date"},
                staging_system: { $in: ["AJCC","IASLC","UICC" ]}
            },
            {   stage_source: { $in: ["Not Stated"]} },
            {
                stage_source: { $in: ["Consult", "Addendum", "Other"]},
                stage_date: { $type: "date"},
                stage: { $in: ["O","I","Ia","Ib","II","IIa","IIb","III","IIIa","IIIb","IV"]}
            },
            {   nsclc_classification_source: { $in: ["Not Stated"]} },
            {
                nsclc_classification_source: { $in: ["Consult", "Addendum", "Other"]},
                nsclc_classification_date: { $type: "date"},
                nsclc_classification: { $in: ["Adenocarcinoma", "Squamous Cell Carcinoma", "Adenosquamous",
                    "Large Cell", "NOS", "Exclusion: Comorbidities/Frailty"]}
            },
            {   performance_status_source: { $in: ["Not Stated"]} },
            {
                performance_status_source: { $in: ["Consult", "Addendum", "Other"]},
                performance_status_date: { $type: "date"},
                kps :{ $in: ["100", "90", "80", "70", "60", "50", "40", "30", "20", "10", "0", "Not Stated"]},
                who :{ $in: ["0", "1", "2", "3", "4", "5", "Not Stated"]},
                zubrod :{ $in: ["0", "1", "2", "3", "4", "5", "Not Stated"]},
                ecdg :{ $in: ["0", "1", "2", "3", "4", "5", "Not Stated"]}
            },
            {   smoking_source: { $in: ["Not Stated"]} },
            {
                smoking_source: { $in: ["Consult", "Addendum", "Other"]},
                smoking_date: { $type: "date"},
                smoker: { $in: ["Smoker", "Non-Smoker"]},
                cessation: { $in: ["Referred to cessation program", "Counseled on quitting", "Not stated", "N/A"]}
            },
            {   clinical_trials_source: { $in: ["Not Stated"]} },
            {
                clinical_trials_source: { $in: ["Consult", "Addendum", "Other"]},
                clinical_trials_date: { $type: "date"},
                clinical_trial_enrollment: { $in: ["Enrolled", "Not enrolled", "Unknown"]},
                clinical_trial_number: { $type: "int"}             //TODO: Validate list of integers instead of single
            },
            {   cardiac_implant_source: { $in: ["Not Stated"]} },
            {
                cardiac_implant_source: { $in: ["Consult", "Addendum", "Other"]},
                cardiac_implant_date: { $type: "date"}
                //TODO: Ambigous requirement
            },
            {   multidiscipliniary_consult: { $in: ["Not Found"]} },
            {
                multidiscipliniary_consult: { $in: ["Pulmonology", "MedOnc/HemOnc", "Surgical Oncology", "Multidisciplinary Tumor Board"]},
                multidiscipliniary_consult_date: { $type: "date"}
            },
            {   pathology: { $in: ["Not Stated"]} },
            {
                stage_source: { $in: ["Consult", "Addendum", "Other"]},
                stage_date: { $type: "date"},
                stage: { $in: ["O","I","Ia","Ib","II","IIa","IIb","III","IIIa","IIIb","IV"]}
            },
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










