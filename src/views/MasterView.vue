<template>
  <header>
    <v-breadcrumbs :items="[
        {title: 'home', to: {name: 'home'}},
        {title: 'マスタ管理', disabled: true},
    ]"/>
  </header>

  <v-container fluid>
    <v-tabs v-model="activeTab" class="mb-4">
      <v-tab value="makers">メーカー</v-tab>
      <v-tab value="brands">ブランド</v-tab>
      <v-tab value="scales">スケール</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- ===== メーカー ===== -->
      <v-window-item value="makers">
        <v-row justify="end" class="mb-2">
          <v-col cols="auto">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog('maker')">
              メーカー追加
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
            :headers="makerHeaders"
            :items="makers"
            :loading="loading"
            item-value="id"
        >
          <template #[`item.actions`]="{ item }">
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog('maker', item)"/>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteDialog('maker', item)"/>
          </template>
        </v-data-table>
      </v-window-item>

      <!-- ===== ブランド ===== -->
      <v-window-item value="brands">
        <v-row justify="end" class="mb-2">
          <v-col cols="auto">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog('brand')">
              ブランド追加
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
            :headers="brandHeaders"
            :items="brands"
            :loading="loading"
            item-value="id"
        >
          <template #[`item.actions`]="{ item }">
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog('brand', item)"/>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteDialog('brand', item)"/>
          </template>
        </v-data-table>
      </v-window-item>

      <!-- ===== スケール ===== -->
      <v-window-item value="scales">
        <v-row justify="end" class="mb-2">
          <v-col cols="auto">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog('scale')">
              スケール追加
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
            :headers="scaleHeaders"
            :items="scales"
            :loading="loading"
            item-value="id"
        >
          <template #[`item.actions`]="{ item }">
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog('scale', item)"/>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteDialog('scale', item)"/>
          </template>
        </v-data-table>
      </v-window-item>
    </v-window>
  </v-container>

  <!-- 削除確認ダイアログ -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>削除の確認</v-card-title>
      <v-card-text>
        「{{ deleteTarget?.name ?? deleteTarget?.size }}」を削除しますか？この操作は取り消せません。
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="deleteDialog = false">キャンセル</v-btn>
        <v-btn color="error" @click="confirmDelete">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 登録・編集ダイアログ -->
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <template v-if="dialogType === 'maker'">
            <v-text-field
                v-model="editedItem.name"
                label="メーカー名"
                :rules="[v => !!v || '必須項目です']"
                required
            />
            <v-text-field v-model="editedItem.image" label="画像URL" clearable/>
            <v-textarea v-model="editedItem.description" label="説明" rows="3" clearable/>
          </template>

          <template v-else-if="dialogType === 'brand'">
            <v-text-field
                v-model="editedItem.name"
                label="ブランド名"
                :rules="[v => !!v || '必須項目です']"
                required
            />
            <v-select
                v-model="editedItem.maker"
                :items="makers"
                item-title="name"
                item-value="id"
                label="メーカー"
                :rules="[v => !!v || '必須項目です']"
                required
            />
            <v-text-field v-model="editedItem.image" label="画像URL" clearable/>
            <v-textarea v-model="editedItem.description" label="説明" rows="3" clearable/>
          </template>

          <template v-else-if="dialogType === 'scale'">
            <v-text-field
                v-model="editedItem.size"
                label="スケール（例: 1/35）"
                :rules="[v => !!v || '必須項目です']"
                required
            />
            <v-textarea v-model="editedItem.description" label="説明" rows="3" clearable/>
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="dialog = false">キャンセル</v-btn>
        <v-btn color="primary" :loading="saving" @click="saveItem">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {makersApi, brandsApi, scalesApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

const defaultItems = {
  maker: {id: null, name: '', image: '', description: ''},
  brand: {id: null, name: '', maker: null, image: '', description: ''},
  scale: {id: null, size: '', description: ''},
}

const typeLabels = {maker: 'メーカー', brand: 'ブランド', scale: 'スケール'}
const typeApis = {maker: makersApi, brand: brandsApi, scale: scalesApi}

export default {
  data: () => ({
    activeTab: 'makers',
    loading: false,

    makers: [],
    makerHeaders: [
      {title: 'メーカー名', key: 'name', align: 'start'},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],

    brands: [],
    brandHeaders: [
      {title: 'ブランド名', key: 'name', align: 'start'},
      {title: 'メーカー', key: 'maker_name', align: 'start'},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],

    scales: [],
    scaleHeaders: [
      {title: 'スケール', key: 'size', align: 'start'},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],

    dialog: false,
    dialogType: null,
    editedItem: {},
    saving: false,

    deleteDialog: false,
    deleteTarget: null,
    deleteType: null,
  }),

  computed: {
    dialogTitle() {
      const label = typeLabels[this.dialogType] ?? ''
      return `${label}${this.editedItem?.id ? '編集' : '追加'}`
    },
  },

  created() {
    this.loadAll()
  },

  methods: {
    async loadAll() {
      this.loading = true
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
        toaster.error('データの取得に失敗しました')
      } finally {
        this.loading = false
      }
    },

    openCreateDialog(type) {
      this.dialogType = type
      this.editedItem = {...defaultItems[type]}
      this.dialog = true
    },

    openEditDialog(type, item) {
      this.dialogType = type
      this.editedItem = {...item}
      this.dialog = true
    },

    async saveItem() {
      const valid = await this.$refs.formRef?.validate()
      if (!valid?.valid) return
      this.saving = true
      const {id, maker_name, ...data} = this.editedItem
      try {
        if (id) {
          await typeApis[this.dialogType].update(id, data)
          toaster.success(`${typeLabels[this.dialogType]}を更新しました`)
        } else {
          await typeApis[this.dialogType].create(data)
          toaster.success(`${typeLabels[this.dialogType]}を登録しました`)
        }
        this.dialog = false
        await this.loadAll()
      } catch {
        toaster.error('保存に失敗しました')
      } finally {
        this.saving = false
      }
    },

    openDeleteDialog(type, item) {
      this.deleteType = type
      this.deleteTarget = item
      this.deleteDialog = true
    },

    async confirmDelete() {
      this.deleteDialog = false
      try {
        await typeApis[this.deleteType].destroy(this.deleteTarget.id)
        toaster.success(`${typeLabels[this.deleteType]}を削除しました`)
        await this.loadAll()
      } catch {
        toaster.error('削除に失敗しました')
      } finally {
        this.deleteTarget = null
        this.deleteType = null
      }
    },
  },
}
</script>
