<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4 text-center">

          <!-- ロード中 -->
          <template v-if="verifyStatus === 'loading'">
            <v-progress-circular indeterminate color="primary" size="64" class="mt-4 mb-4"/>
            <v-card-title class="text-h6">認証中...</v-card-title>
          </template>

          <!-- 成功 -->
          <template v-else-if="verifyStatus === 'success'">
            <v-icon icon="mdi-check-circle" size="64" color="success" class="mt-4 mb-2"/>
            <v-card-title class="text-h6">認証完了！</v-card-title>
            <v-card-text>
              メールアドレスの認証が完了しました。<br>
              ログインしてご利用ください。
            </v-card-text>
            <v-card-actions class="justify-center pb-4">
              <v-btn color="primary" :to="{name: 'login'}">ログイン画面へ</v-btn>
            </v-card-actions>
          </template>

          <!-- 失敗 -->
          <template v-else>
            <v-icon icon="mdi-alert-circle" size="64" color="error" class="mt-4 mb-2"/>
            <v-card-title class="text-h6">認証に失敗しました</v-card-title>
            <v-card-text>
              認証リンクが無効または期限切れです。<br>
              再度ユーザー登録をお試しください。
            </v-card-text>
            <v-card-actions class="justify-center pb-4">
              <v-btn color="primary" :to="{name: 'register'}">登録画面へ</v-btn>
            </v-card-actions>
          </template>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {authApi} from '@/api/index.js'

const route = useRoute()
const verifyStatus = ref('loading')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    verifyStatus.value = 'error'
    return
  }
  try {
    await authApi.verifyEmail(token)
    verifyStatus.value = 'success'
  } catch {
    verifyStatus.value = 'error'
  }
})
</script>
