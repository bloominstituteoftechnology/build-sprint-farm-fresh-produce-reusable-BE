const express = require('express')
const Consumers = require('../../models/users/consumer_user_model.js')
const Farms = require('../../models/farm_model.js')
const Orders = require('../../models/order_model.js')
const Categories = require('../../models/categories_model.js')
const router = express.Router();
const uuidv1 = require('uuid/v1');

/**
 * @api {get} /api/consumers/:id Get Consumer By Id
 * @apiName GetConsumerById
 * @apiGroup Consumers
 * 
 * @apiParam {Number} id User Id
 * 
 * @apiSuccess {Number} id User_Id
 * @apiSuccess {String} username User Username
 * @apiSuccess {String} email User Email
 * @apiSuccess {String} password User Password
 * @apiSuccess {Number} city_id User City_Id
 * @apiSuccess {Number} state_id User State_Id
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *  "id": 1,
 *  "username": "consumer_1",
 *  "email": "consumer_1@gmail.com",
 *  "password": "password",
 *  "city_id": 1,
 *  "state_id": 1
 * }
 */

 //! go to 12 minutes to see how to handle array documentation
 //! 16 MIN for post req

router.get('/:id', (req, res) => {
    const {
        id
    } = req.params
    Consumers.findById(id)
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({
            message: "We couldn't get the users at this time."
        }))
})

router.get('/:id/orders', (req, res) => {
    const {
        id
    } = req.params
    Orders.findByCustomerId(id)
        .then(orders => {
            orders.forEach(order => {
                if (order.delivered) {
                    order.delivered = true
                } else {
                    order.delivered = false
                }
            })
            res.status(200).json(orders)
        })
        .catch(err => res.status(500).json({
            message: "We couldn't get your orders at this time."
        }))
})

/**
 * @api {get} /api/consumers/farms/:cityId/:stateId Get Local Farms
 * @apiName GetLocalFarms
 * @apiGroup Consumers
 * 
 * @apiParam {Number} cityId City_Id
 * @apiParam {Number} stateId State_Id 
 * 
 * @apiSuccess {Objects[]} farms array of farm objects near consumer location
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *    "name": "A.R. Farms",
 *    "address": "2213 Orchard Rd.",
 *    "year_founded": 1908,
 *    "bio": "We are a farm.",
 *    "id": 2
 *  },
 *  {
 *    "name": "Blueberry Farms",
 *    "address": "21576 Albers Rd.",
 *    "year_founded": 1963,
 *    "bio": "Locally Grown Produce.",
 *    "id": 4
 *  }
 * ]
 */

router.get('/farms/:cityId/:stateId', (req, res) => {
    const {
        cityId,
        stateId
    } = req.params

    Farms.findLocal(cityId, stateId)
        .then(orders => res.status(200).json(orders))
        .catch(err => res.status(500).json({
            message: "We couldn't get the users at this time."
        }))
})

router.post('/order/:id', (req, res) => {
    const consumerId = req.params.id
    const orderId = uuidv1();
    let order = req.body
    let orderItems = order.order_items
    for (let i = 0; i < orderItems.length; i++) {
        orderItems[i].order_id = orderId
        orderItems[i].consumer_id = Number(consumerId)
    }
    order.id = orderId
    orderDetails = {
        "id": order.id,
        "shipping_address": order.shipping_address,
        "purchase_date": order.purchase_date,
        "delivered": order.delivered,
        "consumer_id": Number(consumerId),
    }
    // console.log(orderDetails, orderItems)
    Orders.add(orderDetails, orderItems)
        .then(order => res.status(201).json({
            order: order
        }))
        .catch(err => res.status(500).json({
            error: err
        }))
})

router.get('/shop/category/:id', (req, res) => {
    const { id } = req.params
    Categories.findById(id)
        .then(categories => {
            res.status(200).json(categories)
        })
        .catch( err => res.status(200).json(err))
})

router.get('/shop/categories', (req, res) => {
    Categories.find()
    .then( categories => res.status(200).json(categories))
    .catch( err => res.status(200).json(err))
})

module.exports = router;