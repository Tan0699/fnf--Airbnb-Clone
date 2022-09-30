const express = require('express');
const { setTokenCookie, requireAuth,restoreUser } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot } = require('../../db/models');
const { SpotImage,ReviewImage } = require('../../db/models');
const { Review } = require('../../db/models');
const {Sequelize} = require('../../db/models')
const {User} = require('../../db/models');
const spotimage = require('../../db/models/spotimage');
const spot = require('../../db/models/spot');
const {Booking} = require('../../db/models');
const { DATEONLY, DATE } = require('sequelize');
// Get all of the Current User's Bookings
router.get('/current',requireAuth, async (req, res) => {
    const myBookings = {}

    myBookings.Bookings = await Booking.findAll({
        raw:true,
        where:{userId:req.user.id}
    })
    console.log(myBookings.Bookings,"pepe")
    for (const spott of myBookings.Bookings) {
        const spotReviewd = await Spot.findAll({
            where: {id: spott.spotId,},
            attributes:['id','ownerId','address','city','state','country','lat','lng','name','price'],
            raw:true
          
        })
        console.log(spotReviewd)
        console.log(spott)
        const allowPreview = await SpotImage.findOne({
            where: {spotId: spott.id,preview:true },
            attributes:['url'],
            raw:true
        })
       spott.Spot = spotReviewd
       if(allowPreview){
        spotReviewd.previewImage = allowPreview.url
       }
       //...
       //THERE IS PROBALY A MISSING ATTRIBUTE OUTPUT IN ONE OF THE ROUTES WITH SPOTIMG/REVIMG
       // REMEMBER TO TRIPLE TEST ROUTES
    }
    return res.json(myBookings)
})
const validateBooking = [
    check('startDate')
      .notEmpty()
      .withMessage('StartDate is required'),
    check('endDate')
      .notEmpty()
      .withMessage('EndDate is required'),
    handleValidationErrors
  ];
//Edit a booking
router.put('/:bookingId',requireAuth,validateBooking, async (req, res) => {
    const {bookingId} = req.params
    const {startDate,endDate} = req.body
    if (endDate <= startDate) {
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
          })
        }
        const findBooking = await Booking.findOne({where:{
          id:bookingId
        }})
        if(!findBooking){
          res.status(404)
          return res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
          })
        }

            const old = findBooking.endDate
            console.log(new Date(old).getTime())
            console.log(new Date().getTime())
            if(new Date(old).getTime()<new Date().getTime()){
                return res.json({
                    "message": "Past bookings can't be modified",
                    "statusCode": 403
                })
            }
          if((startDate>=findBooking.startDate &&startDate<=findBooking.endDate)||
          (endDate>=findBooking.startDate &&endDate<=findBooking.endDate)){
            return res.json({
              "message": "Sorry, this spot is already booked for the specified dates",
              "statusCode": 403,
              "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
              }
            })
          }
        
        
        const newBooking = await Booking.create({
          spotId:findBooking.spotId,
          userId:req.user.id,
          startDate,
          endDate,
      })
      return res.json(newBooking)
    })


//Delete a Booking
router.delete('/:bookingId',requireAuth, async (req, res) => {
    const {bookingId} = req.params
    const bookingfound = await Booking.findByPk(bookingId,{where:{userId:req.user.id}})
    if(!bookingfound){
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
          })
    }
    await bookingfound.destroy()
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
})

module.exports = router;

  
