const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  grade: String,
});

const publicationSchema = new mongoose.Schema({
  publicationType: { type: String, enum: ['Journal Articles', 'Book Chapters', 'Books Authored / Edited', 'Conference Papers', 'Other'], default: 'Journal Articles' },
  title: { type: String, required: true },
  authors: String,
  journal: String,
  organisation: String,
  volume: String,
  issue: String,
  month: String,
  year: { type: String, required: true },
  pages: String,
  doi: String,
  url: String,

  issn: String,
  indexedIn: String,
  impactFactor: String,
  bookTitle: String,
  publisher: String,
  isbn: String,
  editors: String,
  bookType: String,
  conferenceName: String,
  nationalInternational: String,
  venueDate: String,
  organizedBy: String,
  publishedInProceedings: String
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  year: String,
  url: String,
  fundingAgency: String,
  role: { type: String, enum: ['Principal Investigator', 'Co-PI'] },
  amount: String,
  duration: String,
  status: { type: String, enum: ['Ongoing', 'Completed'] },
  referenceNumber: String
});

const awardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  awardingBody: { type: String, required: true },
  level: { type: String, enum: ['Institution', 'State', 'National', 'International'], default: 'Institution' },
  year: { type: String, required: true },
  description: String,
});

const customDetailSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  content: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
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
  awards: { type: Boolean, default: true },
  projects: { type: Boolean, default: true },
  researchSupervision: { type: Boolean, default: true },
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
    awards: [awardSchema],
    projects: [projectSchema],
    researchSupervision: {
      phdAwardedCount: { type: String, default: '' },
      phdOngoingCount: { type: String, default: '' },
      mphilGuidedCount: { type: String, default: '' },
      completedStudentsNames: { type: String, default: '' },
      studentDetails: { type: String, default: '' }
    },
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

