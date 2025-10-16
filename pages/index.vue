<script setup lang="ts">
definePageMeta({
  middleware: ["logged-in"],
});

const authStore = useAuthStore();
const router = useRouter();

const valid = ref(false);
const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const usernameRules = ref([
  (value: any) => {
    if (value) return true;
    return "Username is required.";
  },
  (value: any) => {
    if (value?.length > 2) return true;
    return "Username must be more than 2 characters.";
  },
]);

const passwordRules = ref([
  (value: any) => {
    if (value) return true;
    return "Password is required.";
  },
  (value: any) => {
    if (value?.length >= 5) return true;
    return "Password must be 5 characters or more.";
  },
]);

async function submit() {
  if (!valid.value) return;
  loading.value = true;
  error.value = "";

  try {
    const success = await authStore.login(username.value, password.value);
    if (success) {
      router.push("/categories");
    } else {
      error.value = "Invalid credentials";
    }
  } catch (e) {
    error.value = "An error occurred";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="mt-16">
    <v-row>
      <v-col class="mx-md-auto v-col-md-8 v-col-lg-6">
        <v-card class="pa-2">
          <v-card-title>
            <h3 class="text-center">Login</h3>
          </v-card-title>
          <v-card-item>
            <v-form v-model="valid" @submit.prevent="submit">
              <div class="pa-2">
                <v-text-field
                  v-model="username"
                  variant="outlined"
                  label="Username"
                  type="text"
                  :rules="usernameRules"
                  required
                />
              </div>
              <div class="pa-2">
                <v-text-field
                  v-model="password"
                  variant="outlined"
                  label="Password"
                  type="password"
                  :rules="passwordRules"
                  required
                />
              </div>
              <div class="pa-2">
                <v-btn
                  type="submit"
                  size="large"
                  color="primary"
                  rounded="lg"
                  block
                  :disabled="loading"
                >
                  {{ loading ? "" : "Login" }}
                  <v-progress-circular
                    color="primary"
                    indeterminate
                    v-if="loading"
                  ></v-progress-circular>
                </v-btn>
              </div>
              <p v-if="error" class="mt-4 text-red-darken-1">
                {{ error }}
              </p>
            </v-form>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
