<template>
  <header>
    <v-breadcrumbs :items="[{title: 'home', disabled: true}]"/>
  </header>

  <v-container>
    <!-- ようこそメッセージ -->
    <v-row class="mb-6">
      <v-col>
        <h2 v-if="authStore.isAuthenticated" class="text-h5">
          ようこそ、<span class="text-primary">{{ authStore.user?.username }}</span> さん
        </h2>
        <h2 v-else class="text-h5">プラモデル積みリスト</h2>
      </v-col>
    </v-row>

    <!-- サマリーカード -->
    <v-row class="mb-6">
      <v-col
          v-for="card in summaryCards"
          :key="card.key"
          cols="12"
          sm="6"
          md="3"
      >
        <v-card
            :color="card.color"
            variant="tonal"
            class="text-center pa-2"
            style="cursor: pointer"
            @click="$router.push({ name: 'stock_list', query: card.status ? {status: card.status} : {} })"
        >
          <v-card-text>
            <v-icon :icon="card.icon" size="40" class="mb-3"/>
            <div class="text-h3 font-weight-bold mb-1">
              <v-progress-circular v-if="loading" indeterminate size="32"/>
              <span v-else>{{ summary[card.key] ?? 0 }}</span>
            </div>
            <div class="text-body-1">{{ card.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- タグ別キット数 Top 5 -->
    <v-row>
      <v-col cols="12">
        <div class="text-body-2 text-medium-emphasis mb-3">タグ別キット数 Top 5</div>
        <template v-if="loading">
          <v-progress-linear indeterminate color="primary" class="mb-2"/>
        </template>
        <template v-else-if="summary.tags_top && summary.tags_top.length">
          <v-chip
              v-for="tag in summary.tags_top"
              :key="tag.id"
              color="primary"
              variant="tonal"
              size="large"
              class="mr-2 mb-2"
              style="cursor: pointer"
              @click="$router.push({ name: 'stock_list', query: { tag_id: tag.id } })"
          >
            {{ tag.name }}
            <template #append>
              <v-chip size="x-small" color="primary" class="ml-1">{{ tag.kit_count }}</v-chip>
            </template>
          </v-chip>
        </template>
        <span v-else class="text-medium-emphasis text-body-2">タグが登録されていません</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthStore} from '@/stores/auth.js'
import {summaryApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

export default {
  computed: {
    ...mapStores(useAuthStore),
  },

  data: () => ({
    loading: true,
    summary: {},
    summaryCards: [
      {key: 'total_kits',  label: '総キット数', icon: 'mdi-package-variant-closed', color: 'blue-grey', status: null},
      {key: 'backlog',     label: '積みプラ',   icon: 'mdi-layers-plus',            color: 'orange',    status: 'backlog'},
      {key: 'in_progress', label: '製作中',     icon: 'mdi-hammer-wrench',          color: 'green',     status: 'in_progress'},
      {key: 'completed',   label: '完成',       icon: 'mdi-check-decagram',         color: 'teal',      status: 'completed'},
    ],
  }),

  created() {
    this.loadSummary()
  },

  methods: {
    async loadSummary() {
      this.loading = true
      try {
        const res = await summaryApi.get()
        this.summary = res.data
      } catch {
        toaster.error('サマリーの取得に失敗しました')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
