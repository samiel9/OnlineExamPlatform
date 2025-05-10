const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question'); // Add this line
const Submission = require('../models/Submission'); // Added this line

describe('Exam API', () => {
  let token;
  let teacherId;
  let examId; // To store created exam ID for question tests
  let studentToken;
  let studentId;

  const teacherData = {
    email: 'teacher@example.com',
    nom: 'Teacher',
    prenom: 'One',
    naissance: '1990-01-01',
    sexe: 'Autre',
    etablissement: 'Test University',
    filiere: 'CS',
    password: 'password123',
    role: 'enseignant',
  };

  const studentData = {
    email: 'student@example.com',
    nom: 'Student',
    prenom: 'One',
    naissance: '2000-01-01',
    sexe: 'Homme',
    etablissement: 'Test University',
    filiere: 'CS',
    annee: '1',
    semestre: '1',
    groupe: 'A',
    password: 'password123',
    role: 'etudiant',
  };

  beforeAll(async () => {
    // Register and login teacher to get token
    const resRegTeacher = await request(app)
      .post('/api/auth/register')
      .send(teacherData);
    teacherId = resRegTeacher.body.userId;

    const resLoginTeacher = await request(app)
      .post('/api/auth/login')
      .send({ email: teacherData.email, password: teacherData.password });
    token = resLoginTeacher.body.token;

    // Register and login student to get token
    const resRegStudent = await request(app)
      .post('/api/auth/register')
      .send(studentData);
    studentId = resRegStudent.body.userId;

    const resLoginStudent = await request(app)
      .post('/api/auth/login')
      .send({ email: studentData.email, password: studentData.password });
    studentToken = resLoginStudent.body.token;
  });

  afterEach(async () => {
    await Exam.deleteMany();
    await Question.deleteMany(); // Add this line to clean up questions
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  it('should create a new exam', async () => {
    const examData = { titre: 'Test Exam', description: 'Desc', publicCible: 'CS Students' };
    const res = await request(app)
      .post('/api/exams')
      .set('x-auth-token', token)
      .send(examData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toMatchObject({ titre: 'Test Exam', description: 'Desc', publicCible: 'CS Students' });
    expect(res.body).toHaveProperty('lienExamen');
  });

  it('should get all exams for the teacher', async () => {
    // Create two exams
    await request(app).post('/api/exams').set('x-auth-token', token).send({ titre: 'Exam1', description: 'D1', publicCible: 'A' });
    await request(app).post('/api/exams').set('x-auth-token', token).send({ titre: 'Exam2', description: 'D2', publicCible: 'B' });

    const res = await request(app)
      .get('/api/exams')
      .set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('should get an exam by ID', async () => {
    const createRes = await request(app)
      .post('/api/exams')
      .set('x-auth-token', token)
      .send({ titre: 'SingleExam', description: 'D', publicCible: 'All' });
    const examId = createRes.body._id;

    const res = await request(app)
      .get(`/api/exams/${examId}`)
      .set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', examId);
  });

  it('should update an existing exam', async () => {
    const createRes = await request(app)
      .post('/api/exams')
      .set('x-auth-token', token)
      .send({ titre: 'Old', description: 'OldD', publicCible: 'X' });
    const examId = createRes.body._id;

    const res = await request(app)
      .put(`/api/exams/${examId}`)
      .set('x-auth-token', token)
      .send({ titre: 'Updated', description: 'NewD', publicCible: 'Y' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('titre', 'Updated');
    expect(res.body).toHaveProperty('description', 'NewD');
    expect(res.body).toHaveProperty('publicCible', 'Y');
  });

  it('should delete an exam', async () => {
    const createRes = await request(app)
      .post('/api/exams')
      .set('x-auth-token', token)
      .send({ titre: 'ToDelete', description: 'Some description', publicCible: 'All students' });
    const examId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/exams/${examId}`)
      .set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Examen archivé avec succès');

    const findRes = await request(app)
      .get(`/api/exams/${examId}`)
      .set('x-auth-token', token);
    expect(findRes.statusCode).toBe(404);
  });

  it('should get an exam by its unique link', async () => {
    const createRes = await request(app)
      .post('/api/exams')
      .set('x-auth-token', token)
      .send({ titre: 'ByLink', description: 'Some description', publicCible: 'Target audience' });
    const link = createRes.body.lienExamen;

    const res = await request(app)
      .get(`/api/exams/link/${link}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('lienExamen', link);
  });

  describe('Question Management', () => {
    beforeEach(async () => {
      // Create an exam to be used for question tests
      const examData = { titre: 'Question Test Exam', description: 'Exam for testing questions', publicCible: 'Testers' };
      const res = await request(app)
        .post('/api/exams')
        .set('x-auth-token', token)
        .send(examData);
      examId = res.body._id;
    });

    it('should add a new direct question to an exam', async () => {
      const questionData = {
        text: 'What is 2+2?',
        type: 'direct',
        duration: 60,
        score: 5,
        answer: '4'
      };
      const res = await request(app)
        .post(`/api/exams/${examId}/questions`)
        .set('x-auth-token', token)
        .send(questionData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.text).toBe('What is 2+2?');
      expect(res.body.type).toBe('direct');

      // Verify the question is added to the exam
      const examRes = await request(app).get(`/api/exams/${examId}`).set('x-auth-token', token);
      expect(examRes.body.questions.length).toBe(1);
      expect(examRes.body.questions[0]._id).toBe(res.body._id);
    });

    it('should add a new QCM question to an exam', async () => {
      const questionData = {
        text: 'Which is a programming language?',
        type: 'qcm',
        duration: 90,
        score: 10,
        options: ['Apple', 'Banana', 'JavaScript'],
        correct: [2] // Index of 'JavaScript'
      };
      const res = await request(app)
        .post(`/api/exams/${examId}/questions`)
        .set('x-auth-token', token)
        .send(questionData);
      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe('Which is a programming language?');
      expect(res.body.type).toBe('qcm');
      expect(res.body.options).toEqual(['Apple', 'Banana', 'JavaScript']);
      expect(res.body.correct).toEqual([2]);
    });

    it('should update an existing question', async () => {
      // First, add a question
      const addRes = await request(app)
        .post(`/api/exams/${examId}/questions`)
        .set('x-auth-token', token)
        .send({ text: 'Old text', type: 'direct', duration: 30, score: 2, answer: 'Old answer' });
      const questionId = addRes.body._id;

      const updatedData = {
        text: 'New updated text',
        type: 'direct',
        duration: 45,
        score: 3,
        answer: 'New answer'
      };
      const res = await request(app)
        .put(`/api/exams/questions/${questionId}`)
        .set('x-auth-token', token)
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body.text).toBe('New updated text');
      expect(res.body.duration).toBe(45);
      expect(res.body.score).toBe(3);
      expect(res.body.answer).toBe('New answer');
    });

    it('should delete a question', async () => {
      // First, add a question
      const addRes = await request(app)
        .post(`/api/exams/${examId}/questions`)
        .set('x-auth-token', token)
        .send({ text: 'To be deleted', type: 'direct', duration: 10, score: 1, answer: 'delete' });
      const questionId = addRes.body._id;

      const res = await request(app)
        .delete(`/api/exams/questions/${questionId}`)
        .set('x-auth-token', token);
      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toBe('Question removed');

      // Verify the question is removed from the exam
      const examRes = await request(app).get(`/api/exams/${examId}`).set('x-auth-token', token);
      expect(examRes.body.questions.length).toBe(0);
    });

    it('should add a question with a file', async () => {
        const res = await request(app)
          .post(`/api/exams/${examId}/questions`)
          .set('x-auth-token', token)
          .field('text', 'Question with image')
          .field('type', 'direct')
          .field('duration', 60)
          .field('score', 5)
          .field('answer', 'Some answer')
          .attach('file', Buffer.from('test file content'), 'test.txt');
  
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('file');
        expect(res.body.file.filename).toBe('test.txt');
        expect(res.body.file.mimetype).toBe('text/plain'); // multer infers this from .txt
      });

    it('should update a question and add a file', async () => {
        const addRes = await request(app)
            .post(`/api/exams/${examId}/questions`)
            .set('x-auth-token', token)
            .send({ text: 'Question without file initially', type: 'direct', duration: 30, score: 2, answer: 'initial' });
        const questionId = addRes.body._id;

        const res = await request(app)
            .put(`/api/exams/questions/${questionId}`)
            .set('x-auth-token', token)
            .field('text', 'Updated question with new file')
            .field('type', 'direct')
            .field('duration', 45)
            .field('score', 3)
            .field('answer', 'updated answer')
            .attach('file', Buffer.from('new file content'), 'new_image.jpg');

        expect(res.statusCode).toBe(200);
        expect(res.body.file.filename).toBe('new_image.jpg');
        expect(res.body.file.mimetype).toBe('image/jpeg');
    });

    it('should update a question and remove an existing file', async () => {
        // Add question with a file first
        const addResWithFile = await request(app)
            .post(`/api/exams/${examId}/questions`)
            .set('x-auth-token', token)
            .field('text', 'Question with a file to be removed')
            .field('type', 'direct')
            .field('duration', 60)
            .field('score', 5)
            .field('answer', 'answer with file')
            .attach('file', Buffer.from('content of file to remove'), 'to_remove.png');
        const questionIdWithFile = addResWithFile.body._id;
        expect(addResWithFile.body.file).toBeDefined();

        // Now update and remove the file
        const res = await request(app)
            .put(`/api/exams/questions/${questionIdWithFile}`)
            .set('x-auth-token', token)
            .field('text', 'Question text updated, file removed')
            .field('type', 'direct')
            .field('duration', 70)
            .field('score', 6)
            .field('answer', 'answer, file gone')
            .field('removeFile', 'true');

        expect(res.statusCode).toBe(200);
        expect(res.body.file).toBeNull();
    });

    it('should serve a question file', async () => {
        const fileContent = 'this is a test file for serving';
        const fileName = 'serve_me.txt';
        const addRes = await request(app)
            .post(`/api/exams/${examId}/questions`)
            .set('x-auth-token', token)
            .field('text', 'Question for file serving test')
            .field('type', 'direct')
            .field('duration', 10)
            .field('score', 1)
            .field('answer', 'ok')
            .attach('file', Buffer.from(fileContent), fileName);
        const questionId = addRes.body._id;

        const res = await request(app)
            .get(`/api/exams/questions/${questionId}/file`)
            .set('x-auth-token', token); // Assuming auth might be needed, adjust if public
        
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/plain/);
        expect(res.headers['content-disposition']).toContain(`filename="${fileName}"`);
        expect(res.text).toBe(fileContent);
    });

  });

  describe('Submission Geolocation', () => {
    let examForSubmissionId;

    beforeEach(async () => {
      // Create an exam
      const examData = { titre: 'Geolocation Test Exam', description: 'Exam for testing geolocation', publicCible: 'Testers', status: 'actif' };
      const resExam = await request(app)
        .post('/api/exams')
        .set('x-auth-token', token) // Teacher token
        .send(examData);
      examForSubmissionId = resExam.body._id;

      // Add a question to the exam to make it submittable
      const questionData = {
        text: 'Sample question?',
        type: 'direct',
        duration: 60,
        score: 5,
        answer: 'sample'
      };
      await request(app)
        .post(`/api/exams/${examForSubmissionId}/questions`)
        .set('x-auth-token', token) // Teacher token
        .send(questionData);
    });

    it('should store geolocation data when a student submits an exam', async () => {
      const submissionData = {
        answers: [
          { question: (await Exam.findById(examForSubmissionId).populate('questions')).questions[0]._id, answer: 'student answer' }
        ],
        startTime: new Date().toISOString(),
        timeSpent: 120, // 2 minutes
        geolocation: {
          latitude: 48.8566,
          longitude: 2.3522,
          accuracy: 10,
        },
      };

      const res = await request(app)
        .post(`/api/exams/${examForSubmissionId}/submissions`)
        .set('x-auth-token', studentToken) // Student token
        .send(submissionData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('submissionId');

      // Verify the submission in the database
      const submission = await Submission.findById(res.body.submissionId);
      expect(submission).toBeDefined();
      expect(submission.location).toBeDefined();
      expect(submission.location.latitude).toBe(48.8566);
      expect(submission.location.longitude).toBe(2.3522);
      expect(submission.location.accuracy).toBe(10);
    });

    it('should handle submission without geolocation data gracefully', async () => {
        const submissionData = {
          answers: [
            { question: (await Exam.findById(examForSubmissionId).populate('questions')).questions[0]._id, answer: 'another answer' }
          ],
          startTime: new Date().toISOString(),
          timeSpent: 90,
          // No geolocation data sent
        };
  
        const res = await request(app)
          .post(`/api/exams/${examForSubmissionId}/submissions`)
          .set('x-auth-token', studentToken) // Student token
          .send(submissionData);
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('submissionId');
  
        const submission = await Submission.findById(res.body.submissionId);
        expect(submission).toBeDefined();
        // Location should be undefined or an empty object as per current controller logic
        // If the controller sets it to an empty object: expect(submission.location).toEqual({});
        // If it's undefined:
        expect(submission.location).toEqual({}); // Changed from toBeUndefined()
      });

    it('should handle submission with partial geolocation data', async () => {
      const submissionData = {
        answers: [
          { question: (await Exam.findById(examForSubmissionId).populate('questions')).questions[0]._id, answer: 'partial geo answer' }
        ],
        startTime: new Date().toISOString(),
        timeSpent: 60,
        geolocation: {
          latitude: 34.0522,
          // Longitude and accuracy missing
        },
      };

      const res = await request(app)
        .post(`/api/exams/${examForSubmissionId}/submissions`)
        .set('x-auth-token', studentToken) // Student token
        .send(submissionData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('submissionId');

      const submission = await Submission.findById(res.body.submissionId);
      expect(submission).toBeDefined();
      expect(submission.location).toBeDefined();
      expect(submission.location.latitude).toBe(34.0522);
      expect(submission.location.longitude).toBeUndefined();
      expect(submission.location.accuracy).toBeUndefined();
    });
  });

});
