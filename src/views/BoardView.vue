<template>
  <v-content>
    <div class="d-flex flex-column align-center mt-4">
      <h1>Tic-Tac-Tactics!</h1>
      <board
        :restart="restartCount"
      />
      <v-btn
        class="mt-4"
        @click="restartCount += 1"
      >
        Restart
      </v-btn>
    </div>
  </v-content>
</template>

<script>
import Board from '../components/Board.vue';

export default {
  name: 'board-view',
  components: {
    Board,
  },
  data() {
    return {
      restartCount: 0,
    };
  },
};
</script>

<style>

</style>
