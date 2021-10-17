const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
// Google Login
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "1052309418279-37lkf36gbep0pi8sp9ke0a8uqgl8fogq.apps.googleusercontent.com"
);
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(404).json({
        message: "User already registered",
      });
    const { firstName, lastName, email, password } = req.body;
    const hash_password = bcrypt.hashSync(password, 10);
    const _user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      hash_password,
      // password: password,
      username: shortid.generate(),
    });
    _user.save((error, data) => {
      if (error) {
        // console.log(error);
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (data) {
        return res.status(201).json({
          user: data,
          message: "User registed succcessfully",
        });
      }
    });
  });
};
exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json(error);
    }
    if (user) {
      if ((await user.authenticate(req.body.password)) === false) {
        return res.status(400).json({
          message: "Email or password wrong",
        });
      }
      if (
        (await user.authenticate(req.body.password)) &&
        user.role === "admin"
      ) {
        return res.status(400).json({
          message: "Please use your customer account",
        });
      }
      if (
        (await user.authenticate(req.body.password)) &&
        user.role === "customer"
      ) {
        // const token = jwt.sign({ _id: user._id,role:user.role }, process.env.TOKEN, { expiresIn: '1h' })
        // if we want to check the return value from authenticate function we need to use a async await as following code
        // E.g: let isPassword= await user.authenticate(req.body.password)
        // Note : we need to use async await together . Async will be placed before function (e.g : async(error,user))
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.TOKEN
        );
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      }
    }
    if (!user)
      return res.status(404).json({
        message: "Email or password wrong",
      });
  });
};
exports.getUserDetail = (req, res) => {
  User.findOne({ _id: req.user._id })
    .select("firstName lastName email profilePicture")
    .exec()
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
exports.changePassword = (req, res) => {
  const { newPassword } = req.body;
  const new_hash_password = bcrypt.hashSync(newPassword, 10);
  if (!newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide us your new password" });
  }
  User.findOne({ _id: req.user._id })
    .exec()
    .then(async (user) => {
      if (user) {
        if ((await user.authenticate(req.body.currentPassword)) === false) {
          res.status(400).json({ message: "Current password is wrong" });
        } else {
          User.updateOne(
            { _id: req.user._id },
            { $set: { hash_password: new_hash_password } }
          )
            .exec()
            .then((result) => {
              res.status(200).json({ result });
            })
            .catch((err) => {
              res.status(400).json({ err });
            });
        }
      }
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
exports.updateUserDetail = (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (req.file) {
    let userImageUrl = req.file.location;
    User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          profilePicture: userImageUrl,
        },
      }
    )
      .exec()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).json({ message: err });
      });
  } else {
    User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          profilePicture: req.body.profilePicture,
        },
      }
    )
      .exec()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).json({ message: err });
      });
  }
};
// exports.requireSignin = (req, res, next) => {
//     const token = req.headers.authorization.split(" ")[1];
//     const user = jwt.verify(token, process.env.TOKEN);
//     req.user = user;
//     next();
// }
exports.loginGoogle = (req, res) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "1052309418279-37lkf36gbep0pi8sp9ke0a8uqgl8fogq.apps.googleusercontent.com",
    })
    .then((result) => {
      const { email_verified, given_name, family_name, email } = result.payload;
      if (email_verified) {
        User.findOne({ email }).exec(async (err, user) => {
          if (err) {
            return res.status(400).json({ err });
          } else {
            if (user) {
              const token = jwt.sign(
                { _id: user._id, role: user.role },
                process.env.TOKEN
              );
              const { _id, firstName, lastName, email, role, fullName } = user;
              res.status(200).json({
                token,
                user: {
                  _id,
                  firstName,
                  lastName,
                  email,
                  role,
                  fullName,
                },
              });
            } else {
              let password = email + process.env.GOOGLE_LOGIN;
              const hash_password = await bcrypt.hashSync(password, 10);
              const _user = new User({
                firstName: given_name,
                lastName: family_name,
                email: email,
                hash_password,
                // password: password,
                username: shortid.generate(),
              });
              _user.save((error, data) => {
                if (error) {
                  // console.log(error);
                  return res.status(400).json({
                    message: "Something went wrong",
                  });
                }
                if (data) {
                  return res.status(201).json({
                    user: data,
                    message: "User registed succcessfully",
                  });
                }
              });
            }
          }
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({ err });
    });
};
exports.loginFacebook = (req, res) => {
  const { accessToken, userID } = req.body;
  // console.log(accessToken, userID);
  let urlGraphFacebook = `https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphFacebook, { method: "GET" })
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      let { name, email } = response;
      User.findOne({ email }).exec(async (err, user) => {
        if (err) {
          return res.status(400).json({ err });
        } else {
          if (user) {
            const token = jwt.sign(
              { _id: user._id, role: user.role },
              process.env.TOKEN
            );
            const { _id, firstName, lastName, email, role, fullName } = user;
            res.status(200).json({
              token,
              user: {
                _id,
                firstName,
                lastName,
                email,
                role,
                fullName,
              },
            });
          } else {
            let password = email + process.env.FACEBOOK_LOGIN;
            let firstNameFacebook = name.split(" ")[0];
            let lastNameFacebook = name.split(" ").pop();
            const hash_password = await bcrypt.hashSync(password, 10);
            const _user = new User({
              firstName: firstNameFacebook,
              lastName: lastNameFacebook,
              email: email,
              hash_password,
              // password: password,
              username: shortid.generate(),
            });
            _user.save((error, data) => {
              if (error) {
                // console.log(error);
                return res.status(400).json({
                  message: "Something went wrong",
                });
              }
              if (data) {
                return res.status(201).json({
                  user: data,
                  message: "User registed succcessfully",
                });
              }
            });
          }
        }
      });
    });
};
exports.forgetPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).exec((err, user) => {
    if (err) return res.status(400).json({ message: "Something went wrong" });
    if (!user) {
      return res.status(400).json({ message: "User is not registered" });
    }
    if (user) {
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.RESET_PASSWORD
      );
      let output = `
            <div>
               <h3>Reset Password</h3>
               <p>Here is your reset password link: </p>
               <p>https://final-project-eta.vercel.app/reset-password/${token}</p>
            </div>
            `;
      async function main() {
        let transporter = await nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: `fesdvktest@gmail.com`,
            pass: process.env.FES_ADMIN_PASSWORD,
          },
        });
        let emailSent = await transporter.sendMail({
          from: ` FES <fesdvktest@gmail.com>`,
          to: `${email}`, // list of receivers
          subject: "FES Notification", // Subject line
          text: "Reset Link", // plain text body
          html: output, // html body
        });
        console.log(emailSent.messageId);
        console.log("email has been sent");
        res.status(200).json({ message: "Send mail successfully" });
      }
      main().catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
      });
    }
  });
};
exports.resetPassword = (req, res) => {
  const { token } = req.params;
  const verifyUser = jwt.verify(token, process.env.RESET_PASSWORD);
  if (!req.body.newPassword) {
    res.status(400).json({ message: "Please provide your new password" });
  }
  const password = bcrypt.hashSync(req.body.newPassword, 10);
  User.updateOne(
    { _id: verifyUser.userId },
    {
      $set: {
        hash_password: password,
      },
    }
  )
    .exec()
    .then(() => {
      res.status(200).json({ message: "Reset password successfully" });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
};
