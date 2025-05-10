const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        nom: 'Test',
        prenom: 'User',
        naissance: '2000-01-01',
        sexe: 'Homme',
        etablissement: 'Test School',
        filiere: 'Informatique',
        password: 'password123',
        role: 'etudiant',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('msg', 'User registered successfully');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('role', 'etudiant');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        nom: 'Test',
        prenom: 'User',
        naissance: '2000-01-01',
        sexe: 'Homme',
        etablissement: 'Test School',
        filiere: 'Informatique',
        password: 'password123',
        role: 'etudiant',
      });
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        nom: 'Test2',
        prenom: 'User2',
        naissance: '2000-01-01',
        sexe: 'Femme',
        etablissement: 'Test School',
        filiere: 'Maths',
        password: 'password123',
        role: 'enseignant',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });

  it('should login a registered user and return a JWT', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'loginuser@example.com',
        nom: 'Login',
        prenom: 'User',
        naissance: '2000-01-01',
        sexe: 'Homme',
        etablissement: 'Test School',
        filiere: 'Informatique',
        password: 'password123',
        role: 'enseignant',
      });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('role', 'enseignant');
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'wrongpass@example.com',
        nom: 'Wrong',
        prenom: 'Pass',
        naissance: '2000-01-01',
        sexe: 'Homme',
        etablissement: 'Test School',
        filiere: 'Informatique',
        password: 'password123',
        role: 'etudiant',
      });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('msg', 'Invalid credentials');
  });
});

// Tests for protected /me routes

describe('Protected /api/auth/me endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Register and login a user to get token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'meuser@example.com',
        nom: 'Me',
        prenom: 'User',
        naissance: '1990-05-09',
        sexe: 'Femme',
        etablissement: 'Test Univ',
        filiere: 'Science',
        password: 'securepass',
        role: 'etudiant',
      });
    userId = registerRes.body.userId;
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'meuser@example.com', password: 'securepass' });
    token = loginRes.body.token;
  });

  it('should reject GET /me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
  });

  it('should GET current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'meuser@example.com');
    expect(res.body).toHaveProperty('nom', 'Me');
    expect(res.body).toHaveProperty('prenom', 'User');
    expect(res.body).toHaveProperty('role', 'etudiant');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should update current user with PUT /me', async () => {
    const res = await request(app)
      .put('/api/auth/me')
      .set('x-auth-token', token)
      .send({ nom: 'UpdatedName', filiere: 'Maths' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nom', 'UpdatedName');
    expect(res.body).toHaveProperty('filiere', 'Maths');
    expect(res.body).toHaveProperty('email', 'meuser@example.com');
  });
});
