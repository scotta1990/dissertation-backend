const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  console.log("Register request made: ", req.body.email);
  // Check if the email exists and return error if true
  const emailExists = await User.findOne({ email: req.body.email }).exec();
  if (emailExists) return res.status(400).send("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Validate register data
  if (!req.body.email.includes("@"))
    return res.status(400).send("A valid email address is required.");

  if (!(req.body.email && req.body.password))
    return res.status(400).send("Email and password is required");

  //Create the new user object for saving to db
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    //Save user
    const savedUser = await user.save();

    //Create a token
    const token = jwt.sign(
      { userId: savedUser._id, userRole: savedUser.role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).send({ token: token });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log("Login request made: ", req.body.email);
    //Get login details
    const { password } = req.body;
    const email = req.body.email.toLowerCase();

    //Validate login data
    if (!(email && password))
      return res.status(400).send("Email and password is required");

    //Validate user exists and password
    const user = await User.findOne({ email: email }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      //Create token
      const token = jwt.sign(
        { userId: user._id, userRole: user.role },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      //Destructor user, add token and respond
      const { password, ...returnUser } = user._doc;
      returnUser.token = token;
      return res.status(200).send(returnUser);
    }

    //Assume incorrect details or not registered
    return res.status(400).send("Invalid credentials");
  } catch (err) {
    return res.status(400).send(err.toString());
  }
};
