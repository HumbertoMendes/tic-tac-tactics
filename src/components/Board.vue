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
          :current-player="currentPlayer"
          @success="() => onSuccess(row - 1, column - 1)"
        />
      </div>
    </div>
    <h1 v-show="hasEnded">
      {{ endMessage }}
    </h1>
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
      this.playersPlays = [];
      this.victory = false;
      this.status = StatusConstants.PLAYING;
    },
  },
  data() {
    return {
      boardSize: 3,
      currentPlayer: 0,
      playersPlays: [],
      grid: [],
      victory: false,
      status: StatusConstants.PLAYING,
    };
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
  },
  methods: {
    onSuccess(row, column) {
      this.playersPlays.push({
        player: this.currentPlayer,
        play: [row, column],
      });

      if (this.checkVictory(this.currentPlayer, row, column)) this.status = StatusConstants.VICTORY;
      else if (this.checkDraw()) this.status = StatusConstants.DRAW;
      else if (!this.hasEnded) this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    },
    checkDraw() {
      return this.playersPlays.length === this.boardSize ** 2;
    },
    checkVictory(player, row, column) {
      const playerPlays = this.playersPlays.filter((play) => play.player === player);

      if (playerPlays.length < this.boardSize) return false;
      if (this.checkHorizontal(playerPlays, row)) return true;
      if (this.checkVertical(playerPlays, column)) return true;
      if (this.checkDiagonal(playerPlays)) return true;
      return false;
    },
    checkHorizontal(playerPlays, row) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] === row), 0) === this.boardSize;
    },
    checkVertical(playerPlays, column) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[1] === column), 0) === this.boardSize;
    },
    checkDiagonal(playerPlays) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] === playerPlay.play[1]), 0) === this.boardSize
        || playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] + playerPlay.play[1] === this.boardSize - 1), 0) === this.boardSize;
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  min-width: 300px;
  max-width: 900px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
