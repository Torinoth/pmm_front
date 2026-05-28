<template>
  <header>
    <v-breadcrumbs :items="[
        {title: 'home', to: {name: 'home'}},
        {title: '積みリスト', to: {name: 'stock_list'}},
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
              cover
              class="bg-grey-lighten-3 rounded"
          />
          <div
              v-else
              class="bg-grey-lighten-3 rounded d-flex align-center justify-center"
              style="height:300px"
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

              <div v-if="details.description" class="mt-3">
                <div class="text-body-2 text-medium-emphasis mb-1">説明</div>
                <p class="text-body-1">{{ details.description }}</p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="$router.push({ name: 'stock_list' })">
                一覧に戻る
              </v-btn>
              <v-btn
                  v-if="authStore.isAuthenticated"
                  prepend-icon="mdi-pencil"
                  color="primary"
                  variant="tonal"
                  @click="editDialog = true"
              >
                編集
              </v-btn>
              <v-btn
                  v-if="authStore.isAuthenticated && statusAction"
                  :prepend-icon="statusAction.icon"
                  :color="statusAction.color"
                  variant="tonal"
                  :loading="statusChanging"
                  @click="changeStatus(statusAction.targetStatus)"
              >
                {{ statusAction.label }}
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

  <kit-edit-dialog
      v-model="editDialog"
      :kit="details"
      @saved="fetchKit"
  />
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthStore} from '@/stores/auth.js'
import {kitsApi} from '@/api/index.js'
import KitEditDialog from '@/components/KitEditDialog.vue'
import toaster from '@/plugins/Toaster.js'
import toaster from '@/plugins/Toaster.js'

export default {
  components: {KitEditDialog},

  props: {
    id: {type: [String, Number], required: true},
  },

  computed: {
    ...mapStores(useAuthStore),
    formattedPrice() {
      if (this.details?.price == null) return ''
      return Number(this.details.price).toLocaleString('ja-JP')
    },
    statusAction() {
      const map = {
        backlog:     {label: '制作開始', icon: 'mdi-play',    targetStatus: 'in_progress', color: 'green'},
        in_progress: {label: '完成',     icon: 'mdi-check',   targetStatus: 'completed',   color: 'teal'},
        on_hold:     {label: '制作再開', icon: 'mdi-restart', targetStatus: 'in_progress', color: 'green'},
      }
      return map[this.details?.status] ?? null
    },
  },

  data: () => ({
    details: null,
    loading: true,
    editDialog: false,
    statusChanging: false,
  }),

  created() {
    this.fetchKit()
  },

  methods: {
    async changeStatus(targetStatus) {
      this.statusChanging = true
      try {
        const formData = new FormData()
        formData.append('status', targetStatus)
        await kitsApi.update(this.details.id, formData)
        await this.fetchKit()
        toaster.success('ステータスを更新しました')
      } catch {
        toaster.error('ステータスの更新に失敗しました')
      } finally {
        this.statusChanging = false
      }
    },

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
