const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { ResourceModel } = require("../models")

//! Create new Resource
router.post('/create', validateJWT, async (req, res) => {
    const {name, checkedOut, owner, location} = req.body.resource;
    const resourceEntry = {
        name,
        checkedOut,
        owner,
        location
    }
    try {
        const newResource = await ResourceModel.create(resourceEntry);
        res.status(200).json({
            message: "New Resource Created!",
            newResource: newResource,
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
});






module.exports = router;