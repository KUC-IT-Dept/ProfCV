const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  grade: String,
});

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: String,
  journal: String,
  organisation: String,
  volume: String,
  issue: String,
  month: String,
  year: { type: String, required: true },
  pages: String,
  doi: { type: String, required: true },
  url: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  year: { type: String, required: true },
  url: { type: String, required: true },
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

const professionalDetailSchema = new mongoose.Schema({
  employeeId: String,
  designation: String,
  department: String,
  institutionName: String,
  affiliatedUniversity: String,
  institutionType: String, // Government / Aided / Private / Deemed / Central University
  natureOfAppointment: String, // Regular / Contract / Guest etc
  dateOfJoining: String,
  dateOfConfirmation: String,
  payBand: String,
  bankAccountDetails: String,
  pfNumber: String,
  serviceBookNumber: String,

  // First promotion
  dateOfFirstPromotion: String,
  natureOfFirstAppointment: String,
  firstPayBand: String,

  // Second promotion
  dateOfSecondPromotion: String,
  natureOfSecondAppointment: String,
  secondPayBand: String,

  // Third promotion
  dateOfThirdPromotion: String,
  natureOfThirdAppointment: String,
  thirdPayBand: String,
}, { _id: false });

const entranceTestSchema = new mongoose.Schema({
  net: { subject: String, year: String, certificateNo: String },
  set: { subject: String, year: String, state: String },
  gate: { score: String, year: String },
  jrf: { agency: String, year: String },
  other: String, // Any other competitive exam qualified
}, { _id: false });

const visibilitySchema = new mongoose.Schema({
  bio: { type: Boolean, default: true },
  professionalDetails: { type: Boolean, default: true },
  entranceTests: { type: Boolean, default: true },
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
    professionalDetails: { type: professionalDetailSchema, default: () => ({}) },
    entranceTests: { type: entranceTestSchema, default: () => ({}) },
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

