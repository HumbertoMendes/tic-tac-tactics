<template>
  <v-card
    class="elevation-0 d-flex flex-column align-center"
    :disabled="victory"
  >
    <div
      class="board"
      :key="restart"
    >
      <template
        v-for="row in 3"
      >
        <square v-for="column in 3"
          :current-player="currentPlayer"
          :key="`${row}-${column}`"
          @success="() => onSuccess(row - 1, column - 1)"
        />
      </template>
    </div>
    <h1 v-show="victory">
      Congratulations Player #{{ currentPlayer + 1}}!
    </h1>
  </v-card>
</template>

<script>
/* eslint-disable max-len */
import SquareModel from '../models/Square';
import Square from './Square.vue';

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
    },
  },
  data() {
    return {
      currentPlayer: 0,
      playersPlays: [],
      grid: [],
      victory: false,
    };
  },
  created() {
    const grid = [];

    for (let row = 0; row < 3; row++) {
      const items = [];
      for (let column = 0; column < 3; column++) {
        items.push(new SquareModel(row, column));
      }
      grid.push(items);
    }

    [].concat(...grid).forEach((square) => {
      const siblings = [];

      for (let i = -1; i <= 1; i++) {
        const row = grid[square.row + i];

        if (row) {
          for (let j = -1; j <= 1; j++) {
            if ((i || j) && row[square.column + j]) siblings.push(row[square.column + j]);
          }
        }
      }

      square.setSiblings(siblings);
    });

    this.grid = grid;
  },
  methods: {
    onSuccess(row, column) {
      this.playersPlays.push({
        player: this.currentPlayer,
        play: [row, column],
      });

      const isVictory = this.checkVictory(this.currentPlayer, row, column);

      if (isVictory) {
        this.victory = isVictory;
      } else {
        this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
      }
    },
    checkVictory(player, row, column) {
      const playerPlays = this.playersPlays.filter((play) => play.player === player);

      if (playerPlays.length < 3) return false;
      if (this.checkHorizontal(playerPlays, row)) return true;
      if (this.checkVertical(playerPlays, column)) return true;
      if (this.checkDiagonal(playerPlays)) return true;
      return false;
    },
    checkHorizontal(playerPlays, row) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] === row), 0) === 3;
    },
    checkVertical(playerPlays, column) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[1] === column), 0) === 3;
    },
    checkDiagonal(playerPlays) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] === playerPlay.play[1]), 0) === 3
        || playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] + playerPlay.play[1] === 2), 0) === 3;
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  width: 302px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
