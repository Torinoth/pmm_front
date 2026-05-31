<script setup>
import {ref} from 'vue'
import {RouterView, useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth.js'
import {authApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

const drawer = ref(true)
const router = useRouter()
const auth = useAuthStore()

async function logout() {
  try {
    await authApi.logout()
  } catch {
    // セッション切れの場合でもリセットしてログイン画面へ
  }
  auth.reset()
  router.push({name: 'login'})
}

async function copyShareUrl() {
  const url = `${window.location.origin}/u/${auth.user?.username}`
  try {
    await navigator.clipboard.writeText(url)
    toaster.success('URLをコピーしました')
  } catch {
    toaster.error('コピーに失敗しました')
  }
}
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"/>
      </template>

      <v-app-bar-title>積みログ</v-app-bar-title>

      <template v-slot:append>
        <template v-if="auth.isAuthenticated">
          <span class="text-body-2 mr-2">{{ auth.user?.username }}</span>
          <v-btn variant="text" size="small" @click="logout">ログアウト</v-btn>
        </template>
        <v-btn v-else variant="text" size="small" :to="{name: 'login'}">ログイン</v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            :to="{ name: 'home' }"
        />
        <v-list-item
            v-if="auth.isAuthenticated"
            prepend-icon="mdi-format-list-bulleted"
            title="積み状況"
            :to="{ name: 'stock_list' }"
        />
        <v-list-item
            v-if="auth.isAuthenticated"
            prepend-icon="mdi-database-cog"
            title="マスタ管理"
            :to="{ name: 'master' }"
        />
        <v-list-item
            v-if="auth.isStaff"
            prepend-icon="mdi-account-group"
            title="ユーザー管理"
            :to="{ name: 'admin_users' }"
        />
        <template v-if="auth.isAuthenticated">
          <v-divider class="my-2"/>
          <v-list-item
              prepend-icon="mdi-share-variant"
              title="自分のページを共有"
              :subtitle="`/u/${auth.user?.username}`"
              @click="copyShareUrl"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<style scoped>
</style>
