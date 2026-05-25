const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  summary: { type: String, default: '' }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' }
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' }
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  level: { type: String, default: '' } // Beginner, Intermediate, Expert, or rating/empty
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: { type: String, default: '' }, // comma separated or text
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' }
});

const LanguageSchema = new mongoose.Schema({
  language: { type: String, default: '' },
  proficiency: { type: String, default: '' } // Native, Fluent, Professional, etc.
});

const CustomSectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, default: '' },
  content: { type: String, default: '' }
});

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    default: 'Untitled Resume',
    trim: true
  },
  templateId: {
    type: String,
    required: true,
    default: 'modern'
  },
  personalInfo: {
    type: PersonalInfoSchema,
    default: () => ({})
  },
  experience: {
    type: [ExperienceSchema],
    default: []
  },
  education: {
    type: [EducationSchema],
    default: []
  },
  skills: {
    type: [SkillSchema],
    default: []
  },
  projects: {
    type: [ProjectSchema],
    default: []
  },
  languages: {
    type: [LanguageSchema],
    default: []
  },
  customSections: {
    type: [CustomSectionSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update standard updatedAt time pre-save
ResumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', ResumeSchema);
