// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   const token = req.header("x-auth-token");

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = auth;

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    // Extract token from the custom 'x-auth-token' header
    const token = req.header("x-auth-token");

    // Verify token using JWT and secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token's user ID
    const user = await User.findOne({
      _id: decoded.user.id,
    });
    // If user is not found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Attach user and token to request object for further processing
    req.user = user;
    req.token = token;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Respond with an unauthorized status code and error message
    res.status(401).json({ error: "Please authenticate" });
  }
};

module.exports = auth;
