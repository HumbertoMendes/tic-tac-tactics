<template>
  <v-card
    class="elevation-0 d-flex flex-column align-center"
  >
    <h1>
      {{ message }}
    </h1>
    <v-card
      class="board elevation-0"
      :disabled="hasEnded || disabled"
    >
      <div
        v-for="row in boardSize"
        :key="`${row}`"
      >
        <square v-for="column in boardSize"
          :key="`${column}`"
          :row="row - 1"
          :column="column - 1"
          :moves="moves"
          @click="() => selectSquare(row - 1, column - 1)"
        />
      </div>
    </v-card>
    <!-- <v-btn
      :disabled="hasEnded"
      class="mt-4"
      color="secondary"
      @click="playCpu"
    >
      Dance my Puppets
    </v-btn> -->
    <div class="d-flex align-center mt-4">
      <div class="d-flex">
        <v-select
          v-model="player1"
          :items="playerList"
          hide-details
          outlined
          dense
          label="Player 1"
          :disabled="isPlaying"
        />
        <v-select
          v-model="player2"
          :items="playerList"
          hide-details
          class="ml-4"
          outlined
          dense
          label="Player 2"
          :disabled="isPlaying"
        />
      </div>
      <v-btn
        color="primary"
        class="ml-4"
        @click="start()"
      >
        {{ isPlaying ? 'Restart' : 'Start' }}
      </v-btn>
    </div>
  </v-card>
</template>

<script>
/* eslint-disable max-len */
import Square from './Square.vue';
import { Status, Player } from '../../constants/gameConstants';

