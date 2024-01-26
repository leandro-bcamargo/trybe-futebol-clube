import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';
import TeamsMock from './mocks/TeamsMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Team test', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('Route GET /teams', () => {
    it('Should return all teams', async function() {
      sinon.stub(SequelizeTeamModel, 'findAll').resolves(TeamsMock as any);
      const {status, body} = await chai.request(app).get('/teams');
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(TeamsMock);
    })
  })
});
