<template>
  <div id="app">
    <BoardView />
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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
