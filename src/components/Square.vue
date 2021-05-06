<template>
  <div class="square"
    :class="playerClass"
    @click="onClick"
  />
</template>

<script>
export default {
  name: 'square',
  props: {
    moves: {
      type: Array,
      required: true,
    },
    row: {
      type: Number,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
  },
  computed: {
    move() {
      return this.moves.find((move) => move.play[0] === this.row && move.play[1] === this.column);
    },
    hasPlayer() {
      return this.move && this.move.player !== null;
    },
    playerClass() {
      return this.hasPlayer ? `player-${this.move.player}` : '';
    },
  },
  methods: {
    onClick() {
      if (!this.hasPlayer) this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
$border-width: 14px;

.square {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.player-0 {
  &::before {
    content: '';
    width: 80%;
    height: 80%;
    border: $border-width solid red;
    border-radius: 50%;
    display: block;
  }
}

.player-1 {
  &::before,
  &::after {
    content: '';
    width: calc(100% - #{$border-width});
    background-color: blue;
    border: $border-width/2 solid blue;
    display: block;
    position: absolute;
  }

  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(135deg);
  }
}
</style>