export default {
  components: { Square },
  name: 'board',
  data() {
    return {
      round: 0,
      boardSize: 3,
      moves: [],
      grid: [],
      status: Status.IDLE,
      disabled: false,
      player1: null,
      player2: null,
      currentPlayer: null,
      playerList: [],
      players: [],
    };
  },
  created() {
    this.moves = this.createMoves();
    this.playerList = Object.entries(Player).map(([key, value]) => ({ text: key, value }));
    this.player1 = Player.HUMAN;
    this.player2 = Player.CPU;
  },
  computed: {
    isPlaying() {
      return this.status === Status.PLAYING;
    },
    hasEnded() {
      return this.status !== Status.PLAYING;
    },
    message() {
      if (this.status === Status.DRAW) return 'Draw :(';
      if (this.status === Status.VICTORY) return `Congratulations Player #${this.currentPlayer + 1}!`;
      if (this.status === Status.PLAYING) return `Current player: ${this.currentPlayer + 1}`;
      return 'Press START!';
    },
    availableMoves() {
      return this.getPlayerMoves(null);
    },
    availablePlays() {
      return this.availableMoves.map((moves) => moves.play);
    },
    nextPlayer() {
      return this.currentPlayer === 0 ? 1 : 0;
    },
    corners() {
      return this.getPlayerCorners();
    },
    center() {
      return parseInt(this.boardSize / 2);
    },
  },
  methods: {
    start() {
      console.clear();
      console.log('================NEW GAME================');
      this.players = [this.player1, this.player2];

      this.round = 0;
      this.currentPlayer = Math.round(Math.random());
      this.clearMoves();
      this.status = Status.PLAYING;

      if (this.players[this.currentPlayer] === Player.CPU) this.playCpu();
    },
    getPlayerMoves(player) {
      return this.moves.filter((move) => move.player === player);
    },
    getPlayerPlays(player) {
      return this.getPlayerMoves(player).map((moves) => moves.play);
    },
    getPlayerCorners(player) {
      return this.moves.filter((move) => ((move.play[0] + move.play[1] === this.boardSize - 1)
          || (move.play[0] === move.play[1]))
          && (move.play[0] !== this.center && move.play[1] !== this.center)
          && (player === undefined ? true : move.player === player));
    },
    selectSquare(row, column) {
      const move = this.findMove(row, column);
      move.player = this.currentPlayer;

      const plays = this.getPlayerPlays(this.currentPlayer);
      if (this.checkVictory(plays, row, column)) this.status = Status.VICTORY;
      else if (this.checkDraw()) this.status = Status.DRAW;
      else if (!this.hasEnded) {
        this.round += 1;
        this.currentPlayer = this.nextPlayer;
        if (this.players[this.currentPlayer] === Player.CPU) this.playCpu();
      }
    },
    checkDraw() {
      return this.availableMoves.length === 0;
    },
    checkVictory(plays, row, column) {
      if (plays.length < this.boardSize) return false;
      if (this.checkHorizontal(plays, row)) return true;
      if (this.checkVertical(plays, column)) return true;
      if (this.checkDiagonal(plays)) return true;
      return false;
    },
    checkHorizontal(plays, row) {
      return plays.reduce((count, play) => count + (play[0] === row), 0) === this.boardSize;
    },
    checkVertical(plays, column) {
      return plays.reduce((count, play) => count + (play[1] === column), 0) === this.boardSize;
    },
    checkDiagonal(plays) {
      return plays.reduce((count, play) => count + (play[0] === play[1]), 0) === this.boardSize
        || plays.reduce((count, play) => count + (play[0] + play[1] === this.boardSize - 1), 0) === this.boardSize;
    },
    chooseRandom() {
      return Math.floor(Math.random(this.boardSize) * this.boardSize);
    },
    createMoves() {
      const availableMoves = [];

      for (let row = 0; row < this.boardSize; row++) {
        for (let column = 0; column < this.boardSize; column++) {
          availableMoves.push({ player: null, play: [row, column] });
        }
      }

      return availableMoves;
    },
    clearMoves() {
      this.moves.forEach((move) => {
        // eslint-disable-next-line no-param-reassign
        move.player = null;
      });
    },
    findMove(row, column) {
      return this.moves.find((move) => move.play[0] === row && move.play[1] === column);
    },
    findPlayerMoves(player) {
      return this.moves.find((move) => move.player === player);
    },
    playCpu() {
      if (this.hasEnded) return;

      this.disabled = true;

      const play = this.getCpuPlay();

      setTimeout(() => {
        this.selectSquare(play[0], play[1]);
        this.disabled = false;
      }, 500);
    },
    getCpuPlay() {
      const me = this.currentPlayer;
      const opponent = this.nextPlayer;
      const { availablePlays } = this;
      const myPlays = this.getPlayerPlays(me);
      const opponentPlays = this.getPlayerPlays(opponent);

      console.log(`Round #${this.round}`);
      console.log(`Current Player: #${me}`);
      let play = null;
      // First, try to win
      for (let i = 0; i < availablePlays.length; i++) {
        const currentPlay = availablePlays[i];
        const [row, column] = currentPlay;
        const mockPlays = [...this.getPlayerPlays(me), [row, column]];

        if (this.checkVictory(mockPlays, row, column)) {
          play = currentPlay;
          break;
        }
      }

      if (play) {
        console.log('Trying to win', play, JSON.stringify(availablePlays));
        return play;
      }

      // Next, prevent your opponent's victory
      for (let i = 0; i < availablePlays.length; i++) {
        const currentPlay = availablePlays[i];
        const [row, column] = currentPlay;
        const mockPlays = [...this.getPlayerPlays(opponent), [row, column]];

        if (this.checkVictory(mockPlays, row, column)) {
          play = currentPlay;
          break;
        }
      }

      if (play) {
        console.log('Blocking my opponent', play, JSON.stringify(availablePlays));

        return play;
      }

      // Now check if it is the first round and the opponent has a corner
      const opponentCorners = this.getPlayerCorners(opponent);
      if (myPlays.length + opponentPlays.length === 1
          && opponentCorners.length === 1
          && availablePlays.find((p) => p[0] === this.center && p[1] === this.center)
      ) {
        play = [this.center, this.center];
        console.log('Checking for corners, blocking the center', play, JSON.stringify(availablePlays));

        return play;
      }

      // Check if the opponent has two or more corners and I've selected the center
      if (opponentCorners.length > 1 && myPlays.find((myPlay) => myPlay[0] === 1 && myPlay[1] === 1)) {
        const crossPlays = availablePlays.filter((availablePlay) => (availablePlay[0] + availablePlay[1]) % 2 === 1);
        const cornerIndex = Math.floor(Math.random(crossPlays.length) * crossPlays.length);
        play = crossPlays[cornerIndex];
        console.log('Any random diagonally opposite', play, JSON.stringify(availablePlays));

        return play;
      }

      // Now check if there are corners available and the opponent has not selected the center
      const availableCorners = this.getPlayerCorners(null);
      if (availableCorners.length > 0) {
        const myCorners = this.getPlayerCorners(me);

        for (let i = 0; i < myCorners.length; i++) {
          const corner = myCorners[i];
          const rowMod = corner.play[0] === 0 ? 1 : -1;
          const columnMod = corner.play[1] === 0 ? 1 : -1;

          if (availablePlays.reduce(
            (count, availablePlay) => {
              const aRow = availablePlay[0] === (corner.play[0] + (1 * rowMod * count));
              const aColumn = availablePlay[1] === (corner.play[1] + (1 * columnMod * count));

              return count + (aRow && aColumn);
            }, 1,
          ) === this.boardSize) {
            play = [corner.play[0] + (2 * rowMod), corner.play[1] + (2 * columnMod)];
            console.log('Checking for available opposite corners', play, JSON.stringify(availablePlays));

            return play;
          }
        }

        const cornerIndex = Math.floor(Math.random(availableCorners.length) * availableCorners.length);
        play = availableCorners[cornerIndex].play;
        console.log('Any random corners', play, JSON.stringify(availablePlays));

        return play;
      }

      const index = Math.floor(Math.random(availablePlays.length) * availablePlays.length);
      play = availablePlays[index];
      console.log('Any random play', play, JSON.stringify(availablePlays));

      return play;
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  // min-width: 300px;
  // max-width: 900px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
