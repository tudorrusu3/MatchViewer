<template>
  <div class="div">
    <AppNavbar />

    <div class="hero">
      <h1>My Matches - MatchViewer</h1>
    </div>

    <div class="container-wrapper">
      <v-container fluid>
        <v-row class="match-grid">
          <v-col
            v-for="(match, index) in matches"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            xl="2"
          >
            <MatchCard :match="match" />
          </v-col>
          <v-col v-if="matches.length === 0">
            <p>You have not bought any tickets yet.</p>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';
import MatchCard from '@/components/MatchCard.vue';

export default {
  components: {
    AppNavbar,
    MatchCard,
  },
  data() {
    return {
      matches: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:3000/myMatches', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      this.matches = data.data || [];
    } catch (error) {
      console.error('Error fetching my matches:', error);
    }
  },
};
</script>

<style scoped>
.div {
  background-color: black;
  min-height: 100vh;
}

.hero {
  background-size: cover;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}

.v-container {
  background-color: black;
  padding: 0 100px;
}

.match-grid {
  margin: -10px;
}

.v-col {
  padding: 5px !important;
}

.v-col p {
  color: white;
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .v-container {
    padding: 0 20px;
  }
  .v-col {
    padding: 5px !important;
  }
}
</style>

