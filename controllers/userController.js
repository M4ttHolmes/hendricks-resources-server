const Express = require("express");
const router = Express.Router();
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let validateJWT = require("../middleware/validate-jwt")

//! User Creation Endpoint
router.post("/create", async (req, res) => {
     
    let { username, password, firstName, lastName } = req.body.user;
    try {
        let User = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, 13),
            firstName,
            lastName
        });

        let token = jwt.sign({id: User.id, username: User.username}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });

    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use"
            });
        } else {
        res.status(500).json({
            message: "Failed to register user"
        })
        }
    }
});


//! User Login Endpoint
router.post("/login", async (req, res) => {
    let { username, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            }
        });

    if (loginUser) {

        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(200).json({
            user: loginUser,
            message: "User successfully logged in!",
            sessionToken: token
        });
    } else {
        res.status(401).json({
            message: "Incorrect email or password"
        })
    }

    } else {
        res.status(401).json({
            message: "Incorrect email or password"
        })
    }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
})

//! Get All Users
router.get("/", async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


//! Delete User by ID
router.delete("/delete/:id", validateJWT, async (req, res) => {
        const userId = req.params.id
        try {
            const query = {
                where: {
                    id: userId
            },
        };
            await UserModel.destroy(query)
            res.status(200).json({
                message: "User Deleted"
            })
        } catch(err) {
            res.status(500).json({
                message: "Failed to delete User"
            })
        }
})

module.exports = router;



module.exports = router;