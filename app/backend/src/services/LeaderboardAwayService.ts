import ILeaderboardItem from '../interfaces/ILeaderboardItem';
import IMatch from '../interfaces/IMatch';
import IMatchModel from '../interfaces/IMatchModel';
import ITeamModel from '../interfaces/ITeamModel';
import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';

export default class LeaderboardAwayService {
  public constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

  private async getTeams() {
    return this.teamModel.getAll();
  }

  private async getAwayMatches(id: number) {
    const matches = await this.matchModel.getAll(false);

    return matches.filter((match) => match.awayTeamId === id);
  }

  private static async getTotalPoints(awayMatches: IMatch[]) {
    return awayMatches.reduce((totalPoints, match) => {
      if (match.awayTeamGoals > match.homeTeamGoals) return totalPoints + 3;
      if (match.awayTeamGoals === match.homeTeamGoals) return totalPoints + 1;
      return totalPoints;
    }, 0);
  }

  private static async getTotalGames(awayMatches: IMatch[]) {
    return awayMatches.length;
  }

  private static async getTotalVictories(awayMatches: IMatch[]) {
    return awayMatches.filter((match) => match.awayTeamGoals > match.homeTeamGoals).length;
  }

  private static async getTotalDraws(awayMatches: IMatch[]) {
    return awayMatches.filter((match) => match.awayTeamGoals === match.homeTeamGoals).length;
  }

  private static async getTotalLosses(awayMatches: IMatch[]) {
    return awayMatches.filter((match) => match.awayTeamGoals < match.homeTeamGoals).length;
  }

  private static async getGoalsFavor(awayMatches: IMatch[]) {
    return awayMatches.reduce((goalsFavor, match) => goalsFavor + match.awayTeamGoals, 0);
  }

  private static async getGoalsOwn(awayMatches: IMatch[]) {
    return awayMatches.reduce((goalsOwn, match) => goalsOwn + match.homeTeamGoals, 0);
  }

  private static async getGoalsBalance(awayMatches: IMatch[]) {
    const goalsFavor = await LeaderboardAwayService.getGoalsFavor(awayMatches);
    const goalsOwn = await LeaderboardAwayService.getGoalsOwn(awayMatches);
    return goalsFavor - goalsOwn;
  }

  private static async getEfficiency(awayMatches: IMatch[]) {
    const totalPoints = await this.getTotalPoints(awayMatches);
    const totalGames = await this.getTotalGames(awayMatches);
    const result = ((totalPoints / (totalGames * 3)) * 100);
    return result.toFixed(2);
  }

  private async buildLeaderboard() {
    const teams = await this.getTeams();
    const promisesArr = teams.map(async (team) => {
      // console.log('leaderboardawayservice team:', team);
      const awayMatches = await this.getAwayMatches(team.id);
      return {
        name: team.teamName,
        totalPoints: await LeaderboardAwayService.getTotalPoints(awayMatches),
        totalGames: await LeaderboardAwayService.getTotalGames(awayMatches),
        totalVictories: await LeaderboardAwayService.getTotalVictories(awayMatches),
        totalDraws: await LeaderboardAwayService.getTotalDraws(awayMatches),
        totalLosses: await LeaderboardAwayService.getTotalLosses(awayMatches),
        goalsFavor: await LeaderboardAwayService.getGoalsFavor(awayMatches),
        goalsOwn: await LeaderboardAwayService.getGoalsOwn(awayMatches),
        goalsBalance: await LeaderboardAwayService.getGoalsBalance(awayMatches),
        efficiency: await LeaderboardAwayService.getEfficiency(awayMatches),
      };
    });

    const leaderboard = await Promise.all(promisesArr);
    // console.log('leaderboard away service leaderboard:', leaderboard)
    return leaderboard;
  }

  private static sortLeaderboard(leaderboard: ILeaderboardItem[]) {
    return [...leaderboard].sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
      if (a.totalVictories !== b.totalVictories) { return b.totalVictories - a.totalVictories; }
      if (a.goalsBalance !== b.goalsBalance) { return b.goalsBalance - a.goalsBalance; }
      if (a.goalsFavor !== b.goalsFavor) { return b.goalsFavor - a.goalsFavor; }
      return 0;
    });
  }

  public async getLeaderboard() {
    const leaderboard = await this.buildLeaderboard();
    const sortedLeaderboard = LeaderboardAwayService.sortLeaderboard(leaderboard);
    // console.log('leaderboardawayservice:', sortedLeaderboard);
    return { status: 'SUCCESSFUL', data: sortedLeaderboard };
  }
}
