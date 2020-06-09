

const express = require('express');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/Patient_records', {useNewUrlParser:true, useUnifiedTopology:true})
.then((result)=>{
    console.log('The database is connected');
})
.catch((error)=>{
    console.log('There was an error connecting -' +error.message)
});

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const Admin = mongoose.model('Admin', AdminSchema);

const materialSchema = new mongoose.Schema({
    materialCode: {type: String},
    materialName: {type: String},
    materialUnitPrice: {type: Number},
    materialStockLevel: {type: Number}
})

const Material = mongoose.model('Material', materialSchema);


const UserSchema = new mongoose.Schema({
    patientID: {type:Number},
    First_name:{type: String, require:true},
    Surname:{type: String, require:true},
    Date_of_birth:{type: Date},
    Sex: {type: String},
    diagnosis: {type: String},
    room_no:{type: String},
    floor: {type:Number},
    room_no:{type: String}
});

const User = mongoose.model('User', UserSchema);

const index = express();

index.set('view engine','ejs');
index.use(express.static(__dirname + '/public'));
index.use(express.json());
index.use(express.urlencoded({extended: true}));

index.get('/',(req,res)=>{
    res.render('home')
})
index.get('/home',(req,res)=>{
    res.render('home')
})
index.get('/patient', (req,res)=>{
    res.render('patient')
})

index.get('/register', (req, res)=>{
    res.render('register')
})

index.get('/login', (req,res)=>{
    res.render('login')
})

index.post('/register',(req, res)=>{
    const registrationData = {
        patientID: req.body.patientID,
        First_name: req.body.First_name,
        Surname: req.body.Surname,
        Date_of_birth: req.body.Date_of_birth,
        Sex: req.body.Sex,
        diagnosis: req.body.diagnosis,
        floor: req.body.floor,
        room_no: req.body.room_no,
    }
    User.findOne({patientID: registrationData.patientID}).then((user)=>{
        if(user){
            console.log('Sorry there is a student with that ID please check if your ID is correct');
            return res.redirect('/register')
        } else {
            User.create(registrationData).then((newUser)=>{
                res.redirect('/patient')
            })
        }
    })
});

index.get('/patient', (req, res)=>{
    User.find({}).then((users)=>{
        res.render('patient', {
            users: users.reverse()
        })
    }).catch((error)=>{
        res.json({
            msg: 'Sorry ${error.message}'
        })
    });
});



const port = 3000;
index.listen(port,()=> {
    console.log('Server has started on port ${port}');
});