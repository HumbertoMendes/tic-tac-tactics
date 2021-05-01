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
        @success="() => onSuccess(row, column)"
      />
    </template>
  </div>
</template>

<script>
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
      currentPlayer: 1,
      plays: [[], []],
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
      const play = [row, column];
      this.plays[this.currentPlayer].push(play);

      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    },
    // checkVictory(play) {
    //   play.forEach((play) => {
    //   });
    // },
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
