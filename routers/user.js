const router = require("express").Router();
const userController = require("../controllers/user");

/**
 * @swagger
 * /user/register:
 *  post:
 *      summary: Register a new user
 *      security: []
 *      tags: [User]
 *      required:
 *          -email
 *      parameters:
 *          - in: body
 *            name: Register
 *            description: The user details for registration
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          '201':
 *              description: A successful response
 *          '400':
 *              description: A bad request
 */
router.post("/register", userController.registerUser);

/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: Login as a user
 *      security: []
 *      tags: [User]
 *      parameters:
 *          - in: body
 *            name: login
 *            description: The login details
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          '200':
 *              description: A successful response
 *          '400':
 *              description: A bad request
 */
router.post("/login", userController.loginUser);

module.exports = router;
