require('../models/Question');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');
const User = require('../models/User');

// Create a new exam
exports.createExam = async (req, res) => {
  const { titre, description, publicCible } = req.body;
  try {
    const newExam = new Exam({
      titre,
      description,
      publicCible,
      createdBy: req.user.id, // From authMiddleware
    });
    const exam = await newExam.save();
    res.status(201).json(exam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all exams for the logged-in teacher
exports.getTeacherExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      createdBy: req.user.id,
      status: { $ne: 'archivé' } // Ne pas inclure les examens archivés
    }).sort({ dateCreation: -1 });
    res.json(exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single exam by its ID (for teacher)
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, status: { $ne: 'archivé' } }).populate('questions'); // Populate questions
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }
    // Ensure the teacher requesting is the one who created it
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(exam);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Exam not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  const { titre, description, publicCible } = req.body;
  try {
    let exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $set: { titre, description, publicCible } },
      { new: true }
    );
    res.json(exam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an exam (soft delete by archiving)
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ msg: 'Examen non trouvé' });
    }
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Utilisateur non autorisé' });
    }

    // Soft delete: change status to 'archivé'
    exam.status = 'archivé';
    await exam.save();

    // Optionnel : Si vous voulez supprimer les questions associées lors de l'archivage,
    // décommentez et adaptez la logique ci-dessous.
    // Attention : cela supprimerait définitivement les questions.
    // if (exam.questions && exam.questions.length > 0) {
    //   await Question.deleteMany({ _id: { $in: exam.questions } });
    // }

    res.json({ msg: 'Examen archivé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
};

// Get exam by unique link (for students)
exports.getExamByLink = async (req, res) => {
    try {
        // Find exam and populate questions for student view
        const exam = await Exam.findOne({ 
            lienExamen: req.params.lienExamen,
            status: 'actif' // Seuls les examens actifs sont accessibles par lien direct
        }).populate('questions');
        if (!exam) {
            return res.status(404).json({ msg: 'Exam not found or link is invalid' });
        }
        // Convert Mongoose doc to plain object and serialize file data to base64
        const examObj = exam.toObject();
        examObj.questions = examObj.questions.map(question => {
            if (question.file && question.file.data) {
                question.file.data = question.file.data.toString('base64');
            }
            return question;
        });
        res.json(examObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all publicly available exams (for students)
exports.getPublicExams = async (req, res) => {
  try {
    // For now, returns all exams. Add filtering logic if needed (e.g., by status: 'published')
    // Also, might want to select fewer fields than when a teacher gets their own exams
    const exams = await Exam.find({}).select('titre description publicCible lienExamen dateCreation').sort({ dateCreation: -1 });
    res.json(exams);
  } catch (err) {
    console.error('Error fetching public exams:', err.message);
    res.status(500).send('Server Error');
  }
};

// Add question to exam
exports.addQuestion = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    if (exam.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    const { text, type, duration, score, answer, tolerance } = req.body;
    
    let questionOptions = [];
    let questionCorrectIndices = [];

    if (type === 'qcm') {
      if (Array.isArray(req.body.options)) {
        questionOptions = req.body.options.map(String);
      } else {
        let i = 0;
        while (req.body[`options[${i}]`] !== undefined) {
          questionOptions.push(String(req.body[`options[${i}]`]));
          i++;
        }
      }

      if (req.body.correct !== undefined) {
        const correctValues = Array.isArray(req.body.correct) ? req.body.correct : [req.body.correct];
        questionCorrectIndices = correctValues.map(val => parseInt(val, 10)).filter(n => !isNaN(n));
      }
      
      if (questionOptions.length === 0) {
        return res.status(400).json({ msg: 'QCM questions must have options.' });
      }
      // Optionally, validate that correct indices are within bounds of options length
    }

    const newQuestionData = { 
      text, 
      type, 
      duration, 
      score, 
      options: questionOptions,       // Ensure these are set based on type
      correct: questionCorrectIndices // Ensure these are set based on type
    };

    if (type === 'direct') {
      newQuestionData.answer = answer;
      if (tolerance !== undefined) {
        newQuestionData.tolerance = tolerance;
      }
    }


    if (req.file) {
      newQuestionData.file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        data: req.file.buffer
      };
    }
    
    const newQuestion = new Question(newQuestionData);
    const savedQuestion = await newQuestion.save();
    
    exam.questions.push(savedQuestion._id);
    await exam.save();
    
    res.status(201).json(savedQuestion.toObject());

  } catch (err) {
    console.error('Error in addQuestion:', err.message, err.stack); 
    res.status(500).send('Server Error');
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const exam = await Exam.findOne({ questions: req.params.id });
    if (!exam) return res.status(404).json({ msg: 'Exam not found for this question' });
    if (exam.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    const { text, type, duration, score, answer, tolerance, removeFile } = req.body;
    
    const updateData = {
      text: text !== undefined ? text : question.text,
      type: type !== undefined ? type : question.type,
      duration: duration !== undefined ? duration : question.duration,
      score: score !== undefined ? score : question.score,
    };

    const finalType = updateData.type; // Type after potential update

    if (finalType === 'qcm') {
      let newOptions = question.options || [];
      if (req.body.options !== undefined) { // If options are being explicitly updated
        if (Array.isArray(req.body.options)) {
          newOptions = req.body.options.map(String);
        } else {
          newOptions = []; // Reset if not an array
          let i = 0;
          while (req.body[`options[${i}]`] !== undefined) {
            newOptions.push(String(req.body[`options[${i}]`]));
            i++;
          }
        }
        // If options were provided but resulted in an empty array, it's a validation error.
        if (newOptions.length === 0) {
          return res.status(400).json({ msg: 'QCM questions must have options if options are being set/updated.' });
        }
      }
      updateData.options = newOptions;

      let newCorrect = question.correct || [];
      if (req.body.correct !== undefined) { // If correct indices are being explicitly updated
        const correctValues = Array.isArray(req.body.correct) ? req.body.correct : [req.body.correct];
        newCorrect = correctValues.map(val => parseInt(val, 10)).filter(n => !isNaN(n));
      } else if (req.body.options !== undefined) {
        // If options were updated but 'correct' was not, assume new options have no correct answers marked.
        newCorrect = [];
      }
      updateData.correct = newCorrect;
      
      // Clear direct answer fields if type is QCM
      updateData.answer = undefined; 
      updateData.tolerance = undefined;

    } else if (finalType === 'direct') {
      updateData.answer = answer !== undefined ? answer : question.answer;
      updateData.tolerance = tolerance !== undefined ? tolerance : question.tolerance;
      // Clear QCM fields if type is direct
      updateData.options = [];
      updateData.correct = [];
    } else {
        // If type is somehow invalid or not set, preserve existing or clear based on policy
        updateData.options = question.options || [];
        updateData.correct = question.correct || [];
        updateData.answer = question.answer;
        updateData.tolerance = question.tolerance;
    }


    if (req.file) {
      updateData.file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        data: req.file.buffer
      };
    } else if (removeFile === 'true') {
      updateData.file = null; 
    }

    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.json(updatedQuestion.toObject());
  } catch (err) {
    console.error("Error updating question:", err.message, err.stack);
    res.status(500).send('Server Error');
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const exam = await Exam.findOne({ questions: req.params.id });
    if (!exam) return res.status(404).json({ msg: 'Exam not found for this question, cannot verify ownership or update exam' });
    if (exam.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    // Remove question ID from exam's questions array
    exam.questions.pull(req.params.id);
    await exam.save();

    await Question.findByIdAndDelete(req.params.id);
    // await question.remove(); // Alternative for older mongoose

    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error("Error deleting question:", err.message);
    res.status(500).send('Server Error');
  }
};

// Submit answers for an exam (student)
exports.addSubmission = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    
    // Count previous attempts by this student on this exam
    const previousAttempts = await Submission.countDocuments({
      exam: exam._id,
      student: req.user.id
    });
    
    // Compute scores
    const totalScorePossible = exam.questions.reduce((sum, q) => sum + (q.score || 0), 0); // Renamed for clarity
    let actualScore = 0; // Renamed for clarity
    const answerDetails = [];
    // req.user.id is student ID
    for (const sub of req.body.answers) {
      const question = exam.questions.find(q => q._id.toString() === sub.question);
      if (!question) continue;
      let scoreAwarded = 0;
      const userAns = sub.answer; // For QCM, this is an array of selected indices. For direct, a string.
      if (question.type === 'direct') {
        // Case-insensitive comparison for direct answers
        if (String(userAns).trim().toLowerCase() === String(question.answer).trim().toLowerCase()) {
          scoreAwarded = question.score;
        }
      } else if (question.type === 'qcm') {
        const correctIndices = question.correct; // Array of correct indices (numbers)

        if (Array.isArray(userAns) && Array.isArray(correctIndices)) {
          // Sort both arrays to ensure order doesn't affect comparison of content
          const sortedUserAns = [...userAns].map(Number).sort((a, b) => a - b);
          const sortedCorrectIndices = [...correctIndices].sort((a, b) => a - b);

          if (sortedUserAns.length === sortedCorrectIndices.length &&
              sortedUserAns.every((val, index) => val === sortedCorrectIndices[index])) {
            scoreAwarded = question.score;
          }
        }
      }
      actualScore += scoreAwarded;
      answerDetails.push({ question: question._id, answer: userAns, scoreAwarded, correctAnswer: question.type === 'qcm' ? question.correct : question.answer });
    }
    const percentage = totalScorePossible ? Math.round((actualScore / totalScorePossible) * 100) : 0;
    
    // Extract tracking information
    const { startTime, timeSpent, geolocation } = req.body; // Changed 'location' to 'geolocation' to match frontend
    
    const submission = new Submission({
      exam: exam._id,
      student: req.user.id,
      answers: answerDetails,
      totalScore: actualScore,
      totalScorePossible: totalScorePossible,
      percentage,
      // Storing counts for easier display on results page
      totalQuestions: exam.questions.length,
      correctAnswersCount: answerDetails.filter(a => a.scoreAwarded > 0).length,
      attemptNumber: previousAttempts + 1, // Set the attempt number
      // Add tracking information if provided
      startTime: startTime || undefined,
      timeSpent: timeSpent || undefined,
      // Updated to handle the new geolocation object structure
      location: geolocation ? {
        latitude: geolocation.latitude || undefined,
        longitude: geolocation.longitude || undefined,
        accuracy: geolocation.accuracy || undefined, // Added accuracy
        // city and country are not provided by navigator.geolocation directly
        // but the schema supports them if they were to be added from another source
        city: geolocation.city || undefined, 
        country: geolocation.country || undefined
      } : undefined
    });
    await submission.save();
    // Return more detailed results
    res.json({ 
      submissionId: submission._id,
      totalScore: actualScore, 
      totalScorePossible: totalScorePossible,
      percentage,
      totalQuestions: exam.questions.length,
      correctAnswersCount: answerDetails.filter(a => a.scoreAwarded > 0).length,
      examTitle: exam.titre,
      attemptNumber: previousAttempts + 1 // Include attempt number in the response
    });
  } catch (err) {
    console.error('Error in addSubmission:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get exam submissions for the logged-in student
exports.getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate('exam', 'titre') // Populate exam title
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching student submissions:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get a specific submission by ID (for student to review their results)
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('exam', 'titre questions') // Populate exam details and questions
      .populate('answers.question', 'text type options score'); // Populate question details within answers

    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    // Ensure the student requesting is the one who owns the submission
    if (submission.student.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // We might not want to send all question data (like correct answers) if not already included
    // The current `addSubmission` response is quite detailed, this could return the submission doc directly
    res.json(submission);
  } catch (err) {
    console.error('Error fetching submission by ID:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Submission not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Get exam attempts grouped by exam for the logged-in student
exports.getStudentExamAttempts = async (req, res) => {
  try {
    // Get all submissions for the student
    const submissions = await Submission.find({ student: req.user.id })
      .populate('exam', 'titre')
      .sort({ submittedAt: -1 });
    
    // Group submissions by exam
    const examAttempts = {};
    submissions.forEach(submission => {
      // Skip if the exam has been deleted
      if (!submission.exam) return;
      
      const examId = submission.exam._id.toString();
      if (!examAttempts[examId]) {
        examAttempts[examId] = {
          examId,
          examTitle: submission.exam.titre,
          attempts: []
        };
      }
      
      examAttempts[examId].attempts.push({
        submissionId: submission._id,
        attemptNumber: submission.attemptNumber,
        submittedAt: submission.submittedAt,
        percentage: submission.percentage,
        totalScore: submission.totalScore,
        totalScorePossible: submission.totalScorePossible
      });
    });
    
    // Convert to array for easier consumption by frontend
    const result = Object.values(examAttempts);
    res.json(result);
  } catch (err) {
    console.error('Error fetching student exam attempts:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get all exam submissions for a specific exam (for teachers)
exports.getExamResults = async (req, res) => {
  try {
    // Find the exam first to ensure it belongs to the requesting teacher
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    // Verify the teacher owns this exam
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to view results for this exam' });
    }

    // Get all submissions for this exam
    const submissions = await Submission.find({ exam: req.params.id })
      .populate('student', 'prenom nom email filiere annee semestre groupe') // Include student details with educational info
      .sort({ student: 1, submittedAt: -1 }); // Group by student, then most recent first

    // Group submissions by student
    const resultsByStudent = {};
    submissions.forEach(submission => {
      const studentId = submission.student._id.toString();
      
      if (!resultsByStudent[studentId]) {
        resultsByStudent[studentId] = {
          student: {
            id: studentId,
            prenom: submission.student.prenom,
            nom: submission.student.nom,
            email: submission.student.email,
            filiere: submission.student.filiere,
            annee: submission.student.annee,
            semestre: submission.student.semestre,
            groupe: submission.student.groupe
          },
          attempts: []
        };
      }
      
      resultsByStudent[studentId].attempts.push({
        submissionId: submission._id,
        submittedAt: submission.submittedAt,
        attemptNumber: submission.attemptNumber,
        totalScore: submission.totalScore,
        totalScorePossible: submission.totalScorePossible,
        percentage: submission.percentage,
        correctAnswersCount: submission.correctAnswersCount,
        totalQuestions: submission.totalQuestions
      });
    });

    // Convert to array for easier frontend consumption
    const results = Object.values(resultsByStudent);
    
    res.json({ 
      exam: {
        id: exam._id,
        title: exam.titre,
        description: exam.description
      }, 
      studentResults: results 
    });
  } catch (err) {
    console.error('Error fetching exam results:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get detailed submission data for a teacher
exports.getSubmissionDetailsForTeacher = async (req, res) => {
  try {
    const { id, submissionId } = req.params;
    
    // Find the exam first to ensure it belongs to the requesting teacher
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    // Verify the teacher owns this exam
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to view this submission' });
    }

    // Get the submission with populated data
    const submission = await Submission.findById(submissionId)
      .populate('student', 'prenom nom email')
      .populate({
        path: 'answers.question',
        select: 'text type options correctAnswer score'
      })
      .populate('exam', 'titre description');

    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    // Verify this submission belongs to the specified exam
    if (submission.exam._id.toString() !== id) {
      return res.status(400).json({ msg: 'Submission does not belong to the specified exam' });
    }
    
    // Add supplementary information if available
    const enrichedSubmission = {
      ...submission.toObject(),
      timeSpent: submission.timeSpent || null,
      startTime: submission.startTime || null,
      location: submission.location || null
    };

    res.json(enrichedSubmission);
  } catch (err) {
    console.error('Error fetching submission details:', err.message);
    res.status(500).send('Server Error');
  }
};

// Add new controller function to update exam status (pause/resume)
exports.updateExamStatus = async (req, res) => {
  const { status } = req.body;
  // Validate status
  if (!['actif', 'enPause'].includes(status)) {
    return res.status(400).json({ msg: 'Statut invalide. Les statuts autorisés sont : actif, enPause.' });
  }

  try {
    let exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ msg: 'Examen non trouvé' });
    }
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Utilisateur non autorisé' });
    }

    // Prevent changing status of an archived exam via this endpoint
    if (exam.status === 'archivé') {
      return res.status(400).json({ msg: 'Cet examen est archivé et son statut ne peut plus être modifié directement. Pour le réactiver, une autre logique serait nécessaire.' });
    }

    exam.status = status;
    await exam.save();
    res.json(exam);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Examen non trouvé' });
    }
    res.status(500).send('Erreur du serveur');
  }
};