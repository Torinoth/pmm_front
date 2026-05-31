<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <!-- 登録フォーム -->
        <v-card v-if="!registered">
          <v-card-title class="text-h5 pa-4 pb-1">積みログ</v-card-title>
          <v-card-subtitle class="px-4 pb-3">新規登録</v-card-subtitle>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" class="mb-4" density="compact">
              {{ errorMessage }}
            </v-alert>
            <v-form ref="formRef" @submit.prevent="submit">
              <v-text-field
                  v-model="username"
                  label="ユーザー名"
                  :rules="[v => !!v || '必須項目です']"
                  required
                  autocomplete="username"
              />
              <v-text-field
                  v-model="email"
                  label="メールアドレス"
                  type="email"
                  :rules="[v => !!v || '必須項目です', v => /.+@.+\..+/.test(v) || '有効なメールアドレスを入力してください']"
                  required
                  autocomplete="email"
              />
              <v-text-field
                  v-model="password"
                  label="パスワード（8文字以上）"
                  type="password"
                  :rules="[v => (!!v && v.length >= 8) || '8文字以上で入力してください']"
                  required
                  autocomplete="new-password"
              />
              <v-btn type="submit" color="primary" block :loading="loading" class="mt-2">
                登録申請
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <span class="text-body-2 text-medium-emphasis">すでにアカウントをお持ちの方は</span>
            <v-btn variant="text" size="small" :to="{name: 'login'}" class="ml-1 px-1">
              ログイン
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- 登録完了 -->
        <v-card v-else class="pa-4 text-center">
          <v-icon icon="mdi-email-check" size="64" color="success" class="mt-4 mb-2"/>
          <v-card-title class="text-h6">認証メールを送信しました</v-card-title>
          <v-card-text>
            ご登録のメールアドレスに認証メールを送信しました。<br>
            メール内のリンクをクリックして認証を完了してください。
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn color="primary" :to="{name: 'login'}">ログイン画面へ</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from 'vue'
import {authApi} from '@/api/index.js'

const formRef = ref(null)
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const registered = ref(false)

async function submit() {
  const valid = await formRef.value?.validate()
  if (!valid?.valid) return
  loading.value = true
  errorMessage.value = ''
  try {
    await authApi.register({username: username.value, email: email.value, password: password.value})
    registered.value = true
  } catch (e) {
    errorMessage.value = e.response?.data?.detail ?? '登録に失敗しました。もう一度お試しください。'
  } finally {
    loading.value = false
  }
}
</script>
