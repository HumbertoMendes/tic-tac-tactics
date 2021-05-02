<template>
  <div class="board"
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
    },
  },
  data() {
    return {
      currentPlayer: 0,
      playersPlays: [],
      // validations: [
      //   (plays) => plays.length > 2,
      //   (plays) => plays,
      // ],
      grid: [],
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
      // const square = this.grid[row][column];
      // square.setTenant(this.currentPlayer);
      // this.plays[this.currentPlayer].push(play);
      this.playersPlays.push({
        player: this.currentPlayer,
        play: [row, column],
      });
      const isVictory = this.checkVictory(this.currentPlayer, row, column);
      console.log('Victory?', isVictory);

      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    },
    checkVictory(player, row, column) {
      const playerPlays = this.playersPlays.filter((play) => play.player === player);

      if (playerPlays.length < 3) return false;
      if (this.checkRow(playerPlays, row)) return true;
      if (this.checkColumn(playerPlays, row, column)) return true;
      return false;
    },
    checkRow(playerPlays, row) {
      return playerPlays.reduce((count, playerPlay) => count + (playerPlay.play[0] === row), 0);
    },
    checkColumn(playerPlays, row, column) {
      switch (column) {
        // case 0: return playerPlays.play[row][column] && playerPlays.play[row][column + 1] && playerPlays.play[row][column + 2];
        // case 1: return playerPlays.play[row][column - 1] && playerPlays.play[row][column] && playerPlays.play[row][column + 1];
        // case 2: return playerPlays.play[row][column - 2] && playerPlays.play[row][column - 1] && playerPlays.play[row][column];
        default: return false;
      }
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
