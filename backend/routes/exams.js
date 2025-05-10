const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const multer = require('multer');
const upload = multer();
const Question = require('../models/Question');

// @route   POST api/exams
// @desc    Create an exam
// @access  Private (Teacher only)
router.post('/', [authMiddleware, roleMiddleware(['enseignant'])], examController.createExam);

// @route   GET api/exams
// @desc    Get all exams created by a teacher
// @access  Private (Teacher only)
router.get('/', [authMiddleware, roleMiddleware(['enseignant'])], examController.getTeacherExams);

// @route   GET api/exams/:id
// @desc    Get a specific exam by ID (for teacher to view/edit)
router.get('/:id', [authMiddleware, roleMiddleware(['enseignant'])], examController.getExamById);

// @route   PUT api/exams/:id
// @desc    Update an exam
// @access  Private (Teacher only)
router.put('/:id', [authMiddleware, roleMiddleware(['enseignant'])], examController.updateExam);

// @route   DELETE api/exams/:id
// @desc    Delete an exam (archives it)
// @access  Private (Teacher only)
router.delete('/:id', [authMiddleware, roleMiddleware(['enseignant'])], examController.deleteExam);

// @route   PUT api/exams/:id/status
// @desc    Update exam status (pause/resume)
// @access  Private (Teacher only)
router.put('/:id/status', [authMiddleware, roleMiddleware(['enseignant'])], examController.updateExamStatus);

// @route   GET api/exams/:id/results
// @desc    Get all student submissions for a specific exam (for teacher)
// @access  Private (Teacher only)
router.get('/:id/results', [authMiddleware, roleMiddleware(['enseignant'])], examController.getExamResults);

// @route   GET api/exams/:id/submissions/:submissionId
// @desc    Get detailed submission data for a specific submission (for teacher)
// @access  Private (Teacher only)
router.get('/:id/submissions/:submissionId', [authMiddleware, roleMiddleware(['enseignant'])], examController.getSubmissionDetailsForTeacher);

// Routes for students (accessing exam by link)
// @route   GET api/exams/link/:lienExamen
// @desc    Get exam details by unique link (for students)
// @access  Public (or Private if login required before viewing)
router.get('/link/:lienExamen', examController.getExamByLink); // May need authMiddleware if students must be logged in

// @route   GET api/exams/public
// @desc    Get all publicly available exams (for students)
// @access  Private (Student only - or public if exams are browsable before login)
router.get('/public/all', [authMiddleware, roleMiddleware(['etudiant'])], examController.getPublicExams);

// @route   GET api/exams/submissions/me
// @desc    Get all submissions for the logged-in student
// @access  Private (Student only)
router.get('/submissions/me', [authMiddleware, roleMiddleware(['etudiant'])], examController.getStudentSubmissions);

// @route   GET api/exams/attempts/me
// @desc    Get all exam attempts grouped by exam for the logged-in student
// @access  Private (Student only)
router.get('/attempts/me', [authMiddleware, roleMiddleware(['etudiant'])], examController.getStudentExamAttempts);

// @route   GET api/exams/submissions/:submissionId
// @desc    Get a specific submission by ID (for student to review their results)
// @access  Private (Student only)
router.get('/submissions/:submissionId', [authMiddleware, roleMiddleware(['etudiant'])], examController.getSubmissionById);

// @route   POST api/exams/:id/questions
// @desc    Add a question to an exam
// @access  Private (Teacher only)
router.post('/:id/questions', [authMiddleware, roleMiddleware(['enseignant']), upload.single('file')], examController.addQuestion);

// @route   POST api/exams/:id/submissions
// @desc    Submit answers for an exam
// @access  Private (Student only)
router.post('/:id/submissions', [authMiddleware, roleMiddleware(['etudiant'])], examController.addSubmission);

// @route   PUT api/exams/questions/:id
// @desc    Update a question
// @access  Private (Teacher only)
router.put('/questions/:id', [authMiddleware, roleMiddleware(['enseignant']), upload.single('file')], examController.updateQuestion);

// @route   DELETE api/exams/questions/:id
// @desc    Delete a question
// @access  Private (Teacher only)
router.delete('/questions/:id', [authMiddleware, roleMiddleware(['enseignant'])], examController.deleteQuestion);

// Route pour servir le fichier d'une question
router.get('/questions/:id/file', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question || !question.file || !question.file.data) {
      return res.status(404).json({ msg: 'Fichier non trouvé' });
    }
    res.set('Content-Type', question.file.mimetype);
    res.set('Content-Disposition', `inline; filename="${question.file.filename}"`);
    res.send(question.file.data);
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
