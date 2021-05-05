<template>
  <v-card
    class="elevation-0 d-flex flex-column align-center"
    :disabled="hasEnded || disabled"
  >
    <div
      class="board"
      :key="restart"
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
    </div>
    <h1 v-show="hasEnded">
      {{ endMessage }}
    </h1>
    <v-btn
      :disabled="hasEnded"
      class="mt-4"
      color="secondary"
      @click="playCpu"
    >
      Dance my Puppets
    </v-btn>
  </v-card>
</template>

<script>
/* eslint-disable max-len */
import Square from './Square.vue';
import { Status, Player } from '../../constants/gameConstants';

export default {
  components: { Square },
  name: 'board',
  props: {
    restart: {
      type: Number,
      required: true,
    },
  },
  watch: {
    restart() {
      this.currentPlayer = 0;
      this.clearMoves();
      this.status = Status.PLAYING;

      if (this.timeoutId !== null) {
        clearInterval(this.timeoutId);
        this.timeoutId = null;
      }
    },
  },
  data() {
    return {
      timeoutId: null,
      boardSize: 3,
      currentPlayer: 0,
      moves: [],
      grid: [],
      status: Status.PLAYING,
      disabled: false,
    };
  },
  created() {
    this.players = [Player.HUMAN, Player.CPU];
    this.moves = this.createMoves();
  },
  computed: {
    hasEnded() {
      return this.status !== Status.PLAYING;
    },
    endMessage() {
      return this.status === Status.VICTORY
        ? `Congratulations Player #${this.currentPlayer + 1}!`
        : 'Draw :(';
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
      return this.moves.filter((move) => ((move.play[0] + move.play[1] === this.boardSize - 1)
          || (move.play[0] === move.play[1]))
          && (move.play[0] !== this.center && move.play[1] !== this.center));
    },
    center() {
      return parseInt(this.boardSize / 2);
    },
  },
  methods: {
    getPlayerMoves(player) {
      return this.moves.filter((move) => move.player === player);
    },
    getPlayerPlays(player) {
      return this.getPlayerMoves(player).map((moves) => moves.play);
    },
    selectSquare(row, column) {
      const move = this.findMove(row, column);
      move.player = this.currentPlayer;

      const plays = this.getPlayerPlays(this.currentPlayer);
      if (this.checkVictory(plays, row, column)) this.status = Status.VICTORY;
      else if (this.checkDraw()) this.status = Status.DRAW;
      else if (!this.hasEnded) {
        this.currentPlayer = this.nextPlayer;
        if (this.players[this.currentPlayer] === Player.CPU) this.playCpu();
      }
    },
    checkDraw() {
      return this.availableMoves.length === 0;
    },
    checkVictory(plays, row, column) {
      if (plays.length < this.boardSize) return false;
      if (this.checkHorizontal(plays, row)) return true;
      if (this.checkVertical(plays, column)) return true;
      if (this.checkDiagonal(plays)) return true;
      return false;
    },
    checkHorizontal(plays, row) {
      return plays.reduce((count, play) => count + (play[0] === row), 0) === this.boardSize;
    },
    checkVertical(plays, column) {
      return plays.reduce((count, play) => count + (play[1] === column), 0) === this.boardSize;
    },
    checkDiagonal(plays) {
      return plays.reduce((count, play) => count + (play[0] === play[1]), 0) === this.boardSize
        || plays.reduce((count, play) => count + (play[0] + play[1] === this.boardSize - 1), 0) === this.boardSize;
    },
    chooseRandom() {
      return Math.floor(Math.random(this.boardSize) * this.boardSize);
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
    playCpu() {
      if (this.hasEnded) return;

      this.disabled = true;

      const play = this.getCpuPlay();
      this.selectSquare(play[0], play[1]);

      this.disabled = false;
    },
    getCpuPlay() {
      const plays = this.availablePlays;
      const opponent = this.nextPlayer;

      let play = null;
      // First, try to win
      for (let i = 0; i < plays.length; i++) {
        const currentPlay = plays[i];
        const [row, column] = currentPlay;
        const mockPlays = [...this.getPlayerPlays(this.currentPlayer), [row, column]];

        if (this.checkVictory(mockPlays, row, column)) {
          play = currentPlay;
          break;
        }
      }

      if (play) return play;

      // Next, prevent your opponent's victory
      for (let i = 0; i < plays.length; i++) {
        const currentPlay = plays[i];
        const [row, column] = currentPlay;
        const mockPlays = [...this.getPlayerPlays(opponent), [row, column]];

        if (this.checkVictory(mockPlays, row, column)) {
          play = currentPlay;
          break;
        }
      }

      if (play) return play;

      // Now check if the opponent has a corner
      const corners = this.corners.filter((move) => move.player === opponent);
      if (corners.length > 0 && plays.find((p) => p[0] === this.center && p[1] === this.center)) return [this.center, this.center];

      const index = Math.floor(Math.random(plays.length) * plays.length);
      return plays[index];
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  // min-width: 300px;
  // max-width: 900px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
