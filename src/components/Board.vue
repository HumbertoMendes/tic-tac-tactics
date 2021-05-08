<template>
  <v-card
    class="elevation-0 d-flex flex-column align-center"
  >
    <h1>
      {{ message }}
    </h1>
    <v-card
      class="board d-flex flex-wrap elevation-0"
      :disabled="hasEnded || disabled"
      :class="isPlaying ? 'white' : 'grey lighten-4'"
    >
      <div
        v-for="row in boardSize"
        :key="`${row}`"
      >
        <square v-for="column in boardSize"
          :key="`${column}`"
          :row="row - 1"
          :column="column - 1"
          :moves="moves"
          @click="() => selectSquare(row - 1, column - 1)"
        />
      </div>
    </v-card>
    <div class="d-flex align-center mt-4">
      <div class="d-flex">
        <v-select
          v-model="player1"
          :items="playerList"
          hide-details
          outlined
          dense
          label="Player 1"
          :disabled="isPlaying"
        />
        <v-select
          v-model="player2"
          :items="playerList"
          hide-details
          class="ml-4"
          outlined
          dense
          label="Player 2"
          :disabled="isPlaying"
        />
      </div>
      <v-btn
        color="primary"
        class="ml-4"
        @click="start()"
      >
        {{ isPlaying ? 'Restart' : 'Start' }}
      </v-btn>
    </div>
  </v-card>
</template>

<script>
/* eslint-disable max-len */
import Square from './Square.vue';
import { Status, Player } from '../../constants/gameConstants';

