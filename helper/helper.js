var jwt = require("jsonwebtoken");
require("dotenv").config();

//.........................
function generateToken(user) {
  const secret = process.env.SECRET_KEY;
  const token = jwt.sign(
    {
      data: user,
    },
    secret,
    { expiresIn: "3h" }
  );
  return token;
}

function verifyToken(req, res, next) {
  if (req.method != "GET") {
    const token = req.body.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            msg: "Token Expired",
          });
        }

        req.user = decoded;

        next();
      });
    } else {
      res.json({ success: false, msg: "token missing in request" });
    }
  } else {
    next();
  }
}
module.exports = { generateToken, verifyToken };
