import sinon from 'sinon';
import chai from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';

import { app } from '../app';
import SequelizeUserModel from '../database/models/SequelizeUserModel';
import UsersMock from './mocks/UsersMock';
import JWT from '../utils/JWT';
import LoginValidation from '../middlewares/LoginValidation';
import { validLoginBody } from './mocks/ValidLoginBody';

chai.use(chaiHttp);

const { expect } = chai;

describe('User test', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('Route POST /login', () => {
    it('Should not be able to login without email', async () => {
      const { status, body } = await chai.request(app).post('/login').send({ password: '123456' });
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Should not be able to login without password', async () => {
      const { status, body } = await chai.request(app).post('/login').send({ email: 'email@email.com' });
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Should not be able to login with empty email field', async () => {
      const { status, body } = await chai.request(app).post('/login').send({ email: '', password: '123456' });
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Should not be able to login with empty password field', async () => {
      const { status, body } = await chai.request(app).post('/login').send({ email: 'email@email.com', password: '' });
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Should not be able to login with invalid email format', async () => {
      const { status, body } = await chai.request(app).post('/login').send({ email: 'invalid.user@user.com', password: "12345" })
      expect(status).to.be.equal(401);
      expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
    })

    it('Should not be able to login with password less than 6 characters', async () => {
      const { status, body } = await chai.request(app).post('/login').send({ email: 'user@user.com', password: '12345' })
      expect(status).to.be.equal(401);
      expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
    })

    it('Should not be able to login if email isn\'t found in datababase', async () => {
      sinon.stub(SequelizeUserModel, 'findOne').resolves(null);
      sinon.stub(LoginValidation, 'validate').callsFake((req, res, next) => {
        next();
      });
      const { status, body } = await chai.request(app).post('/login').send(validLoginBody);
      expect(status).to.be.equal(401);
      expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
    })

    it('Should return a token when login is successful', async () => {
      sinon.stub(SequelizeUserModel, 'findOne').resolves(UsersMock[0] as any);
      sinon.stub(JWT, 'sign').returns('validToken');
      sinon.stub(LoginValidation, 'validate').callsFake((req, res, next) => {
        next();
      });
      const { status, body } = await chai.request(app).post('/login').send(validLoginBody);
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal({ token: 'validToken' })
    })
  })
})
