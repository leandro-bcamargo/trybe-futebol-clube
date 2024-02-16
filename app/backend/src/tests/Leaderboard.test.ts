import sinon from 'sinon';
import chai from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import { app } from '../app';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';

import SequelizeMatchModel from '../database/models/SequelizeMatchModel';
import {  finishedMatchesMock } from './mocks/MatchesMock';
import LeaderboardHomeMock from './mocks/LeaderboardHomeMock';
import TeamsMock from './mocks/TeamsMock';
import LeaderboardAwayMock from './mocks/LeaderboardAwayMock';
import LeaderboardMock from './mocks/LeaderboardMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard test', async function() {
  beforeEach(() => {
    sinon.restore();
  })
  
  describe('Route GET /leaderboard', async function() {
    it('Should return status 200 and the leaderboard', async function() {
      sinon.stub(SequelizeTeamModel, 'findAll').resolves(TeamsMock as any);
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(finishedMatchesMock as any);
      const {status, body} = await chai.request(app).get('/leaderboard');
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal(LeaderboardMock);
    })
  })


  describe('Route GET /leaderboard/home', async function() {
    it('Should return status 200 and the home leaderboard', async function() {
    sinon.stub(SequelizeTeamModel, 'findAll').resolves(TeamsMock as any);
    sinon.stub(SequelizeMatchModel, 'findAll').resolves(finishedMatchesMock as any);
    const {status, body} = await chai.request(app).get('/leaderboard/home');
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(LeaderboardHomeMock);
    })
  })

  describe('Route GET /leaderboard/away', async function() {
    it('Should return status 200 and the away leaderboard', async function() {
      sinon.stub(SequelizeTeamModel, 'findAll').resolves(TeamsMock as any);
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(finishedMatchesMock as any);
      const {status, body} = await chai.request(app).get('/leaderboard/away');
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(LeaderboardAwayMock);
    })
  })
})
