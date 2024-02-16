import IMatch from '../interfaces/IMatch';
import MatchModel from '../models/MatchModel';
import IMatchModel from '../interfaces/IMatchModel';
import ITeamModel from '../interfaces/ITeamModel';
import TeamModel from '../models/TeamModel';
import ILeaderboardItem from '../interfaces/ILeaderboardItem';

export default class LeaderboardHomeService {
  public constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

  private async getTeams() {
    return this.teamModel.getAll();
  }

  private async getHomeMatches(id: number) {
    const matches = await this.matchModel.getAll(false);
    return matches.filter((match) => match.homeTeamId === id);
  }

  private static async getTotalPoints(homeMatches: IMatch[]) {
    return homeMatches.reduce((totalPoints, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return totalPoints + 1;
      return totalPoints;
    }, 0);
  }

  private static async getTotalGames(homeMatches: IMatch[]) {
    return homeMatches.length;
  }

  private static async getTotalVictories(homeMatches: IMatch[]) {
    return homeMatches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
  }

  private static async getTotalDraws(homeMatches: IMatch[]) {
    return homeMatches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
  }

  private static async getTotalLosses(homeMatches: IMatch[]) {
    return homeMatches.filter((match) => match.homeTeamGoals < match.awayTeamGoals).length;
  }

  private static async getGoalsFavor(homeMatches: IMatch[]) {
    return homeMatches.reduce((goalsFavor, match) => goalsFavor + match.homeTeamGoals, 0);
  }

  private static async getGoalsOwn(homeMatches: IMatch[]) {
    return homeMatches.reduce((goalsOwn, match) => goalsOwn + match.awayTeamGoals, 0);
  }

  private static async getGoalsBalance(homeMatches: IMatch[]) {
    const goalsFavor = await LeaderboardHomeService.getGoalsFavor(homeMatches);
    const goalsOwn = await LeaderboardHomeService.getGoalsOwn(homeMatches);
    return goalsFavor - goalsOwn;
  }

  private static async getEfficiency(homeMatches: IMatch[]) {
    const totalPoints = await LeaderboardHomeService.getTotalPoints(homeMatches);
    const totalGames = await LeaderboardHomeService.getTotalGames(homeMatches);
    const result = (totalPoints / (totalGames * 3)) * 100;
    return result.toFixed(2);
  }

  private async buildLeaderboard() {
    const teams = await this.getTeams();
    const promisesArr = teams.map(async (team) => {
      const homeMatches = await this.getHomeMatches(team.id);
      return {
        name: team.teamName,
        totalPoints: await LeaderboardHomeService.getTotalPoints(homeMatches),
        totalGames: await LeaderboardHomeService.getTotalGames(homeMatches),
        totalVictories: await LeaderboardHomeService.getTotalVictories(homeMatches),
        totalDraws: await LeaderboardHomeService.getTotalDraws(homeMatches),
        totalLosses: await LeaderboardHomeService.getTotalLosses(homeMatches),
        goalsFavor: await LeaderboardHomeService.getGoalsFavor(homeMatches),
        goalsOwn: await LeaderboardHomeService.getGoalsOwn(homeMatches),
        goalsBalance: await LeaderboardHomeService.getGoalsBalance(homeMatches),
        efficiency: await LeaderboardHomeService.getEfficiency(homeMatches),
      };
    });

    const leaderboard = await Promise.all(promisesArr);

    return leaderboard;
  }

  private static sortLeaderboard(leaderboard: ILeaderboardItem[]) {
    return [...leaderboard].sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
      if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
      if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
      if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
      return 0;
    });
  }

  public async getLeaderboard() {
    const leaderboard = await this.buildLeaderboard();
    const sortedLeaderboard = LeaderboardHomeService.sortLeaderboard(leaderboard);

    return { status: 'SUCCESSFUL', data: sortedLeaderboard };
  }
}
