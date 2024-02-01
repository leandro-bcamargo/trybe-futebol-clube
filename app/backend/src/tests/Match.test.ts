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
import {allMatchesMock, finishedMatchesMock, inProgressMatchesMock} from './mocks/MatchesMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches test', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('Route GET /matches', () => {
    it('Should return all matches if no query params are provided', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(allMatchesMock as any);
      const {status, body} = await chai.request(app).get('/matches');
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(allMatchesMock);
    })

    it('Should return matches in progress with query params inProgress=true', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(inProgressMatchesMock as any);
      const {status, body} = await chai.request(app).get('/matches?inProgress=true');
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal(inProgressMatchesMock)
    })

    it('Should return matches finished with query params inProgress=false', async () => {
      sinon.stub(SequelizeMatchModel, 'findAll').resolves(finishedMatchesMock as any);
      const {status, body} = await chai.request(app).get('/matches?inProgress=false');
      expect(status).to.be.equal(200);
      expect(body).to.deep.equal(finishedMatchesMock)
    })
  })
})
