const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({email : 1});

// ---------- methods ----------

//single token we are using [ I can use also refresh + access token but not mentioned in task]
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);       // where 10 is aur salt
};

module.exports = mongoose.model("User", userSchema);