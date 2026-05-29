<template>
  <header>
    <v-breadcrumbs :items="[
        {title: 'home', to: {name: 'home'}},
        {title: `${username}さんの積みリスト`, to: {name: 'user_stock', params: {username}}},
        {title: details?.name || '...', disabled: true},
    ]"/>
  </header>

  <main>
    <v-container v-if="loading">
      <v-row justify="center">
        <v-col cols="auto">
          <v-progress-circular indeterminate color="primary"/>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="details">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
              v-if="details.image"
              :src="details.image"
              :alt="details.name"
              height="300"
              class="bg-grey-lighten-3 rounded"
          />
          <div
              v-else
              class="bg-grey-lighten-3 rounded d-flex align-center justify-center"
              style="height:200px"
          >
            <v-icon size="64" color="grey">mdi-image-off</v-icon>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <v-card flat>
            <v-card-title class="text-h5">{{ details.name }}</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-factory</v-icon>
                  </template>
                  <v-list-item-title>メーカー</v-list-item-title>
                  <v-list-item-subtitle>{{ details.maker_name }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-tag-outline</v-icon>
                  </template>
                  <v-list-item-title>ブランド</v-list-item-title>
                  <v-list-item-subtitle>{{ details.brand_name }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-ruler</v-icon>
                  </template>
                  <v-list-item-title>スケール</v-list-item-title>
                  <v-list-item-subtitle>{{ details.scale_size }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-currency-jpy</v-icon>
                  </template>
                  <v-list-item-title>価格</v-list-item-title>
                  <v-list-item-subtitle>¥{{ formattedPrice }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <div class="mt-3">
                <div class="text-body-2 text-medium-emphasis mb-1">タグ</div>
                <template v-if="details.tags && details.tags.length">
                  <v-chip
                      v-for="tag in details.tags"
                      :key="tag.id"
                      size="small"
                      color="primary"
                      variant="tonal"
                      class="mr-1 mb-1"
                  >
                    {{ tag.name }}
                  </v-chip>
                </template>
                <span v-else class="text-medium-emphasis text-body-2">なし</span>
              </div>

              <div class="mt-3">
                <div class="text-body-2 text-medium-emphasis mb-1">ステータス</div>
                <v-chip
                    v-if="details.status"
                    size="small"
                    :color="statusColorMap[details.status]"
                    variant="tonal"
                >
                  {{ statusLabelMap[details.status] }}
                </v-chip>
                <span v-else class="text-medium-emphasis text-body-2">なし</span>
              </div>

              <div v-if="details.description" class="mt-3">
                <div class="text-body-2 text-medium-emphasis mb-1">説明</div>
                <p class="text-body-1">{{ details.description }}</p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  prepend-icon="mdi-arrow-left"
                  variant="text"
                  :to="{name: 'user_stock', params: {username}}"
              >
                一覧に戻る
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else>
      <v-alert type="error">キットが見つかりませんでした。</v-alert>
    </v-container>
  </main>
</template>

<script>
import {userApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

export default {
  props: {
    username: {type: String, required: true},
    id: {type: [String, Number], required: true},
  },

  computed: {
    formattedPrice() {
      if (this.details?.price == null) return ''
      return Number(this.details.price).toLocaleString('ja-JP')
    },
  },

  data: () => ({
    details: null,
    loading: true,
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
    this.fetchKit()
  },

  methods: {
    async fetchKit() {
      this.loading = true
      try {
        const res = await userApi.kit(this.username, this.id)
        this.details = res.data
      } catch {
        toaster.error('データの取得に失敗しました')
        this.details = null
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
