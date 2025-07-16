<template>
  <v-card class="match-card d-flex flex-column">
    <v-img
      :src="match.imageUrl"
      height="200px"
      alt="Stadium image"
      @click="viewDetails(match.id)"
      class="cursor-pointer"
      cover
    ></v-img>

    <v-card-title class="title text-center">
      {{ match.homeTeam }} vs {{ match.awayTeam }} - {{ formattedDate }} at {{ match.stadium }}
    </v-card-title>

    <v-card-subtitle class="text-center subtitle-wrap">
      <div class="info-line">
        <v-icon icon="mdi-ticket" class="text-gold"></v-icon>
        <span>{{ match.ticketsAvailable }} tickets available</span>
      </div>
      <div class="info-line" v-if="ticketsCount > 0">
        <v-icon icon="mdi-account" class="text-gold"></v-icon>
        <span>You own {{ ticketsCount }} ticket{{ ticketsCount > 1 ? 's' : '' }}</span>
      </div>
    </v-card-subtitle>

    <v-spacer></v-spacer>

    <v-card-actions class="d-flex justify-center">
      <v-btn color="#3c4ebe" @click="buyTicket(match.id)">
        <v-icon left>mdi-cart</v-icon>
        Buy Ticket
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true,
    },
    ticketsCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    formattedDate() {
      return new Date(this.match.date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
  methods: {
    viewDetails(id) {
      this.$router.push({ name: 'matchDetails', params: { id } });
    },
    async buyTicket(matchId) {
      try {
        const response = await fetch(`http://localhost:3000/matches/${matchId}/buy-ticket`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();

        if (response.ok) {
          this.$emit('ticketBought', matchId);
        } else {
          alert('Eroare la cumpărare: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        alert('Eroare la conexiune.');
      }
    },
  },
};
</script>

<style scoped>
.match-card {
  background-color: #121212;
  color: white;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%; /* important pentru egalizarea înălțimii */
}

.match-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.title {
  font-size: 16px;
  padding: 12px 16px;
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
}

.subtitle-wrap {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  text-align: center;
}

.text-gold {
  color: #f5c518;
}

.v-card-actions {
  padding: 12px;
  margin-top: auto;
}
</style>
