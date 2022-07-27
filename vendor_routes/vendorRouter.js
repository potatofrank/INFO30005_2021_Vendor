const express = require('express')

// add our router 
const vendorRouter = express.Router()

// require the vendor controller
const orderController = require('../controllers/orderController.js')
const loginController = require('../controllers/loginController.js')
const vendorController = require('../controllers/vendorController.js')
var { ensureAuthenticated } = require('../config/auth')

// handle the GET request to get all vendors
//.getAllVendor(req, res))

// handle the GET request to get all orders
vendorRouter.get('/order', ensureAuthenticated, orderController.vendor_order_get)

// handle the GET request to get all orders
vendorRouter.get('/order_history', ensureAuthenticated, orderController.order_history_get)

vendorRouter.get('/login', loginController.login_get)

vendorRouter.post('/login', loginController.login_post)

vendorRouter.post('/closeVan', ensureAuthenticated, vendorController.closeVendor)

vendorRouter.get('/logout', loginController.logout_get)

//handle the GET request to render the order history of a customer
vendorRouter.get('/review', ensureAuthenticated, orderController.review_get)

// handle the POST request to set order details
vendorRouter.post('/order', ensureAuthenticated, orderController.complete_order)

// handle the POST request to set order details
vendorRouter.post('/order/pickup', ensureAuthenticated, orderController.pickup_order)

// export the router
module.exports = vendorRouter