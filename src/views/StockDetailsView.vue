<template>
  <header>
    <v-breadcrumbs :items="['home', '積みリスト', details.name || '...']"/>
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
              :src="details.image || ''"
              height="300"
              cover
              class="bg-grey-lighten-3 rounded"
          >
            <template #placeholder>
              <v-row align="center" justify="center" class="fill-height">
                <v-icon size="64" color="grey">mdi-image-off</v-icon>
              </v-row>
            </template>
          </v-img>
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
                  <v-list-item-subtitle>¥{{ details.price }}</v-list-item-subtitle>
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

              <div v-if="details.description" class="mt-3">
                <div class="text-body-2 text-medium-emphasis mb-1">説明</div>
                <p class="text-body-1">{{ details.description }}</p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="$router.back()">
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
import {kitsApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

export default {
  props: {
    id: {type: [String, Number], required: true},
  },

  data: () => ({
    details: null,
    loading: true,
  }),

  created() {
    this.fetchKit()
  },

  methods: {
    async fetchKit() {
      this.loading = true
      try {
        const res = await kitsApi.retrieve(this.id)
        this.details = res.data
      } catch (e) {
        toaster.error('データの取得に失敗しました')
        this.details = null
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
