import sinon from 'sinon';
import chai from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';
import TeamsMock from './mocks/TeamsMock';
import SequelizeMatchModel from '../database/models/SequelizeMatchModel';
import { allMatchesMock, finishedMatchesMock, inProgressMatchesMock } from './mocks/MatchesMock';
import LoginValidation from '../middlewares/LoginValidation';
import JWT from '../utils/JWT';
import TokenValidation from '../middlewares/TokenValidation';
import TokenPayloadMock from './mocks/TokenPayloadMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches test', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('Route GET /matches', () => {
    it('Should return all matches if no query params are provided', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(allMatchesMock as any);
      const { status, body } = await chai.request(app).get('/matches');
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(allMatchesMock);
    })

    it('Should return matches in progress with query params inProgress=true', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(inProgressMatchesMock as any);
      const { status, body } = await chai.request(app).get('/matches?inProgress=true');
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal(inProgressMatchesMock)
    })

    it('Should return matches finished with query params inProgress=false', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(finishedMatchesMock as any);
      const { status, body } = await chai.request(app).get('/matches?inProgress=false');
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal(finishedMatchesMock)
    })
  })

  describe('Route PATCH /matches/:id/finish', async function() {
    it('Should return status 200 and finish a match', async () => {
      sinon.stub(SequelizeMatchModel, 'findOne').resolves(allMatchesMock[0] as any);
      sinon.stub(SequelizeMatchModel, 'update').resolves([1]);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const { status, body } = await chai.request(app).patch('/matches/1/finish').set('authorization', 'validToken');
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal({ message: 'Finished' });
    })

    it('Should return status 404 and Match not found', async function() {
      sinon.stub(SequelizeMatchModel, 'findOne').resolves(null);
      // sinon.stub(SequelizeMatchModel, 'update').resolves([0]);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const {status, body} = await chai.request(app).patch('/matches/99/finish').set('authorization', 'validToken');
      expect(status).to.be.equal(404);
      expect(body).to.deep.equal({message: 'Match not found'})
    })

    it('Should return status 409 and The match is already finished', async function() {
      sinon.stub(SequelizeMatchModel, 'findOne').resolves(allMatchesMock[0] as any);
      sinon.stub(SequelizeMatchModel, 'update').resolves([0]);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const {status, body} = await chai.request(app).patch('/matches/1/finish').set('authorization', 'validToken');
      expect(status).to.be.equal(409);
      expect(body).to.deep.equal({message: 'The match is already finished'})
    })
  })

  describe('Route PATCH /matches/:id', async function() {
    it('Should return status 200 and update a match', async () => {
      sinon.stub(SequelizeMatchModel, 'findOne').resolves(allMatchesMock[0] as any);
      sinon.stub(SequelizeMatchModel, 'update').resolves([1]);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const { status, body } = await chai.request(app).patch('/matches/1').set('authorization', 'validToken').send({
        homeTeamGoals: 1,
        awayTeamGoals: 1
      });
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal({ message: 'Match successfully updated!' });
    })

    it('Should return status 404 and Match not found', async function() {
      sinon.stub(SequelizeMatchModel, 'findOne').resolves(null);
      sinon.stub(SequelizeMatchModel, 'update').resolves([0]);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const {status, body} = await chai.request(app).patch('/matches/99').set('authorization', 'validToken').send({
        homeTeamGoals: 1,
        awayTeamGoals: 1
      });
      expect(status).to.be.equal(404);
      expect(body).to.deep.equal({message: 'Match not found'})
    })
  })
})