export default {
  components: { Square },
  name: 'board',
  data() {
    return {
      round: 0,
      boardSize: 3,
      moves: [],
      grid: [],
      status: Status.IDLE,
      disabled: false,
      player1: null,
      player2: null,
      currentPlayer: null,
      playerList: [],
      players: [],
    };
  },
  created() {
    this.moves = this.createMoves();
    this.playerList = Object.entries(Player).map(([key, value]) => ({ text: key, value }));
    this.player1 = Player.HUMAN;
    this.player2 = Player.CPU;
  },
  computed: {
    isPlaying() {
      return this.status === Status.PLAYING;
    },
    hasEnded() {
      return this.status !== Status.PLAYING;
    },
    message() {
      if (this.status === Status.DRAW) return 'Draw :(';
      if (this.status === Status.VICTORY) return `Congratulations Player ${this.currentPlayer + 1}!`;
      if (this.status === Status.PLAYING) return `Current: Player ${this.currentPlayer + 1}`;
      return 'Press START!';
    },
    availableMoves() {
      return this.getPlayerMoves(null);
    },
    availablePlays() {
      return this.availableMoves.map((moves) => moves.play);
    },
    nextPlayer() {
      return this.currentPlayer === 0 ? 1 : 0;
    },
    corners() {
      return this.getPlayerCorners();
    },
    center() {
      return parseInt(this.boardSize / 2);
    },
    isCurrentPlayerCpu() {
      return this.players[this.currentPlayer] !== Player.HUMAN;
    },
  },
  methods: {
    start() {
      console.clear();
      console.log('================NEW GAME================');
      this.players = [this.player1, this.player2];
      if (this.timeoutId) clearTimeout(this.timeoutId);

      this.round = 0;
      this.currentPlayer = Math.round(Math.random());
      this.clearMoves();
      this.status = Status.PLAYING;

      if (this.isCurrentPlayerCpu) this.playCpu();
    },
    getPlayerMoves(player) {
      return this.moves.filter((move) => move.player === player);
    },
    getPlayerPlays(player) {
      return this.getPlayerMoves(player).map((moves) => moves.play);
    },
    getPlayerCorners(player) {
      return this.moves.filter((move) => ((move.play[0] + move.play[1] === this.boardSize - 1)
          || (move.play[0] === move.play[1]))
          && (move.play[0] !== this.center && move.play[1] !== this.center)
          && (player === undefined ? true : move.player === player));
    },
    getPlayerCrosses(player) {
      return this.moves.filter((move) => ((move.play[0] + move.play[1]) % 2 === 1)
        && (player === undefined ? true : move.player === player));
    },
    selectSquare(row, column) {
      const move = this.findMove(row, column);
      move.player = this.currentPlayer;

      const plays = this.getPlayerPlays(this.currentPlayer);
      if (this.checkVictory(plays, row, column)) this.status = Status.VICTORY;
      else if (this.checkDraw()) this.status = Status.DRAW;
      else if (!this.hasEnded) {
        this.round += 1;
        this.currentPlayer = this.nextPlayer;
        if (this.isCurrentPlayerCpu) this.playCpu();
      }
    },
    checkDraw() {
      return this.availableMoves.length === 0;
    },
    checkVictory(plays, row, column) {
      if (plays.length < this.boardSize) return false;
      if (this.checkHorizontalVictory(plays, row)) return true;
      if (this.checkVerticalVictory(plays, column)) return true;
      if (this.checkDiagonalVictory(plays)) return true;
      return false;
    },
    checkHorizontalVictory(plays, row) {
      return plays.reduce((count, play) => count + (play[0] === row), 0) === this.boardSize;
    },
    checkVerticalVictory(plays, column) {
      return plays.reduce((count, play) => count + (play[1] === column), 0) === this.boardSize;
    },
    checkDiagonalVictory(plays) {
      return plays.reduce((count, play) => count + (play[0] === play[1]), 0) === this.boardSize
        || plays.reduce((count, play) => count + (play[0] + play[1] === this.boardSize - 1), 0) === this.boardSize;
    },
    createMoves() {
      const availableMoves = [];

      for (let row = 0; row < this.boardSize; row++) {
        for (let column = 0; column < this.boardSize; column++) {
          availableMoves.push({ player: null, play: [row, column] });
        }
      }

      return availableMoves;
    },
    clearMoves() {
      this.moves.forEach((move) => {
        // eslint-disable-next-line no-param-reassign
        move.player = null;
      });
    },
    findMove(row, column) {
      return this.moves.find((move) => move.play[0] === row && move.play[1] === column);
    },
    findPlayerMoves(player) {
      return this.moves.find((move) => move.player === player);
    },
    getRandomIndex(max) {
      return Math.floor(Math.random(max) * max);
    },
    playCpu() {
      if (this.hasEnded) return;

      this.disabled = true;

      const play = this.getCpuPlay();

      this.timeoutId = setTimeout(() => {
        this.selectSquare(play[0], play[1]);
        this.disabled = false;
      }, 500);
    },
    getCpuPlay() {
      console.log(`Round #${this.round}`);
      console.log(`Current Player: #${this.currentPlayer}`);

      const moves = [
        this.selectMoveWin,
        this.selectMoveBlockOpponent,
        this.selectMoveCenter,
        this.selectMoveCross,
        this.selectMoveCorner,
        this.selectMoveRandom,
      ];

      for (let i = 0; i < moves.length; i++) {
        const play = moves[i]();

        if (play) return play;
      }

      return null;
    },
    selectMoveWin() {
      // First, try to win
      const me = this.currentPlayer;
      const { availablePlays } = this;
      let play = null;

      for (let i = 0; i < availablePlays.length; i++) {
        const currentPlay = availablePlays[i];
        const [row, column] = currentPlay;
        const mockPlays = [...this.getPlayerPlays(me), [row, column]];

        if (this.checkVictory(mockPlays, row, column)) {
          play = currentPlay;
          break;
        }
      }

      if (play) console.log('Trying to win', play, JSON.stringify(availablePlays));
      return play;
    },
    selectMoveBlockOpponent() {
      // Next, prevent your opponent's victory
      const { availablePlays } = this;
      const opponent = this.nextPlayer;
      let play = null;

      for (let i = 0; i < availablePlays.length; i++) {
        const currentPlay = availablePlays[i];
        const [row, column] = currentPlay;
        const mockPlays = [...this.getPlayerPlays(opponent), [row, column]];

        if (this.checkVictory(mockPlays, row, column)) {
          play = currentPlay;
          break;
        }
      }

      if (play) console.log('Blocking my opponent', play, JSON.stringify(availablePlays));
      return play;
    },
    selectMoveCenter() {
      // Now check if it is the first round and the opponent has a corner
      const me = this.currentPlayer;
      const opponent = this.nextPlayer;
      const myPlays = this.getPlayerPlays(me);
      const opponentPlays = this.getPlayerPlays(opponent);
      const opponentCorners = this.getPlayerCorners(opponent);
      const opponentCrosses = this.getPlayerCrosses(opponent);
      const { availablePlays } = this;
      let play = null;

      if ((
        (myPlays.length + opponentPlays.length === 1 && opponentCorners.length === 1)
        || (opponentCrosses.length === 2))
        && availablePlays.find((p) => p[0] === this.center && p[1] === this.center)) {
        play = [this.center, this.center];
      }

      if (play) console.log('Blocking the center', play, JSON.stringify(availablePlays));
      return play;
    },
    selectMoveCross() {
      const { availablePlays } = this;
      const me = this.currentPlayer;
      const opponent = this.nextPlayer;
      const myPlays = this.getPlayerPlays(me);
      const opponentCorners = this.getPlayerCorners(opponent);
      let play = null;

      // Check if the opponent has two or more corners and I've selected the center
      if (opponentCorners.length > 1 && myPlays.find((myPlay) => myPlay[0] === 1 && myPlay[1] === 1)) {
        const crossMoves = this.getPlayerCrosses();
        const index = this.getRandomIndex(crossMoves.length);

        play = crossMoves[index].play;
      }

      if (play) console.log('Any random diagonally opposite', play, JSON.stringify(availablePlays));
      return play;
    },
    selectMoveCorner() {
      const { availablePlays } = this;
      const me = this.currentPlayer;
      let play = null;

      // Now check if there are corners available and the opponent has not selected the center
      const availableCorners = this.getPlayerCorners(null);
      if (availableCorners.length > 0) {
        const myCorners = this.getPlayerCorners(me);

        for (let i = 0; i < myCorners.length; i++) {
          const corner = myCorners[i];
          const rowMod = corner.play[0] === 0 ? 1 : -1;
          const columnMod = corner.play[1] === 0 ? 1 : -1;

          if (availablePlays.reduce(
            (count, availablePlay) => {
              const row = availablePlay[0] === (corner.play[0] + (1 * rowMod * count));
              const column = availablePlay[1] === (corner.play[1] + (1 * columnMod * count));

              return count + (row && column);
            }, 1,
          ) === this.boardSize) {
            play = [corner.play[0] + (2 * rowMod), corner.play[1] + (2 * columnMod)];
            console.log('Checking for available opposite corners', play, JSON.stringify(availablePlays));

            return play;
          }
        }

        const cornerIndex = this.getRandomIndex(availableCorners.length);
        play = availableCorners[cornerIndex].play;
        console.log('Any random corners', play, JSON.stringify(availablePlays));

        return play;
      }

      return null;
    },
    selectMoveRandom() {
      const { availablePlays } = this;
      const index = this.getRandomIndex(availablePlays.length);
      const play = availablePlays[index];
      console.log('Any random play', play, JSON.stringify(availablePlays));

      return play;
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  border: 1px solid black;
}
</style>
