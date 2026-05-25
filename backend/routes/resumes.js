const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// @route   GET /api/resumes
// @desc    Get all resumes of logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('Fetch resumes error:', error.message);
    res.status(500).json({ message: 'Server error fetching resumes list' });
  }
});

// @route   GET /api/resumes/:id
// @desc    Get a single resume by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.id || req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify owner
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to access this resume' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Fetch resume by id error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(500).json({ message: 'Server error fetching resume details' });
  }
});

// @route   POST /api/resumes
// @desc    Create a new resume
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, templateId, personalInfo, experience, education, skills, projects, languages, customSections } = req.body;

  try {
    const newResume = new Resume({
      user: req.user.id,
      title: title || 'Untitled Resume',
      templateId: templateId || 'modern',
      personalInfo: personalInfo || {},
      experience: experience || [],
      education: education || [],
      skills: skills || [],
      projects: projects || [],
      languages: languages || [],
      customSections: customSections || []
    });

    const resume = await newResume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error.message);
    res.status(500).json({ message: 'Server error creating new resume' });
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update a resume (supports autosave)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, templateId, personalInfo, experience, education, skills, projects, languages, customSections } = req.body;

  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify owner
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this resume' });
    }

    // Update fields if provided
    if (title !== undefined) resume.title = title;
    if (templateId !== undefined) resume.templateId = templateId;
    if (personalInfo !== undefined) resume.personalInfo = personalInfo;
    if (experience !== undefined) resume.experience = experience;
    if (education !== undefined) resume.education = education;
    if (skills !== undefined) resume.skills = skills;
    if (projects !== undefined) resume.projects = projects;
    if (languages !== undefined) resume.languages = languages;
    if (customSections !== undefined) resume.customSections = customSections;

    // Trigger save (which runs pre-save hook for updatedAt)
    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    console.error('Update resume error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(500).json({ message: 'Server error updating resume details' });
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete a resume
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify owner
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this resume' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume removed successfully' });
  } catch (error) {
    console.error('Delete resume error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(500).json({ message: 'Server error deleting resume' });
  }
});

module.exports = router;
