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

//! Get All Resources
router.get("/", async (req, res) => {
    try {
        const resources = await ResourceModel.findAll();
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//! Delete Resource by ID
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const resourceId = req.params.id;

    try {
        const query = {
            where: {
                id: resourceId,
            }
        };
        await ResourceModel.destroy(query);
        res.status(200).json({ message: "Resource Deleted."});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});




module.exports = router;