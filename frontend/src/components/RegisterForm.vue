<template>
  <div class="register-container">
    <v-card class="pa-6" max-width="448" style="min-width: 300px; width: 100%">
      <v-card-title class="text-h3 text-center font-weight-bold"
        >Create account</v-card-title
      >

      <v-text-field
        v-model="name"
        label="Name"
        density="compact"
        variant="outlined"
        rounded="lg"
        bg-color="#eeeeee"
        color="#3c4ebe"
        prepend-inner-icon="mdi-account"
      ></v-text-field>

      <v-text-field
        v-model="email"
        label="Email"
        density="compact"
        variant="outlined"
        rounded="lg"
        bg-color="#eeeeee"
        color="#3c4ebe"
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        density="compact"
        variant="outlined"
        rounded="lg"
        bg-color="#eeeeee"
        color="#3c4ebe"
        prepend-inner-icon="mdi-lock-outline"
        type="password"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        label="Re-enter password"
        density="compact"
        variant="outlined"
        rounded="lg"
        bg-color="#eeeeee"
        color="#3c4ebe"
        prepend-inner-icon="mdi-lock-outline"
        type="password"
      ></v-text-field>

      <v-btn
        class="mb-5 mt-2"
        color="#3c4ebe"
        size="large"
        block
        @click="register"
        rounded="lg"
      >
        Create your account
      </v-btn>

      <router-link
        to="/login"
        class="text-decoration-none"
        style="color: #3c4ebe"
      >
        Already have an account? Sign in
        <v-icon icon="mdi-chevron-right"></v-icon>
      </router-link>
    </v-card>
  </div>

  <v-snackbar
    v-model="snackbar.visible"
    :color="snackbar.color"
    :location="snackbar.location"
    :elevation="snackbar.elevation"
    timeout="3000"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      snackbar: {
        visible: false,
        message: "",
        color: "red",
        elevation: "2",
        location: "top",
      },
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.showSnackbar("Passwords are not matching", "red");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: this.name,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          this.showSnackbar(
            "Account created successfully, please login",
            "green"
          );
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else if (response.status === 409) {
          this.showSnackbar("Email is already used", "red");
        } else {
          this.showSnackbar(
            data?.error || "There is an error with auth",
            "red"
          );
        }
      } catch (error) {
        console.error(error);
        this.showSnackbar("Server error", "red");
      }
    },

    showSnackbar(message, color = "red") {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },

    goTologin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-btn {
  font-size: 16px;
}
</style>
