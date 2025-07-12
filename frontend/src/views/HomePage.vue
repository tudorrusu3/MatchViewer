<template>
  <div class="div">
    <AppNavbar />
    <div class="hero">
      <h1>Upcoming Matches - MatchViewer</h1>
    </div>
    <div class="container-wrapper">
      <v-container fluid>
        <v-row class="match-grid">
          <v-col
            v-for="(match, index) in matches"
            :key="match.id || index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            xl="2"
          >
            <MatchCard :match="match" />
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
  name: 'HomePageMatches',
  components: {
    AppNavbar,
    MatchCard,
  },
  data() {
    return {
      matches: [],
    };
  },
  mounted() {
    this.getMatches();
  },
  methods: {
    async getMatches() {
      try {
        const response = await fetch('http://localhost:3000/matches', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.matches = data;
        } else {
          console.error('Error fetching matches:', response.status);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    },
    // Dacă vrei funcționalitate pentru bilete/favorites, poți adăuga metode similare aici
  },
};
</script>

<style scoped>
.div {
  background-color: black;
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

@media (max-width: 768px) {
  .v-container {
    padding: 0 20px;
  }
  .v-col {
    padding: 5px !important;
  }
}
</style>
