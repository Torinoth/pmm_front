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
    <h3>左から選んでね</h3>
  </main>
</template>

<script>

</script>