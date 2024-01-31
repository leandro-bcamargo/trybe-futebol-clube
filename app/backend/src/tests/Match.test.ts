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
import MatchesMock from './mocks/MatchesMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches test', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('Route GET /matches', () => {
    it('Should return all matches', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(MatchesMock as any);
      const {status, body} = await chai.request(app).get('/matches');
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(MatchesMock);
    })
  })
})
