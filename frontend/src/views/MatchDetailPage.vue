<template>
  <v-container fluid class="match-container">
    <v-container v-if="loading" class="loading-container" fluid>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>

    <v-container v-else-if="match" fluid>
      <v-row justify="center" align="center" class="match-row">
        <v-col cols="12" md="6" class="image-col">
          <v-img :src="match.imageUrl" class="match-image" contain></v-img>
        </v-col>

        <v-col cols="12" md="6" class="details-col">
          <h1 class="match-title">
            {{ match.homeTeam }} vs {{ match.awayTeam }}
          </h1>

          <div class="chips-wrapper">
            <v-chip class="info-chip" label>
              <v-icon left>mdi-calendar</v-icon>
              {{ formatDate(match.date) }}
            </v-chip>
            <v-chip class="info-chip" label>
              <v-icon left>mdi-map-marker</v-icon>
              {{ match.stadium }}
            </v-chip>
            <v-chip class="info-chip" label>
              <v-icon left>mdi-ticket</v-icon>
              {{ match.ticketsAvailable }} tickets left
            </v-chip>
            <v-chip class="info-chip" label>
              <v-icon left>mdi-currency-eur</v-icon>
              {{ match.price.toFixed(2) }} EUR
            </v-chip>
          </div>

          <p class="match-description">
            Don't miss the clash between {{ match.homeTeam }} and {{ match.awayTeam }} at {{ match.stadium }}.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :elevation="2" :top="snackbar.location" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      match: null,
      loading: true,
      snackbar: {
        visible: false,
        message: '',
        color: 'red',
        elevation: "2",
        location: "top",
      },
    };
  },
  async created() {
    await this.fetchMatchDetails();
  },
  methods: {
    async fetchMatchDetails() {
      try {
        const matchId = this.$route.params.id;
        console.log('Fetching match with ID:', matchId);
        const response = await fetch(`http://localhost:3000/matches/${matchId}`);
        const result = await response.json();
        if (response.ok) {
          this.match = result;
        } else {
          console.error('Error fetching match details:', result.error || result.message);
          this.snackbar.message = 'Failed to load match details.';
          this.snackbar.color = 'red';
          this.snackbar.visible = true;
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
        this.snackbar.message = 'An error occurred while loading match details.';
        this.snackbar.color = 'red';
        this.snackbar.visible = true;
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    }
  }
}
</script>

<style scoped>
.match-container {
  background-color: #212121;
  color: white;
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #212121;
}

.match-row {
  max-width: 900px;
  margin: 0 auto;
  gap: 30px;
  align-items: center;
}

.image-col {
  display: flex;
  justify-content: center;
}

.match-image {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0,0,0,0.7);
}

.details-col {
  padding-left: 30px;
}

.match-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 25px;
}

.chips-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.info-chip {
  background-color: #3c4ebe;
  color: white;
  font-weight: 600;
  padding: 8px 12px;
}

.match-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-top: 15px;
  font-weight: 400;
}

/* Responsive tweaks */
@media (max-width: 960px) {
  .match-row {
    flex-direction: column;
    max-width: 100%;
  }
  .details-col {
    padding-left: 0;
    text-align: center;
  }
  .match-title {
    font-size: 2rem;
  }
  .match-image {
    max-width: 300px;
    margin-bottom: 20px;
  }
}
</style>
