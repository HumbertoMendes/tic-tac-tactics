<template>
  <v-card
    class="elevation-0 d-flex flex-column align-center"
    :disabled="hasEnded"
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
      @click="playCPU"
    >
      Dance my Puppets
    </v-btn>
  </v-card>
</template>

<script>
/* eslint-disable max-len */
import Square from './Square.vue';
import { Status as StatusConstants } from '../../constants/gameConstants';

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
      this.status = StatusConstants.PLAYING;

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
      status: StatusConstants.PLAYING,
    };
  },
  created() {
    this.moves = this.createMoves();
  },
  computed: {
    hasEnded() {
      return this.status !== StatusConstants.PLAYING;
    },
    endMessage() {
      return this.status === StatusConstants.VICTORY
        ? `Congratulations Player #${this.currentPlayer + 1}!`
        : 'Draw :(';
    },
    availablePlays() {
      return this.moves.filter((move) => move.player === null);
    },
  },
  methods: {
    selectSquare(row, column) {
      const move = this.findMove(row, column);
      move.player = this.currentPlayer;

      if (this.checkVictory(this.currentPlayer, row, column)) this.status = StatusConstants.VICTORY;
      else if (this.checkDraw()) this.status = StatusConstants.DRAW;
      else if (!this.hasEnded) this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    },
    checkDraw() {
      return this.availablePlays.length === 0;
    },
    checkVictory(player, row, column) {
      const moves = this.moves.filter((play) => play.player === player);

      if (moves.length < this.boardSize) return false;
      if (this.checkHorizontal(moves, row)) return true;
      if (this.checkVertical(moves, column)) return true;
      if (this.checkDiagonal(moves)) return true;
      return false;
    },
    checkHorizontal(moves, row) {
      return moves.reduce((count, move) => count + (move.play[0] === row), 0) === this.boardSize;
    },
    checkVertical(moves, column) {
      return moves.reduce((count, move) => count + (move.play[1] === column), 0) === this.boardSize;
    },
    checkDiagonal(moves) {
      return moves.reduce((count, move) => count + (move.play[0] === move.play[1]), 0) === this.boardSize
        || moves.reduce((count, move) => count + (move.play[0] + move.play[1] === this.boardSize - 1), 0) === this.boardSize;
    },
    chooseRandom() {
      return Math.floor(Math.random(this.boardSize) * this.boardSize);
    },
    createMoves() {
      const availablePlays = [];

      for (let row = 0; row < this.boardSize; row++) {
        for (let column = 0; column < this.boardSize; column++) {
          availablePlays.push({ player: null, play: [row, column] });
        }
      }

      return availablePlays;
    },
    clearMoves() {
      this.moves.forEach((move) => {
        // eslint-disable-next-line no-param-reassign
        move.player = null;
      });
    },
    playCPU() {
      if (this.hasEnded) return;

      const plays = this.availablePlays.map((moves) => moves.play);

      const index = Math.floor(Math.random(plays.length) * plays.length);
      const play = plays[index];
      this.selectSquare(play[0], play[1]);

      this.timeoutId = setTimeout(() => {
        this.playCPU();
      }, 100);
    },
    findMove(row, column) {
      return this.moves.find((move) => move.play[0] === row && move.play[1] === column);
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
