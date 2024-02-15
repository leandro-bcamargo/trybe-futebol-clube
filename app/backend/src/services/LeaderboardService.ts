import IMatch from '../interfaces/IMatch';
import IMatchModel from '../interfaces/IMatchModel';
import ITeamModel from '../interfaces/ITeamModel';
import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';
import ILeaderboardItem from '../interfaces/ILeaderboardItem';

export default class LeaderboardService {
  public constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

  private async getTeams() {
    return this.teamModel.getAll();
  }

  private async getMatches(id: number) {
    const matches = await this.matchModel.getAll(false);

    return matches.filter((match) => match.homeTeamId === id || match.awayTeamId === id);
  }

  private static async getTotalPoints(matches: IMatch[], id: number) {
    return matches.reduce((totalPoints, match) => {
      if (match.homeTeamId === id) {
        if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
        if (match.homeTeamGoals === match.awayTeamGoals) return totalPoints + 1;
        return totalPoints;
      }
      if (match.awayTeamGoals > match.homeTeamGoals) return totalPoints + 3;
      if (match.awayTeamGoals === match.homeTeamGoals) return totalPoints + 1;
      return totalPoints;
    }, 0);
  }

  private static async getTotalGames(matches: IMatch[]) {
    return matches.length;
  }

  private static async getTotalVictories(matches: IMatch[], id: number) {
    return matches.reduce((victories, match) => {
      if (match.homeTeamId === id
        && match.homeTeamGoals > match.awayTeamGoals) {
        return victories + 1;
      }
      if (match.awayTeamId === id && match.awayTeamGoals > match.homeTeamGoals) {
        return victories + 1;
      }
      return victories;
    }, 0);
  }

  private static async getTotalDraws(matches: IMatch[]) {
    return matches.reduce((draws, match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        return draws + 1;
      }
      return draws;
    }, 0);
  }

  private static async getTotalLosses(matches: IMatch[], id: number) {
    return matches.reduce((losses, match) => {
      if (match.homeTeamId === id && match.homeTeamGoals < match.awayTeamGoals) {
        return losses + 1;
      }
      if (match.awayTeamId === id && match.awayTeamGoals < match.homeTeamGoals) {
        return losses + 1;
      }
      return losses;
    }, 0);
  }

  private static async getGoalsFavor(matches: IMatch[], id: number) {
    return matches.reduce((goalsFavor, match) => {
      if (match.homeTeamId === id) {
        return goalsFavor + match.homeTeamGoals;
      }
      return goalsFavor + match.awayTeamGoals;
    }, 0);
  }

  private static async getGoalsOwn(matches: IMatch[], id: number) {
    return matches.reduce((goalsOwn, match) => {
      if (match.homeTeamId === id) {
        return goalsOwn + match.awayTeamGoals;
      }
      return goalsOwn + match.homeTeamGoals;
    }, 0);
  }

  private static async getGoalsBalance(matches: IMatch[], id: number) {
    const goalsFavor = await LeaderboardService.getGoalsFavor(matches, id);
    const goalsOwn = await LeaderboardService.getGoalsOwn(matches, id);
    return goalsFavor - goalsOwn;
  }

  private static async getEfficiency(matches: IMatch[], id: number) {
    const totalPoints = await LeaderboardService.getTotalPoints(matches, id);
    const totalGames = await LeaderboardService.getTotalGames(matches);
    const result = (totalPoints / (totalGames * 3)) * 100;
    return result.toFixed(2);
  }

  private async buildLeaderboard() {
    const teams = await this.getTeams();
    const promisesArr = teams.map(async ({ id, teamName }) => {
      const matches = await this.getMatches(id);
      return {
        name: teamName,
        totalPoints: await LeaderboardService.getTotalPoints(matches, id),
        totalGames: await LeaderboardService.getTotalGames(matches),
        totalVictories: await LeaderboardService.getTotalVictories(matches, id),
        totalDraws: await LeaderboardService.getTotalDraws(matches),
        totalLosses: await LeaderboardService.getTotalLosses(matches, id),
        goalsFavor: await LeaderboardService.getGoalsFavor(matches, id),
        goalsOwn: await LeaderboardService.getGoalsOwn(matches, id),
        goalsBalance: await LeaderboardService.getGoalsBalance(matches, id),
        efficiency: await LeaderboardService.getEfficiency(matches, id),
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
    const sortedLeaderboard = LeaderboardService.sortLeaderboard(leaderboard);
    return { status: 'SUCCESSFUL', data: sortedLeaderboard };
  }
}
