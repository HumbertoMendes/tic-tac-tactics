<template>
  <div class="square"
    :class="playerClass"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'square',
  props: {
    playersPlays: {
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
    playerClass() {
      const foundPlayerPlay = this.playersPlays.find(
        (playerPlay) => playerPlay.play[0] === this.row && playerPlay.play[1] === this.column,
      );
      return foundPlayerPlay ? `player-${foundPlayerPlay.player}` : '';
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
