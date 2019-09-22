const db = require('../../data/dbConfig.js')

module.exports = {
    findById,
    ordersByCustomerId,
    findLocalFarms,
    findByUsername,
    addUser
}

function findById(id) {
    return db('consumer_user')
        .where({
            id: id
        })
        .first();
}

function findByUsername(username) {
    return db('consumer_user')
        .where({
            username: username
        })
        .first();
}

function ordersByCustomerId(id) {
    return db('order as o')
    .where({
        consumer_id: id
    })
    .join('order_item as oi', 'oi.order_id', 'o.id')
    .join('farm as f', 'f.id', 'oi.farm_id')
    .join('produce_item as pi', 'pi.id', 'oi.produce_item_id')
    .select('o.shipping_address', 'o.purchase_date', 'o.delivered', 'pi.name as item_purchased', 'oi.quantity', 'f.name as seller')
    .orderBy('o.purchase_date', 'desc')
}

function findLocalFarms(cityId, stateId){
    return db('farm')
    .where({city_id: cityId, state_id: stateId})
    .select('farm.name', 'farm.address', 'farm.year_founded', 'farm.bio', 'farm.id')
}

function addOrder(orderDetails){

}

function addUser(data){
    return db('consumer_user')
    .insert(data)
    .then(([id]) => findById(id))
}