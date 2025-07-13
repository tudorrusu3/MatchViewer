<template>
  <div class="div">
    <AppNavbar @searchUpdated="handleSearchUpdated" />
    <div class="hero">
      <h1>Upcoming Matches - MatchViewer</h1>
    </div>
    <div class="container-wrapper">
      <v-container fluid>
        <v-row class="match-grid">
          <v-col
            v-for="(match, index) in filteredMatches"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            xl="2"
          >
            <MatchCard :match="match" @ticketBought="handleTicketBought" />
          </v-col>
          <v-col v-if="filteredMatches && filteredMatches.length === 0">
            <p>No matches were found for your search.</p>
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar
        v-model="snackbar.visible"
        :color="snackbar.color"
        top
        timeout="3000"
        elevation="2"
      >
        {{ snackbar.message }}
      </v-snackbar>
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
      searchQuery: '',
      snackbar: {
        visible: false,
        message: '',
        color: 'green',
      },
    };
  },
  computed: {
    filteredMatches() {
      if (!this.matches || !Array.isArray(this.matches)) return [];

      const query = this.searchQuery.toLowerCase().trim();

      if (query === "") {
        return this.matches;
      }

      return this.matches.filter(
        (match) =>
          match.homeTeam?.toLowerCase().includes(query) ||
          match.stadium?.toLowerCase().includes(query)
      );
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userName() {
      return this.$store.getters.getUserName;
    },
  },
  mounted() {
    this.getMatches();
  },
  methods: {
    async getMatches() {
      try {
        const response = await fetch('http://localhost:3000/matches', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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
    handleSearchUpdated(query) {
      this.searchQuery = query;
    },
    handleTicketBought(matchId) {
      const match = this.matches.find(m => m.id === matchId);
      if (match && match.ticketsAvailable > 0) {
        match.ticketsAvailable--;
      }
      this.snackbar.message = 'Bilet cumpărat cu succes!';
      this.snackbar.color = 'green';
      this.snackbar.visible = true;
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
