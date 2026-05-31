<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h5 pa-4 pb-1">積みログ</v-card-title>
          <v-card-subtitle class="px-4 pb-3">ログイン</v-card-subtitle>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="submit">
              <v-text-field
                  v-model="username"
                  label="ユーザー名"
                  :rules="[v => !!v || '必須項目です']"
                  required
                  autocomplete="username"
              />
              <v-text-field
                  v-model="password"
                  label="パスワード"
                  type="password"
                  :rules="[v => !!v || '必須項目です']"
                  required
                  autocomplete="current-password"
              />
              <v-alert v-if="errorMessage" type="error" class="mb-3" density="compact">
                {{ errorMessage }}
              </v-alert>
              <v-btn type="submit" color="primary" block :loading="loading">
                ログイン
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <span class="text-body-2 text-medium-emphasis">アカウントをお持ちでない方は</span>
            <v-btn variant="text" size="small" :to="{name: 'register'}" class="ml-1 px-1">
              新規登録
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/index.js'

const router = useRouter()
const formRef = ref(null)
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  const valid = await formRef.value?.validate()
  if (!valid?.valid) return
  loading.value = true
  errorMessage.value = ''
  try {
    await authApi.csrf()
    await authApi.login({username: username.value, password: password.value})
    router.push({name: 'home'})
  } catch (e) {
    errorMessage.value = e.response?.data?.detail ?? 'ログインに失敗しました。'
  } finally {
    loading.value = false
  }
}
</script>
