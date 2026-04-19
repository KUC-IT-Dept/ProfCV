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
  personalInfo: boolean; qualifications: boolean; entranceTests: boolean;
  professionalDetails: boolean; workExperiences: boolean; publications: boolean;
  awards: boolean; projects: boolean; researchSupervision: boolean;
  academicResponsibilities: boolean; professionalMemberships: boolean;
  trainingAndFdp: boolean; onlineCertification: boolean;
  internationalExperiences: boolean; documents: boolean; customDetails: boolean;
  photo: boolean; dob: boolean; gender: boolean; phoneNumber: boolean; address: boolean;
};

export type Qualification = {
  [key: string]: string;
  educationlevel: string;
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
  phdcertificate: string;
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
  publicationType: 'Journal Articles' | 'Book Chapters' | 'Books Authored / Edited' | 'Conference Papers' | 'Other';
  title: string;
  authors: string;
  journal?: string;
  organisation?: string;
  year: string;
  volume?: string;
  issue?: string;
  month?: string;
  pages?: string;
  doi: string;
  url: string;
  issn?: string;
  indexedIn?: string;
  impactFactor?: string;
  bookTitle?: string;
  publisher?: string;
  isbn?: string;
  editors?: string;
  bookType?: string;
  conferenceName?: string;
  nationalInternational?: string;
  venueDate?: string;
  organizedBy?: string;
  publishedInProceedings?: string;
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

export type InternationalExperience = {
  countryVisited: string;
  purpose: string;
  institutionName: string;
  duration: string;
  fundingSource: string;
};

export type AcademicCourse = {
  course: string;
  year: string;
  programme: string;
  subject: string;
};

export type ProfessionalMembership = {
  bodyName: string;
  membershipType: string;
  membershipId: string;
  yearOfJoining: string;
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
  internationalExperiences: InternationalExperience[];
  professionalMemberships: ProfessionalMembership[];
  customDetails: CustomDetail[];
  interests: string[];
  media: { attachments: Attachment[]; videoEmbeds: string[] };
  documents: Documents;
  visibility: Visibility;
  photo?: string;
  dob: string;
  academicResponsibilities: {
    courses: AcademicCourse[];
    classesHandled: string;
    administrativeRoles: string;
    committeeMemberships: string;
  };
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
  internationalExperiences: [],
  professionalMemberships: [],
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
    personalInfo: false, qualifications: true, entranceTests: true,
    professionalDetails: true, workExperiences: true, publications: true,
    awards: true, projects: true, researchSupervision: true,
    academicResponsibilities: true, professionalMemberships: true,
    trainingAndFdp: true, onlineCertification: true,
    internationalExperiences: true, documents: false, customDetails: true,
    photo: false, dob: false, gender: false, phoneNumber: false, address: false,
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
  academicResponsibilities: {
    courses: [],
    classesHandled: '',
    administrativeRoles: '',
    committeeMemberships: '',
  },
};

export const VISIBILITY_SECTIONS = [
  { key: 'personalInfo', label: 'Personal Info' },
  { key: 'qualifications', label: 'Qualification' },
  { key: 'entranceTests', label: 'Entrance / Eligibility Test' },
  { key: 'professionalDetails', label: 'Professional Details' },
  { key: 'workExperiences', label: 'Work Experience' },
  { key: 'publications', label: 'Research & Publications' },
  { key: 'awards', label: 'Awards & Honours' },
  { key: 'projects', label: 'Research Projects' },
  { key: 'researchSupervision', label: 'Research Supervision' },
  { key: 'academicResponsibilities', label: 'Academics Responsibility' },
  { key: 'professionalMemberships', label: 'Professional Membership' },
  { key: 'trainingAndFdp', label: 'Training, FDP & Workshops' },
  { key: 'onlineCertification', label: 'Online Certification' },
  { key: 'internationalExperiences', label: 'International Experience' },
  { key: 'documents', label: 'Documents Upload' },
  { key: 'customDetails', label: 'Custom Section' },
] as const;
