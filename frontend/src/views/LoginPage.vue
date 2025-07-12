<template>
  <div class="wrapper">
    <div class="image-section"></div>
    <div class="form-section">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'; 

export default {
  components: {
    LoginForm
  }
};
</script>

<style scoped>

.wrapper {
  display: flex;
  height: 100vh; 
}

.image-section {
  flex: 1;
  background-image: url('../assets/stadionTIC.jpg');
  background-size: cover;

}

.form-section {
  flex: 1;
  display: flex;
  justify-content: center;

}

@media (max-width: 768px) {
  .image-section {
    display: none; 
  }
  .wrapper {
    flex-direction: column; 
  }

}

</style>