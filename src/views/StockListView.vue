<template>
  <header>
    <v-breadcrumbs :items="['home', '積みリスト']"/>
  </header>

  <!-- タグフィルター -->
  <v-container fluid class="pb-0">
    <v-row align="center">
      <v-col cols="auto">
        <span class="text-body-2 text-medium-emphasis">タグで絞り込み：</span>
      </v-col>
      <v-col>
        <v-chip-group v-model="selectedTagIds" multiple @update:model-value="onTagFilterChange">
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
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
          キット登録
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- データテーブル -->
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
  >
    <template #[`item.name`]="{ item }">
      <router-link :to="`/stock-details/${item.id}`">{{ item.name }}</router-link>
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
    <template #[`item.actions`]="{ item }">
      <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog(item)"/>
      <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteDialog(item)"/>
    </template>
  </v-data-table-server>

  <!-- 削除確認ダイアログ -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>削除の確認</v-card-title>
      <v-card-text>
        「{{ kitToDelete?.name }}」を削除しますか？この操作は取り消せません。
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="deleteDialog = false">キャンセル</v-btn>
        <v-btn color="error" @click="confirmDeleteKit">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 登録・編集ダイアログ -->
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title>{{ editedKit.id ? 'キット編集' : 'キット登録' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
              v-model="editedKit.name"
              label="キット名"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-select
              v-model="editedKit.maker"
              :items="makers"
              item-title="name"
              item-value="id"
              label="メーカー"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-select
              v-model="editedKit.brand"
              :items="brands"
              item-title="name"
              item-value="id"
              label="ブランド"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-select
              v-model="editedKit.scale"
              :items="scales"
              item-title="size"
              item-value="id"
              label="スケール"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-text-field
              v-model="editedKit.price"
              label="価格（円）"
              type="number"
              :rules="[v => (v !== null && v !== '') || '必須項目です']"
              required
          />
          <tag-input v-model="editedKit.tag_ids"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="dialog = false">キャンセル</v-btn>
        <v-btn color="primary" :loading="saving" @click="saveKit">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {kitsApi, tagsApi, makersApi, brandsApi, scalesApi} from '@/api/index.js'
import TagInput from '@/components/TagInput.vue'
import toaster from '@/plugins/Toaster.js'

export default {
  components: {TagInput},

  data: () => ({
    itemsPerPage: 10,
    headers: [
      {title: 'キット名', align: 'start', sortable: false, key: 'name'},
      {title: 'スケール', key: 'scale_size', align: 'start', sortable: false},
      {title: '価格', key: 'price', align: 'end', sortable: false},
      {title: 'タグ', key: 'tags', align: 'start', sortable: false},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    currentOptions: {page: 1, itemsPerPage: 10},

    availableTags: [],
    selectedTagIds: [],

    dialog: false,
    saving: false,
    editedKit: {id: null, name: '', maker: null, brand: null, scale: null, price: '', tag_ids: []},
    defaultKit: {id: null, name: '', maker: null, brand: null, scale: null, price: '', tag_ids: []},

    deleteDialog: false,
    kitToDelete: null,

    makers: [],
    brands: [],
    scales: [],
  }),

  created() {
    this.loadTags()
    this.loadMasters()
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
        const res = await kitsApi.list(params)
        this.serverItems = res.data.results ?? res.data
        this.totalItems = res.data.count ?? res.data.length
      } catch (e) {
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

    async loadMasters() {
      try {
        const [mkRes, brRes, scRes] = await Promise.all([
          makersApi.list(),
          brandsApi.list(),
          scalesApi.list(),
        ])
        this.makers = mkRes.data.results ?? mkRes.data
        this.brands = brRes.data.results ?? brRes.data
        this.scales = scRes.data.results ?? scRes.data
      } catch {
        toaster.error('マスターデータの取得に失敗しました')
      }
    },

    onTagFilterChange() {
      this.loadItems({...this.currentOptions, page: 1})
    },

    openCreateDialog() {
      this.editedKit = {...this.defaultKit, tag_ids: []}
      this.dialog = true
    },

    openEditDialog(kit) {
      this.editedKit = {
        id: kit.id,
        name: kit.name,
        maker: kit.maker,
        brand: kit.brand,
        scale: kit.scale,
        price: kit.price,
        tag_ids: kit.tags.map(t => t.id),
      }
      this.dialog = true
    },

    async saveKit() {
      const valid = await this.$refs.formRef?.validate()
      if (!valid?.valid) return
      this.saving = true
      try {
        if (this.editedKit.id) {
          await kitsApi.update(this.editedKit.id, this.editedKit)
          toaster.success('キットを更新しました')
        } else {
          await kitsApi.create(this.editedKit)
          toaster.success('キットを登録しました')
        }
        this.dialog = false
        this.loadItems(this.currentOptions)
      } catch (e) {
        toaster.error('保存に失敗しました')
      } finally {
        this.saving = false
      }
    },

    openDeleteDialog(kit) {
      this.kitToDelete = kit
      this.deleteDialog = true
    },

    async confirmDeleteKit() {
      this.deleteDialog = false
      try {
        await kitsApi.destroy(this.kitToDelete.id)
        toaster.success('キットを削除しました')
        this.loadItems(this.currentOptions)
      } catch {
        toaster.error('削除に失敗しました')
      } finally {
        this.kitToDelete = null
      }
    },
  },
}
</script>
