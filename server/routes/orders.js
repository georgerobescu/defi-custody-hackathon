const { getOrdersContract } = require('../utils/contracts')
const customWeb3 = require('../ethereum/web3')
const express = require('express')
const router = express.Router()

router.get('/getOrderById/:id', async (req, res, next) => {
  const orders = await getOrdersContract()
  const { id } = req.params
  if (!id) {
    return next
  }
  const orderData = await orders.methods.getOrderById(id).call()
  if (orderData[0].includes('not found!')) {
    return res.json({ error: orderData })
  }
  const events = await orders.getPastEvents('NewOrder', {
    filter: {
      index: orderData[1],
    },
    fromBlock: 0,
    toBlock: 'latest',
  }).catch(e => {
    console.log('Request for order data with id: ', id, e)
    return res.json({ error: 'Something went wrong.' })
  })
  if (events.length !== 1) {
    console.log(
      'Request for order data with id: ',
      id,
      '. Got unexpected events length: ',
      events.length,
    )
    return res.json({ error: 'Something went wrong.' })
  }
  const { blockNumber, transactionHash, blockHash, returnValues } = events[0]
  res.json({
    blockHash,
    blockNumber,
    transactionHash,
    index: orderData[1],
    id,
    orderData: JSON.parse(orderData[0]),
    timestamp: (await customWeb3.getWeb3().eth.getBlock(blockNumber)).timestamp,
  })

})

module.exports = router
