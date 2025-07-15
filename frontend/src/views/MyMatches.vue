<template>
  <div class="div">
    <AppNavbar @searchUpdated="handleSearchUpdated" />

    <div class="hero">
      <h1>My Matches - MatchViewer</h1>
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
            <MatchCard :match="match.match" :ticketsCount="match.ticketsCount" />
          </v-col>

          <v-col v-if="filteredMatches.length === 0">
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
import { handleTokenExpiration } from '@/utils/AuthUtils.js';

export default {
  components: {
    AppNavbar,
    MatchCard,
  },
  data() {
    return {
      matches: [],
      searchQuery: '',
    };
  },
  computed: {
    filteredMatches() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) return this.matches;

      return this.matches.filter(({ match }) => {
        return (
          match.homeTeam?.toLowerCase().includes(query) ||
          match.awayTeam?.toLowerCase().includes(query) ||
          match.stadium?.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    handleSearchUpdated(query) {
      this.searchQuery = query;
    },
    async fetchMyMatches() {
  try {
    const response = await fetch('http://localhost:3000/myMatches', {
      method: 'GET',
      credentials: 'include',
      headers: {
    'Cache-Control': 'no-cache',
  }
    });

    if (response.status === 401) {
      // Token expirat, apelăm funcția care face logout + redirect
      const message = await handleTokenExpiration(this.$store, this.$router);
      // Arată mesajul în UI, de exemplu cu snackbar (dacă ai)
      this.$emit('showSnackbar', { message, color: 'red' }); // sau altă metodă
      return; // ieșim, nu mai procesăm date
    }

    const data = await response.json();

    if (data.data) {
      const grouped = {};
      data.data.forEach((match) => {
        if (!grouped[match.id]) {
          grouped[match.id] = { match, ticketsCount: 1 };
        } else {
          grouped[match.id].ticketsCount++;
        }
      });

      this.matches = Object.values(grouped);
    }
  } catch (error) {
    console.error('Error fetching my matches:', error);
  }
},
  },
  mounted() {
    this.fetchMyMatches();
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
