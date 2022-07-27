const mongoose = require("mongoose")

// import snack model
const Vendor = mongoose.model("Vendor")

// get all vendors
const getAllVendor = async (req, res) => {
  try {
    const vendors = await Vendor.find()
    return res.send(vendors)
  } catch (err) {
    res.status(400)
    return res.send("Database query failed")
  }
}

//open a vender
const openVendor = async function (req, res){
    //get the vendor id and its location from req body
    const {van_name, location, Latitude, Longitude} = req.body
    let errors = []
    //validate fields
    if(!location) {
        req.flash('vendorError', 'Please enter your location')
        errors.push({msg: 'Please enter your location'});
    }
    //check errors
    if(errors.length > 0){
        res.render("vendor", {
            errorMessage: req.flash("vendorError"),
            errors,
            location,
            user: req.user
        })
    } else{
      Vendor.findOne({van_name: van_name}).then((vendor) => {
        //change vendor status and location information
        Vendor.findByIdAndUpdate(
          vendor.id,
          {isOpen: true, location: location, Latitude: Latitude, Longitude: Longitude},
          {new:true},
          function(err, updatedVendor){
            if(err){
              res.status(404).json({success:false,err})
            }else{
              res.redirect("/vendor")
            }
          }
        )
      })
    }
}

const closeVendor = function(req, res){
  const {van_name, closed} = req.body
  Vendor.findOne({van_name: van_name}).then((vendor) => {
      //change vendor status and location information
      Vendor.findByIdAndUpdate(
        vendor.id,
        {isOpen: false},
        {new:true},
        function(err, updatedVendor){
          if(err){
            res.status(404).json({success:false,err})
          }else{
            if(closed=='true'){
              res.redirect("/vendor/login")
            }else{
              res.redirect("/vendor")
            }
          }
        }
      )
  })
}

// remember to export the functions
module.exports = {
  getAllVendor, openVendor, closeVendor //, updateAuthor, addAuthor
}