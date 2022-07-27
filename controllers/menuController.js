const mongoose = require("mongoose")

const cart_get = function(req, res){
  res.render('cart', {user: req.user})
}

module.exports = {
  cart_get //, updateAuthor, addAuthor
}