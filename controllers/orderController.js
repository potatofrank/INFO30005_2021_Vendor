const mongoose = require("mongoose")
let order_length = 0

// import order model
const Order = mongoose.model("Order")

// get all orders
const order_get = function(req, res){
  Order.find()
    .lean()
    .then(function (doc) {
        res.render("customer_order", {orders: doc, user: req.user})
    })
}

// get all orders
const order_history_get = function(req, res){
  Order.find()
    .lean()
    .then(function (doc) {
        for(var i = 0; i<doc.length; i++){
          
          time = doc[i].OrderedTime.split(" ")[4].split(":")
          doc[i].DetailTime = time[0] + ":" + time[1]
        }
        res.render("order_history", {orders: doc, user: req.user})
    })
}

// get all orders
const review_get = function(req, res){
  Order.find()
    .lean()
    .then(function (doc) {
        res.render("review", {orders: doc, user: req.user})
    })
}

// get all orders
const vendor_order_get = function(req, res){
  Order.find()
    .lean()
    .then(function (doc) {
        var name_arr = []
        var str = ''
        var time = ""
        var curr_time = new Date()
        var remain_time = 0
        for(var i = 0; i<doc.length; i++){
          name_arr = doc[i].CustomerInfo.split(" ")
          str = name_arr[0][0].toUpperCase() + '.' + name_arr[1][0].toUpperCase()
        
          doc[i].fullname=name_arr[0] + " " +name_arr[1];
          doc[i].CustomerInfo = str
          time = doc[i].OrderedTime.split(" ")[4].split(":")
          doc[i].DetailTime = time[0] + ":" + time[1]
          remain_time = Date.parse(doc[i].ExpireTime) - Date.parse(curr_time)
          if(remain_time<0){
            doc[i].discount_apply_remaining = "discount applied"
          }else{
            var minutes = Math.floor(remain_time / 60000);
            var seconds = ((remain_time % 60000) / 1000).toFixed(0);
            doc[i].discount_apply_remaining = minutes + ":" + seconds
          }
        }
        res.render("order", {orders: doc, user: req.user})
    })
}


// button function: for vendor complete orders
const complete_order = async function (req, res){
  //get the order id from the req body
  const {OrderID} = req.body
  let errors = []

  Order.findOne({OrderID: OrderID}).then((order) => {
    if (!order){
      req.flash('orderError', 'The customer changed this order, old order is deleted')
      errors.push({ msg: 'The customer changed this order, old order is deleted' });
      Order.find()
        .lean()
        .then(function (doc) {
          var name_arr = []
          var str = ''
          var time = ""
          var curr_time = new Date()
          var remain_time = 0
          for(var i = 0; i<doc.length; i++){
            name_arr = doc[i].CustomerInfo.split(" ")
            str = name_arr[0][0].toUpperCase() + '.' + name_arr[1][0].toUpperCase()
            doc[i].fullname=name_arr[0] + " " +name_arr[1];
            doc[i].CustomerInfo = str
            time = doc[i].OrderedTime.split(" ")[4].split(":")
            doc[i].DetailTime = time[0] + ":" + time[1]
            remain_time = Date.parse(doc[i].ExpireTime) - Date.parse(curr_time)
            if(remain_time<0){
              doc[i].discount_apply_remaining = "discount applied"
            }else{
              var minutes = Math.floor(remain_time / 60000);
              var seconds = ((remain_time % 60000) / 1000).toFixed(0);
              doc[i].discount_apply_remaining = minutes + ":" + seconds
            }
          }
          res.render("order", {orders: doc, user: req.user, errorMessage: req.flash("orderError")})
        })
    } else {
      if(order.OrderStatus == "Cancelled"){
        req.flash('orderError', 'The customer cancelled the order')
        errors.push({ msg: 'The customer cancelled the order' });
        Order.find()
        .lean()
        .then(function (doc) {
          var name_arr = []
          var str = ''
          var time = ""
          var curr_time = new Date()
          var remain_time = 0
          for(var i = 0; i<doc.length; i++){
            name_arr = doc[i].CustomerInfo.split(" ")
            str = name_arr[0][0].toUpperCase() + '.' + name_arr[1][0].toUpperCase()
            doc[i].fullname=name_arr[0] + " " +name_arr[1];
            doc[i].CustomerInfo = str
            time = doc[i].OrderedTime.split(" ")[4].split(":")
            doc[i].DetailTime = time[0] + ":" + time[1]
            remain_time = Date.parse(doc[i].ExpireTime) - Date.parse(curr_time)
            if(remain_time<0){
              doc[i].discount_apply_remaining = "discount applied"
            }else{
              var minutes = Math.floor(remain_time / 60000);
              var seconds = ((remain_time % 60000) / 1000).toFixed(0);
              doc[i].discount_apply_remaining = minutes + ":" + seconds
            }
          }
          res.render("order", {orders: doc, user: req.user, errorMessage: req.flash("orderError")})
        })
      }else if(order.OrderStatus == "Outstanding"){
        // Check wheter an order is out of time and apply discount if so
        var curr_time = new Date().toString()
        if((Date.parse(curr_time) - Date.parse(order.ExpireTime)) > 0){
          var discountPrice
          discountPrice = order.totalPrice * 0.8
          discountPrice = discountPrice.toFixed(1)
          Order.findByIdAndUpdate(
            order.id,
            {totalPrice: discountPrice, DiscountOrder: true, OrderStatus: "Fulfilled"},
            {new:true},
            function(err){
              if(err){
                res.status(404).json({success:false,err})
              }else{
                res.redirect('/vendor/order')
              }
            })
        }else{
          Order.findByIdAndUpdate(
            order.id,
            {OrderStatus: "Fulfilled"},
            {new:true},
            function(err){
              if(err){
                res.status(404).json({success:false,err})
              }else{
                res.redirect('/vendor/order')
              }
            })
        }
      }
    }
  })
}

// button function: for vendor remove picked up orders
const pickup_order = async function (req, res){
  //get the order id from the req body
  const {OrderID} = req.body
  let errors = []

  //push error when no id is specified 
  if(!OrderID) {
    req.flash('orderError', 'This order does not exsist')
    errors.push({msg: 'this order dose not exsist'})
  }
  
  //render error if there's anu
  if(errors.length > 0) {
    res.render("order", {
      errorMessage: req.flash("orderError"),
      errors,
      OrderID,
    })
  } else {
    //when there's no such order return error
    Order.findOne({OrderID: OrderID}).then((order) => {
      if (!order){
        req.flash('orderError', 'this order dose not exsist')
        res.render("order", {
          errorMessage: req.flash('orderError'),
          OrderID,
          errors,
          OrderID,
        })
      } else {
        //update error
        Order.findByIdAndUpdate(
          order.id,
          {OrderStatus: "Delivered"},
          {new:true},
          function(err, updatedOrder){
            if(err){
               res.status(404).json({success:false,err})
            }else{
              Order.find()
                .lean()
                .then(function (doc) {
                  res.redirect('/vendor/order')
                  //res.status(200).json({success:true, updatedOrder: updatedOrder})
                  //req.flash('orderSuccess', 'One order has been fulfilled')
                  //res.render("order", {order_length: order_length, order:doc, successMessage:req.flash("orderSuccess")})
                })
            }
          })
      }
    })
  }
}

module.exports = {
  order_get, complete_order, vendor_order_get, pickup_order, order_history_get, review_get
}