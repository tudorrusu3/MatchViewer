<template>
  <v-card class="match-card">
    <v-img
      :src="match.imageUrl"
      height="250px"
      alt="Stadium image"
      @click="viewDetails(match.id)"
      class="cursor-pointer"
      cover
    ></v-img>

    <v-card-title class="title text-center">
      {{ match.homeTeam }} vs {{ match.awayTeam }} - {{ formattedDate }} at {{ match.stadium }}
    </v-card-title>

    <v-card-subtitle class="text-center">
      <v-icon icon="mdi-ticket" class="text-gold"></v-icon>
      <span>{{ match.ticketsAvailable }} tickets available</span>
    </v-card-subtitle>

    <v-card-actions class="d-flex justify-center">
      <v-btn color="#3c4ebe" @click="buyTicket(match.id)">
        <v-icon>mdi-cart</v-icon>
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
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Bilet cumpărat cu succes!');
        // eventual actualizează ticketsAvailable în this.match
      } else {
        const error = await response.json();
        alert('Eroare la cumpărare: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error.');
    }
}
  },
};
</script>

<style scoped>
.match-card {
  background-color: #121212;
  color: white;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
}

.text-gold {
  color: #f5c518;
}

.title {
  font-size: medium;
  white-space: normal;
  word-wrap: break-word;
  overflow: visible;
}
</style>