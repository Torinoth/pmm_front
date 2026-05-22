<script setup>
import {ref} from 'vue'
import {RouterView} from 'vue-router'

const drawer = ref(true)
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"/>
      </template>

      <v-app-bar-title>すこん部員のなにがし</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            :to="{ name: 'home' }"
        />
        <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="積み状況"
            :to="{ name: 'stock_list' }"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<style scoped>
</style>
