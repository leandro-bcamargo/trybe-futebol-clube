import sinon from 'sinon';
import chai from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';

import { app } from '../app';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';

import SequelizeMatchModel from '../database/models/SequelizeMatchModel';
import { allMatchesMock, finishedMatchesMock, inProgressMatchesMock, matchMockWithId } from './mocks/MatchesMock';
import LoginValidation from '../middlewares/LoginValidation';
import JWT from '../utils/JWT';
import TokenValidation from '../middlewares/TokenValidation';
import TokenPayloadMock from './mocks/TokenPayloadMock';
import {createMatchBodyMockInvalid, createMatchBodyMockValid} from './mocks/CreateMatchBodyMock';
import LeaderboardHomeMock from './mocks/LeaderboardHomeMock';
import TeamsMock from './mocks/TeamsMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard test', () => {
  afterEach(() => {
    sinon.restore();
  })

  describe('Route GET /leaderboard/home', () => {
    it('Should return status 200 and the leaderboard', async function() {
    // sinon.stub(SequelizeTeamModel, 'findAll').resolves(TeamsMock as any);
    sinon.stub(SequelizeMatchModel, 'findAll').resolves(finishedMatchesMock as any);
    // TeamsMock.map((team, i) => {
    //   sinon.stub(SequelizeTeamModel, 'findOne').onCall(i).resolves(team.teamName as any)
    // })
    const {status, body} = await chai.request(app).get('/leaderboard/home');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(LeaderboardHomeMock);
    })
  })
})
