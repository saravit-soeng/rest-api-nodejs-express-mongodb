const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')


const getSubscriber = async (req, res, next) => {
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if(subscriber == null){
            return res.status(404).json({message:"can not find subscriber."})
        }
    } catch (error) {
        return res.json(500).json({message:error.message})
    }

    res.subscriber = subscriber
    next()
}

/**
 * @swagger
 * /api/subscribers:
 *    get:
 *      tags:
 *      - Subscriber
 *      description: This should return all subscribers
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *         description: Subscribers
 * 
 */
router.get("/", async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json({message:"Data found!",status:200,data:subscribers})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/**
 * @swagger
 * /api/subscribers/{id}:
 *    get:
 *      tags:
 *      - Subscriber
 *      description: This should return specific subscriber by id
 *      produces:
 *      - application/json
 *      parameters:
 *       - name: id
 *         in:  path
 *         required: true
 *         type: string
 *      responses:
 *       200:
 *         description: Subscriber
 * 
 */
router.get('/:id', getSubscriber, (req, res) => {
     res.json(res.subscriber)
})

/**
 * @swagger
 * /api/subscribers:
 *    post:
 *      tags:
 *      - Subscriber
 *      description: Create subscriber
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: subscriber
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required: [name, subscribedChannel]
 *           properties:
 *            name:
 *              type: string
 *            subscribedChannel:
 *              type: string
 *      responses:
 *       200:
 *         description: Subscriber
 * 
 */
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedChannel: req.body.subscribedChannel
    })
    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

/**
 * @swagger
 * /api/subscribers/{id}:
 *    put:
 *      tags:
 *      - Subscriber
 *      description: Update subscriber
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: id
 *         in:  path
 *         required: true
 *         type: string
 *       - name: subscriber
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *            name:
 *              type: string
 *            subscribedChannel:
 *              type: string
 *      responses:
 *       200:
 *         description: Subscriber
 * 
 */
router.put('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if(req.body.subscribedChannel != null){
        res.subscriber.subscribedChannel = req.body.subscribedChannel
    }
    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

/**
 * @swagger
 * /api/subscribers/{id}:
 *    delete:
 *      tags:
 *      - Subscriber
 *      description: This should delete specific subscriber by id
 *      produces:
 *      - application/json
 *      parameters:
 *       - name: id
 *         in:  path
 *         required: true
 *         type: string
 *      responses:
 *       200:
 *         description: Subscriber
 * 
 */
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.remove()
        res.json({message:"Delete this subscriber"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

module.exports = router