<template>
  <header>
    <v-breadcrumbs :items="[
        {title: 'home', to: {name: 'home'}},
        {title: `${username}さんの積みリスト`, disabled: true},
    ]"/>
  </header>

  <!-- フィルター -->
  <v-container fluid class="pb-0">
    <v-row>
      <v-col>
        <h2 class="text-h6 font-weight-bold">{{ username }}さんの積みリスト</h2>
      </v-col>
    </v-row>

    <!-- サマリーカード -->
    <v-row class="mb-4">
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
            style="cursor: default"
        >
          <v-card-text>
            <v-icon :icon="card.icon" size="40" class="mb-3"/>
            <div class="text-h3 font-weight-bold mb-1">
              <v-progress-circular v-if="summaryLoading" indeterminate size="32"/>
              <span v-else>{{ summary[card.key] ?? 0 }}</span>
            </div>
            <div class="text-body-1">{{ card.label }}</div>
            <div class="text-body-2 text-medium-emphasis mt-2">
              <v-progress-circular v-if="summaryLoading" indeterminate size="14"/>
              <span v-else>¥{{ formatPrice(summary[card.priceKey]) }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" class="mt-1">
      <v-col cols="auto">
        <span class="text-body-2 text-medium-emphasis">タグ：</span>
      </v-col>
      <v-col class="overflow-hidden">
        <div class="filter-scroll">
          <v-chip-group v-model="selectedTagIds" multiple @update:model-value="onFilterChange">
            <v-chip
                v-for="tag in availableTags"
                :key="tag.id"
                :value="tag.id"
                filter
                variant="outlined"
                color="primary"
                size="small"
            >
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" class="mt-n2">
      <v-col cols="auto">
        <span class="text-body-2 text-medium-emphasis">ステータス：</span>
      </v-col>
      <v-col class="overflow-hidden">
        <div class="filter-scroll">
          <v-chip-group v-model="selectedStatus" @update:model-value="onFilterChange">
            <v-chip
                v-for="s in statusOptions"
                :key="s.value"
                :value="s.value"
                filter
                variant="outlined"
                :color="s.color"
                size="small"
            >
              {{ s.label }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- PC: データテーブル -->
  <v-data-table-server
      v-if="!mobile"
      v-model:items-per-page="itemsPerPage"
      :headers="tableHeaders"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
  >
    <template #[`item.name`]="{ item }">
      <router-link :to="`/u/${username}/kits/${item.id}`">{{ item.name }}</router-link>
    </template>
    <template #[`item.price`]="{ item }">
      ¥{{ formatPrice(item.price) }}
    </template>
    <template #[`item.image`]="{ item }">
      <v-icon v-if="item.image" color="primary" size="small" title="画像あり">mdi-image</v-icon>
      <v-icon v-else color="grey-lighten-2" size="small" title="画像なし">mdi-image-off</v-icon>
    </template>
    <template #[`item.tags`]="{ item }">
      <v-chip
          v-for="tag in item.tags"
          :key="tag.id"
          size="x-small"
          color="primary"
          variant="tonal"
          class="mr-1"
      >
        {{ tag.name }}
      </v-chip>
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip
          v-if="item.status"
          size="x-small"
          :color="statusColorMap[item.status]"
          variant="tonal"
      >
        {{ statusLabelMap[item.status] }}
      </v-chip>
    </template>
    <template #[`item.days_since_updated`]="{ item }">
      <v-chip
          v-if="item.days_since_updated != null"
          size="x-small"
          :color="daysColor(item.days_since_updated)"
          variant="tonal"
      >
        {{ item.days_since_updated }}日
      </v-chip>
    </template>
  </v-data-table-server>

  <!-- スマホ: カードビュー -->
  <v-container v-else fluid class="pt-2">
    <div v-if="loading" class="d-flex justify-center pa-8">
      <v-progress-circular indeterminate color="primary"/>
    </div>

    <template v-else>
      <div v-if="!serverItems.length" class="text-center text-medium-emphasis pa-8">
        キットが登録されていません
      </div>

      <v-card
          v-for="item in serverItems"
          :key="item.id"
          variant="outlined"
          class="mb-2"
      >
        <div class="d-flex">
          <v-img
              v-if="item.image"
              :src="item.image"
              width="88"
              height="96"
              cover
              class="flex-shrink-0 rounded-s"
          />
          <div
              v-else
              class="d-flex align-center justify-center bg-grey-lighten-3 flex-shrink-0 rounded-s"
              style="width:88px; height:96px"
          >
            <v-icon size="32" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
          </div>

          <div class="pa-3 flex-1-1" style="min-width:0">
            <router-link
                :to="`/u/${username}/kits/${item.id}`"
                class="text-body-2 font-weight-medium text-decoration-none text-primary d-block"
                style="word-break:break-all"
            >
              {{ item.name }}
            </router-link>
            <div class="text-caption text-medium-emphasis mt-1">
              {{ item.maker_name }} · {{ item.scale_size }} · ¥{{ formatPrice(item.price) }}
            </div>
            <div class="mt-2 d-flex flex-wrap ga-1">
              <v-chip
                  v-if="item.status"
                  size="x-small"
                  :color="statusColorMap[item.status]"
                  variant="tonal"
              >
                {{ statusLabelMap[item.status] }}
              </v-chip>
              <v-chip
                  v-if="item.days_since_updated != null"
                  size="x-small"
                  :color="daysColor(item.days_since_updated)"
                  variant="tonal"
              >
                {{ item.days_since_updated }}日
              </v-chip>
              <v-chip
                  v-for="tag in item.tags"
                  :key="tag.id"
                  size="x-small"
                  color="primary"
                  variant="tonal"
              >
                {{ tag.name }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-card>

      <div class="d-flex flex-column align-center py-4">
        <v-pagination
            :model-value="currentOptions.page"
            :length="Math.ceil(totalItems / itemsPerPage) || 1"
            :total-visible="5"
            density="comfortable"
            @update:model-value="page => loadItems({...currentOptions, page})"
        />
        <span class="text-caption text-medium-emphasis mt-2">全{{ totalItems }}件</span>
      </div>
    </template>
  </v-container>
</template>

<script>
import {useDisplay} from 'vuetify'
import {userApi, tagsApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

export default {
  props: {
    username: {type: String, required: true},
  },

  setup() {
    const {smAndDown} = useDisplay()
    return {mobile: smAndDown}
  },

  computed: {
    tableHeaders() {
      return [
        {title: 'キット名', align: 'start', sortable: false, key: 'name'},
        {title: '画像', key: 'image', align: 'center', sortable: false, width: '60px'},
        {title: 'スケール', key: 'scale_size', align: 'start', sortable: false},
        {title: '価格', key: 'price', align: 'end', sortable: false},
        {title: 'タグ', key: 'tags', align: 'start', sortable: false},
        {title: 'ステータス', key: 'status', align: 'start', sortable: false},
        {title: '放置日数', key: 'days_since_updated', align: 'center', sortable: true, width: '90px'},
      ]
    },
  },

  data: () => ({
    itemsPerPage: 10,
    serverItems: [],
    loading: true,
    totalItems: 0,
    currentOptions: {page: 1, itemsPerPage: 10},

    summaryLoading: true,
    summary: {},
    summaryCards: [
      {key: 'total_kits',  priceKey: 'total_price',       label: '総キット数', icon: 'mdi-package-variant-closed', color: 'blue-grey'},
      {key: 'backlog',     priceKey: 'backlog_price',     label: '積みプラ',   icon: 'mdi-layers-plus',            color: 'orange'},
      {key: 'in_progress', priceKey: 'in_progress_price', label: '製作中',     icon: 'mdi-hammer-wrench',          color: 'green'},
      {key: 'completed',   priceKey: 'completed_price',   label: '完成',       icon: 'mdi-check-decagram',         color: 'teal'},
    ],

    availableTags: [],
    selectedTagIds: [],
    selectedStatus: null,
    statusOptions: [
      {value: 'backlog',     label: '積み',     color: 'orange'},
      {value: 'in_progress', label: '製作中',   color: 'green'},
      {value: 'completed',   label: '完成',     color: 'teal'},
      {value: 'on_hold',     label: '中断',     color: 'grey'},
      {value: 'sold',        label: '売却済み', color: 'blue'},
      {value: 'parted_out',  label: '素材化',   color: 'deep-purple'},
    ],
    statusLabelMap: {
      backlog: '積み', in_progress: '製作中', completed: '完成',
      on_hold: '中断', sold: '売却済み', parted_out: '素材化',
    },
    statusColorMap: {
      backlog: 'orange', in_progress: 'green', completed: 'teal',
      on_hold: 'grey', sold: 'blue', parted_out: 'deep-purple',
    },
  }),

  created() {
    this.loadSummary()
    this.loadTags()
  },

  mounted() {
    if (this.mobile) {
      this.loadItems(this.currentOptions)
    }
  },

  methods: {
    async loadItems(options) {
      this.loading = true
      this.currentOptions = options
      try {
        const params = {page: options.page, page_size: options.itemsPerPage}
        if (this.selectedTagIds.length) {
          params.tags = this.selectedTagIds.join(',')
        }
        if (this.selectedStatus) {
          params.status = this.selectedStatus
        }
        if (options.sortBy && options.sortBy.length) {
          const {key, order} = options.sortBy[0]
          params.ordering = order === 'desc' ? `-${key}` : key
        }
        const res = await userApi.kits(this.username, params)
        this.serverItems = res.data.results ?? res.data
        this.totalItems = res.data.count ?? res.data.length
      } catch {
        toaster.error('データの取得に失敗しました')
      } finally {
        this.loading = false
      }
    },

    async loadTags() {
      try {
        const res = await tagsApi.list()
        this.availableTags = res.data.results ?? res.data
      } catch {
        toaster.error('タグの取得に失敗しました')
      }
    },

    formatPrice(val) {
      return (val ?? 0).toLocaleString('ja-JP')
    },

    async loadSummary() {
      this.summaryLoading = true
      try {
        const res = await userApi.summary(this.username)
        this.summary = res.data
      } catch {
        toaster.error('サマリーの取得に失敗しました')
      } finally {
        this.summaryLoading = false
      }
    },

    daysColor(days) {
      if (days < 30) return 'success'
      if (days < 90) return 'warning'
      return 'error'
    },

    onFilterChange() {
      this.loadItems({...this.currentOptions, page: 1})
    },
  },
}
</script>

<style scoped>
.filter-scroll {
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}

.filter-scroll :deep(.v-slide-group__content) {
  flex-wrap: nowrap;
}
</style>
