const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  grade: String,
});

const publicationSchema = new mongoose.Schema({
  title: String,
  journal: String,
  year: String,
  doi: String,
  url: String,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  year: String,
  url: String,
});

const customDetailSchema = new mongoose.Schema({
  sectionTitle: String,
  content: String,
});

const attachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
  fileType: String,
  sizeKB: Number,
});

const visibilitySchema = new mongoose.Schema({
  bio: { type: Boolean, default: true },
  qualifications: { type: Boolean, default: true },
  publications: { type: Boolean, default: true },
  projects: { type: Boolean, default: true },
  subjects: { type: Boolean, default: true },
  customDetails: { type: Boolean, default: true },
  media: { type: Boolean, default: false },
  interests: { type: Boolean, default: true },
  photo: { type: Boolean, default: true },
  phoneNumber: { type: Boolean, default: false },
  address: { type: Boolean, default: false },
  dob: { type: Boolean, default: false },
  gender: { type: Boolean, default: false },
}, { _id: false });

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: { type: String, default: '' },
    headline: { type: String, default: '' },
    photo: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    subjects: [String],
    qualifications: [qualificationSchema],
    publications: [publicationSchema],
    projects: [projectSchema],
    customDetails: [customDetailSchema],
    media: {
      attachments: {
        type: [attachmentSchema],
        validate: [
          {
            validator: function (arr) {
              return arr.every((a) => a.sizeKB <= 5120);
            },
            message: 'All attachments must be under 5 MB (5120 KB).',
          },
        ],
      },
      videoEmbeds: [String],
    },
    interests: [String],
    visibility: { type: visibilitySchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);

