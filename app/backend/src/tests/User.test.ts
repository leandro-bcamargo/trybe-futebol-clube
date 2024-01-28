import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';
import TeamsMock from './mocks/TeamsMock';
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
    it('Should not be able to login without email and password', async () => {
      const {status, body} = await chai.request(app).post('/login').send({});
      expect(status).to.be.equal(400);
      expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Should return a token when login is successful', async () => {
      sinon.stub(SequelizeUserModel, 'findOne').resolves(UsersMock[0] as any);
      sinon.stub(JWT, 'sign').returns('validToken');
      sinon.stub(LoginValidation, 'validate').returns();
      const {status, body} = await chai.request(app).post('/login').send(validLoginBody);
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal({token: 'validToken'})
    })
  })
})
