<template>
  <div id="app">
    <v-app>
      <v-main>
        <BoardView />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import BoardView from './views/BoardView.vue';

export default {
  name: 'App',
  components: {
    BoardView,
  },
};
</script>
