<script setup>
import TheWelcome from '../components/TheWelcome.vue'

import toaster from '@/plugins/Toaster'

const onSubmit = () => {
  toaster.success('ログイン')
}
</script>

<template>
  <main>
    <v-btn @click="onSubmit">実行</v-btn>
    <TheWelcome/>
  </main>
</template>
