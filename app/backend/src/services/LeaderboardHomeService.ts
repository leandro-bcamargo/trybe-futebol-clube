import MatchModel from '../models/MatchModel';
import IMatchModel from '../interfaces/IMatchModel';
import ITeamModel from '../interfaces/ITeamModel';
import TeamModel from '../models/TeamModel';

export default class LeaderboardHomeService {
  public constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

  private async getTeams() {
    return this.teamModel.getAll();
  }

  private async getName(id: number) {
    const team = await this.teamModel.getById(id);
    if (team) return team.teamName;
  }

  private async getHomeMatches(id: number) {
    const matches = await this.matchModel.getAll();
    const homeMatches = matches.filter((match) => match.homeTeamId === id);

    return homeMatches;
  }

  private async getTotalPoints(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.reduce((totalPoints, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return totalPoints + 1;
      return totalPoints;
    }, 0);
  }

  private async getTotalGames(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.length;
  }

  private async getTotalVictories(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
  }

  private async getTotalDraws(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
  }

  private async getTotalLosses(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.filter((match) => match.homeTeamGoals < match.awayTeamGoals).length;
  }

  private async getGoalsFavor(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.reduce((goalsFavor, match) => goalsFavor + match.homeTeamGoals, 0);
  }

  private async getGoalsOwn(id: number) {
    const homeMatches = await this.getHomeMatches(id);
    return homeMatches.reduce((goalsOwn, match) => goalsOwn + match.awayTeamGoals, 0);
  }

  private async buildLeaderboard() {
    const teams = await this.getTeams();
    const promisesArr = teams.map(async (team) => ({
      name: await this.getName(team.id),
      totalPoints: await this.getTotalPoints(team.id),
      totalGames: await this.getTotalGames(team.id),
      totalVictories: await this.getTotalVictories(team.id),
      totalDraws: await this.getTotalDraws(team.id),
      totalLosses: await this.getTotalLosses(team.id),
      goalsFavor: await this.getGoalsFavor(team.id),
      goalsOwn: await this.getGoalsOwn(team.id),
    }));
    const leaderboard = await Promise.all(promisesArr);
    return leaderboard;
  }

  public async getLeaderboard() {
    const leaderboard = await this.buildLeaderboard();
    return { status: 'SUCCESSFUL', data: leaderboard };
  }
}
