const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  {
    _id: false,
  }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In-Progress",
        "Completed",
      ],
      default: "Pending",
    },

    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    attachments: {
      type: [attachmentSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: "Maximum 3 attachments allowed",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);