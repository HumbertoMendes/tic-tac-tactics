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
    currentPlayer: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      player: null,
    };
  },
  methods: {
    onClick() {
      const success = !this.player;
      if (success) this.player = this.currentPlayer;
      this.$emit('success', success);
    },
  },
  computed: {
    playerClass() {
      return this.player ? `player-${this.player}` : '';
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

.player-1 {
  &::before {
    content: '';
    width: calc(80% - #{$border-width * 2});
    height: calc(80% - #{$border-width * 2});
    border: $border-width solid red;
    border-radius: 50%;
    display: block;
  }
}

.player-2 {
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
