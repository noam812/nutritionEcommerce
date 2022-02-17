const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 20,
  },
  lName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 40,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email Address is invalid");
      }
    },
  },
  password: {
    type: String,
    minlength: 6,

    trim: true,
    validate(value) {
      if (validator.isStrongPassword(value) === false) {
        throw new Error("Password is not strong Enough");
      }
    },
  },
  address1: {
    city: { type: String, trim: true, minlength: 5, required: true },
    street: { type: String, trim: true, minlength: 2, maxlength: 45 },
    streetNumber: { type: Number, trim: true, minlength: 1, maxlength: 8 },
  },
  address2: {
    city: { type: String, trim: true, minlength: 5 },
    street: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 45,
    },
    streetNumber: {
      type: Number,
      trim: true,
      minlength: 1,
      maxlength: 8,
    },
    zipcode: { type: String, trim: true },
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
  role: {
    type: String,
    enum: [`user`, `admin`],
    default: `user`,
    required: true,
  },
});

//For every instance of a user we genenrate a token
UserSchema.methods.generateAuthToken = async function () {
  //Assign user instance
  const user = this;
  //Generate token
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  //Save to tokens array
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Static method apply for the user model not user Instance (method for an instance)
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(`Unable to login`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error(`Unable to login`);
  }

  return user;
};

//encrypt password - the pre function built in mongoose
// Pre function allows us to manipulate data before saving to DB
UserSchema.pre("save", async function (next) {
  // basically checks if the password field contains data
  const user = this;
  //If so we will hash it.
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
