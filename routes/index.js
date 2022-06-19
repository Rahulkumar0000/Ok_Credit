var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'khaata'
});
connection.connect(function(err){
  if(!err){
    console.log("Database is connected");
  }else{
    console.log("not Connected")
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/signprocess', function(req, res, next) {
  res.redirect('/login');
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/loginprocess', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/form', function(req, res, next) {
  res.render('form');
});



router.get('/logout', function(req, res, next) {
  res.render('login')
  // req.session.destroy(function(err){
  //   res.redirect("/login");
  // });
 });      

router.post('/formprocess',function(req,res,next){
  console.log(req.body);
  var mdata = {
    customer_name: req.body.customer_name,
    customer_email: req.body.customer_email,
    customer_mobile: req.body.customer_mobile,
    customer_address: req.body.customer_address,
    customer_amount: req.body.customer_amount,
    customer_payment: req.body.customer_payment
  }
  connection.query("insert into tbl_customer set ?",mdata,function(err,result){
    if(err) throw err;
    res.redirect('/form');  
  });
});
   
router.get('/display',function(req,res,next){
  
  connection.query("select * from tbl_customer",function(err,db_rows){
    if (err) throw err;
    console.log(db_rows);
    res.render('display-table',{db_rows_array:db_rows});
  })
}); 
 
router.get('/delete/:id', function(req, res, next) {
  var deleteid = req.params.id;
  console.log("delete id is"+deleteid)
  connection.query("delete from tbl_customer where customer_id = ?",[deleteid],function(err,db_rows){
    if(err) throw err;
    console.log(db_rows);
    console.log("record is deleted");
    res.redirect('/display');
  });
});

  router.get('/edit/:id', function(req, res) {
    console.log("edit id is : "+ req.params.id);
    var customer_id = req.params.id;
  connection.query("select * from tbl_customer where customer_id = ? ",[customer_id],function(err,db_rows){
    if(err) throw err;
    console.log(db_rows);
    res.render("edit-form",{db_rows_array:db_rows});
  });

  });

  router.post('/edit/:id', function(req, res) {
    console.log("edit id is"+ req.params.id);
    var customer_id = req.params.id;
    var customername = req.body.customer_name;
    var customermobile = req.body.customer_mobile;
    var customeramount = req.body.customer_amount;
    var customerpayment = req.body.customer_payment;
    connection.query("update tbl_customer set customer_name = ?, customer_mobile = ?, customer_amount = ?, customer_payment = ? where customer_id = ?",
    [customername,customermobile,customeramount,customerpayment,customer_id],function(err,respond){
      if(err) throw err;
      res.redirect('/display');
    });
  });

module.exports = router;
