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

  describe('Route GET /teams/:id', () => {
    it('Should return a team by id', async function() {
      sinon.stub(SequelizeTeamModel, 'findOne').resolves(TeamsMock[0] as any);
      const {status, body} = await chai.request(app).get('/teams/1');
      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(TeamsMock[0]);
    })

    it('Should return status 404 and message if team is not found', async function() {
      sinon.stub(SequelizeTeamModel, 'findOne').resolves(null);
      const {status, body} = await chai.request(app).get('/teams/99');
      expect(status).to.be.equal(404);
      expect(body).to.be.deep.equal({message: "A team with id 99 hasn't been found"});
    })
});
})
