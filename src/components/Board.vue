<template>
  <div class="board">
    <square v-for="index in 9"
      :current-player="currentPlayer"
      :key="index"
      @success="(success) => onSuccess(success, index)"
    />
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  components: { Square },
  name: 'board',
  data() {
    return {
      currentPlayer: 1,
    };
  },
  methods: {
    onSuccess(success, index) {
      if (success) this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      console.log(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  width: 300px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
