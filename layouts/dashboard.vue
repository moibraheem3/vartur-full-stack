<script setup lang="ts">
const authStore = useAuthStore();

const drawer = ref(false);

onMounted(() => drawer.value = true)

</script>

<template>
  <v-app>
      <v-layout>
        <v-app-bar>
          <template v-if="!$vuetify.display.lgAndUp">
            <v-app-bar-nav-icon
              variant="text"
              @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
          </template>

          <v-toolbar-title>Vartur</v-toolbar-title>

          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/69.jpg"
            title="Admin"
          >
            <template v-slot:append>
              <v-btn
                color="error"
                icon="mdi-logout"
                variant="text"
                @click="authStore.logout"
              ></v-btn>
            </template>
          </v-list-item>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer">
          <v-list nav>
            <v-list-item
              title="Categories"
              link
              to="/categories"
              rounded="lg"
            />
            <v-list-item title="Products" link to="/products" rounded="lg" />
          </v-list>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center">
          <v-container>
            <slot />
          </v-container>
        </v-main>
      </v-layout>
  </v-app>
</template>
