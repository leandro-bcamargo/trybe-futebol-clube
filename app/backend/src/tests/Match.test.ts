import sinon from 'sinon';
import chai from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';

import { app } from '../app';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';
import TeamsMock from './mocks/TeamsMock';
import SequelizeMatchModel from '../database/models/SequelizeMatchModel';
import { allMatchesMock, finishedMatchesMock, inProgressMatchesMock, matchMockWithId } from './mocks/MatchesMock';
import JWT from '../utils/JWT';
import TokenPayloadMock from './mocks/TokenPayloadMock';
import {createMatchBodyMockInvalid, createMatchBodyMockValid} from './mocks/CreateMatchBodyMock';

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

  describe('Route POST /matches', async function() {
    it('Should return status 201 and create a match', async () => {
      const findOneStub = sinon.stub(SequelizeTeamModel, 'findOne');
      findOneStub.onCall(0).resolves(TeamsMock[0] as any);
      findOneStub.onCall(1).resolves(TeamsMock[1] as any);
      sinon.stub(SequelizeMatchModel, 'create').resolves(matchMockWithId as any);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const { status, body } = await chai.request(app).post('/matches').set('authorization', 'validToken').send(createMatchBodyMockValid);
      expect(status).to.be.equal(201);
      expect(body).to.deep.equal(matchMockWithId);
    })

    it('Should return status 404 if at least one of the teams isn\'t found', async function() {
      const findOneStub = sinon.stub(SequelizeTeamModel, 'findOne');
      findOneStub.onCall(0).resolves(null);
      findOneStub.onCall(1).resolves(TeamsMock[1] as any);
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const {status, body} = await chai.request(app).post('/matches').set('authorization', 'validToken').send(createMatchBodyMockValid);
      expect(status).to.be.equal(404);
      expect(body).to.deep.equal({message: 'There is no team with such id!'})
    })

    it('Should return status 422 if the home team and the away team are the same', async function() {
      sinon.stub(JWT, 'verify').returns(TokenPayloadMock);
      const {status, body} = await chai.request(app).post('/matches').set('authorization', 'validToken').send(createMatchBodyMockInvalid);
      expect(status).to.be.equal(422);
      expect(body).to.deep.equal({message: 'It is not possible to create a match with two equal teams'})
    })
  })
})
