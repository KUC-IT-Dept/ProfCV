export type ProfessionalDetails = {
  employeeId: string;
  designation: string;
  department: string;
  institutionName: string;
  affiliatedUniversity: string;
  institutionType: string;
  natureOfAppointment: string;
  dateOfJoining: string;
  dateOfConfirmation: string;
  payBand: string;
  bankAccountDetails: string;
  pfNumber: string;
  serviceBookNumber: string;
  dateOfFirstPromotion: string;
  natureOfFirstAppointment: string;
  firstPayBand: string;
  dateOfSecondPromotion: string;
  natureOfSecondAppointment: string;
  secondPayBand: string;
  dateOfThirdPromotion: string;
  natureOfThirdAppointment: string;
  thirdPayBand: string;
};

export type EntranceTests = {
  net: { subject: string; year: string; certificateNo: string };
  set: { subject: string; year: string; state: string };
  gate: { score: string; year: string };
  jrf: { agency: string; year: string };
  other: string;
};

export type Visibility = {
  bio: boolean;
  qualifications: boolean;
  publications: boolean;
  projects: boolean;
  subjects: boolean;
  customDetails: boolean;
  media: boolean;
  interests: boolean;
  professionalDetails: boolean;
  entranceTests: boolean;
  workExperiences: boolean;
  photo: boolean;
  dob: boolean;
  gender: boolean;
  phoneNumber: boolean;
  address: boolean;
};

export type Qualification = {
  [key: string]: string;
  degree: string;
  specialisation: string;
  institution: string;
  university: string;
  yearofpassing: string;
  cgpa: string;
  division: string;
  mode: string;
  country: string;
  state: string;
  tenthcertificate: string;
  twelfthcertificate: string;
  ugcertificate: string;
  pgcertificate: string;
  mphilcertificate: string;
};

export type WorkExperience = {
  institutionName: string;
  designation: string;
  department: string;
  fromDate: string;
  toDate: string;
  totalDuration: string;
  natureOfAppointment: string;
  reasonForLeaving: string;
};

export type Publication = {
  title: string;
  authors: string;
  journal: string;
  organisation: string;
  year: string;
  volume: string;
  issue: string;
  month: string;
  pages: string;
  doi: string;
  url: string;
};

export type Project = {
  title: string;
  description: string;
  year: string;
  url: string;
};

export type CustomDetail = {
  sectionTitle: string;
  content: string;
  isVisible: boolean;
};

export type Documents = {
  passportPhoto: string;
  signature: string;
  dobProof: string;
  categoryCertificate: string;
  degreeCertificates: string;
  netSetJrfCertificate: string;
  experienceCertificates: string;
  appointmentOrders: string;
  awardCertificates: string;
  publicationProofs: string;
  aadhaarCard: string;
  panCard: string;
};

export type Attachment = {
  name: string;
  url: string;
  fileType: string;
  sizeKB: number;
};

export type Profile = {
  name: string;
  bio: string;
  headline: string;
  subjects: string[];
  workExperiences: WorkExperience[];
  qualifications: Qualification[];
  publications: Publication[];
  projects: Project[];
  customDetails: CustomDetail[];
  interests: string[];
  media: { attachments: Attachment[]; videoEmbeds: string[] };
  documents: Documents;
  visibility: Visibility;
  photo?: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  address: string;
  subCategory: string;
  differentlyAbled: string;
  maritalStatus: string;
  spouse: string;
  emergencyContact: string;
  panNumber: string;
  bloodGroup: string;
  nationality: string;
  stateCity: string;
  permanentAddress: string;
  currentAddress: string;
  mobileNumber: string;
  alternatePhone: string;
  officialEmail: string;
  personalEmail: string;
  aadhaar: string;
  passport: string;
  religion: string;
  category: string;
  professionalDetails: ProfessionalDetails;
  entranceTests: EntranceTests;
};

export const EMPTY_PROFILE: Profile = {
  name: '',
  bio: '',
  headline: '',
  subjects: [],
  workExperiences: [],
  qualifications: [],
  publications: [],
  projects: [],
  customDetails: [],
  interests: [],
  photo: '',
  dob: '',
  gender: '',
  phoneNumber: '',
  address: '',
  subCategory: '',
  differentlyAbled: '',
  maritalStatus: '',
  spouse: '',
  emergencyContact: '',
  panNumber: '',
  bloodGroup: '',
  nationality: '',
  stateCity: '',
  permanentAddress: '',
  currentAddress: '',
  mobileNumber: '',
  alternatePhone: '',
  officialEmail: '',
  personalEmail: '',
  aadhaar: '',
  passport: '',
  religion: '',
  category: '',
  media: { attachments: [], videoEmbeds: [] },
  documents: {
    passportPhoto: '',
    signature: '',
    dobProof: '',
    categoryCertificate: '',
    degreeCertificates: '',
    netSetJrfCertificate: '',
    experienceCertificates: '',
    appointmentOrders: '',
    awardCertificates: '',
    publicationProofs: '',
    aadhaarCard: '',
    panCard: '',
  },
  visibility: {
    bio: true,
    qualifications: true,
    publications: true,
    projects: true,
    subjects: true,
    customDetails: true,
    media: false,
    interests: true,
    professionalDetails: true,
    entranceTests: true,
    workExperiences: true,
    photo: true,
    dob: false,
    gender: false,
    phoneNumber: false,
    address: false,
  },
  professionalDetails: {
    employeeId: '',
    designation: '',
    department: '',
    institutionName: '',
    affiliatedUniversity: '',
    institutionType: '',
    natureOfAppointment: '',
    dateOfJoining: '',
    dateOfConfirmation: '',
    payBand: '',
    bankAccountDetails: '',
    pfNumber: '',
    serviceBookNumber: '',
    dateOfFirstPromotion: '',
    natureOfFirstAppointment: '',
    firstPayBand: '',
    dateOfSecondPromotion: '',
    natureOfSecondAppointment: '',
    secondPayBand: '',
    dateOfThirdPromotion: '',
    natureOfThirdAppointment: '',
    thirdPayBand: '',
  },
  entranceTests: {
    net: { subject: '', year: '', certificateNo: '' },
    set: { subject: '', year: '', state: '' },
    gate: { score: '', year: '' },
    jrf: { agency: '', year: '' },
    other: '',
  },
};

export const VISIBILITY_SECTIONS = [
  { key: 'bio', label: 'Biography & Headline' },
  { key: 'subjects', label: 'Subjects Taught' },
  { key: 'interests', label: 'Interests' },
  { key: 'workExperiences', label: 'Work Experience' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'professionalDetails', label: 'Professional Details' },
  { key: 'entranceTests', label: 'Entrance / Eligibility Tests' },
  { key: 'publications', label: 'Publications' },
  { key: 'projects', label: 'Research Projects' },
  { key: 'customDetails', label: 'Custom Sections' },
  { key: 'media', label: 'Attachments & Media' },
] as const;
