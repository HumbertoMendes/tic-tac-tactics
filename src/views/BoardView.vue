<template>
  <v-main>
    <div class="d-flex flex-column align-center ma-4">
      <h1>Tic-Tactic-Toe!</h1>
      <board
        :restart="restartCount"
      />
      <v-btn
        class="mt-4"
        color="primary"
        @click="restartCount += 1"
      >
        Restart
      </v-btn>
    </div>
  </v-main>
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
