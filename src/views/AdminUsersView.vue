<template>
  <header>
    <v-breadcrumbs :items="[
        {title: 'home', to: {name: 'home'}},
        {title: 'ユーザー管理', disabled: true},
    ]"/>
  </header>

  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h2 class="text-h6">ユーザー管理</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn icon="mdi-refresh" variant="text" @click="loadUsers"/>
      </v-col>
    </v-row>

    <!-- 承認待ち -->
    <div class="text-body-2 text-medium-emphasis mb-2">承認待ち</div>
    <v-data-table
        :headers="pendingHeaders"
        :items="pendingUsers"
        :loading="loading"
        item-value="id"
        class="mb-8"
    >
      <template #[`item.date_joined`]="{ item }">
        {{ formatDate(item.date_joined) }}
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn
            color="success"
            size="small"
            variant="tonal"
            prepend-icon="mdi-check"
            :loading="actioningId === item.id"
            @click="approve(item)"
        >
          承認
        </v-btn>
      </template>
      <template #no-data>
        <span class="text-medium-emphasis">承認待ちのユーザーはいません</span>
      </template>
    </v-data-table>

    <!-- 承認済みユーザー（アクティブ＋停止中） -->
    <div class="text-body-2 text-medium-emphasis mb-2">承認済みユーザー</div>
    <v-data-table
        :headers="approvedHeaders"
        :items="approvedUsers"
        :loading="loading"
        item-value="id"
    >
      <template #[`item.is_staff`]="{ item }">
        <v-chip v-if="item.is_staff" color="primary" size="x-small" variant="tonal">管理者</v-chip>
        <span v-else class="text-medium-emphasis text-body-2">一般</span>
      </template>
      <template #[`item.is_active`]="{ item }">
        <v-chip v-if="item.is_active" color="success" size="x-small" variant="tonal">有効</v-chip>
        <v-chip v-else color="warning" size="x-small" variant="tonal">停止中</v-chip>
      </template>
      <template #[`item.date_joined`]="{ item }">
        {{ formatDate(item.date_joined) }}
      </template>
      <template #[`item.actions`]="{ item }">
        <!-- 管理者自身には操作ボタンを表示しない -->
        <template v-if="item.id !== authStore.user?.id">
          <v-btn
              v-if="item.is_active"
              size="small"
              variant="text"
              color="warning"
              icon="mdi-account-off"
              :loading="actioningId === item.id"
              title="停止"
              @click="suspend(item)"
          />
          <v-btn
              v-else
              size="small"
              variant="text"
              color="success"
              icon="mdi-account-check"
              :loading="actioningId === item.id"
              title="再開"
              @click="reactivate(item)"
          />
          <v-btn
              size="small"
              variant="text"
              color="error"
              icon="mdi-delete"
              title="削除"
              @click="openDeleteDialog(item)"
          />
        </template>
      </template>
      <template #no-data>
        <span class="text-medium-emphasis">ユーザーがいません</span>
      </template>
    </v-data-table>
  </v-container>

  <!-- 削除確認ダイアログ -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>削除の確認</v-card-title>
      <v-card-text>
        「{{ userToDelete?.username }}」を削除しますか？この操作は取り消せません。
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn variant="text" @click="deleteDialog = false">キャンセル</v-btn>
        <v-btn color="error" :loading="actioningId === userToDelete?.id" @click="confirmDelete">
          削除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthStore} from '@/stores/auth.js'
import {authApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

export default {
  computed: {
    ...mapStores(useAuthStore),
    pendingUsers() {
      // 一度もログインしていない非アクティブユーザー = 承認待ち
      return this.users.filter(u => !u.is_active && !u.last_login)
    },
    approvedUsers() {
      // ログイン歴あり（アクティブ or 停止中）= 承認済み
      return this.users.filter(u => u.is_active || u.last_login)
    },
  },

  data: () => ({
    users: [],
    loading: false,
    actioningId: null,
    deleteDialog: false,
    userToDelete: null,
    pendingHeaders: [
      {title: 'ユーザー名', key: 'username', align: 'start'},
      {title: '登録日', key: 'date_joined', align: 'start'},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],
    approvedHeaders: [
      {title: 'ユーザー名', key: 'username', align: 'start'},
      {title: '権限', key: 'is_staff', align: 'start'},
      {title: 'ステータス', key: 'is_active', align: 'start'},
      {title: '登録日', key: 'date_joined', align: 'start'},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],
  }),

  created() {
    this.loadUsers()
  },

  methods: {
    formatDate(val) {
      return val ? new Date(val).toLocaleDateString('ja-JP') : '-'
    },

    async loadUsers() {
      this.loading = true
      try {
        const res = await authApi.users()
        this.users = res.data
      } catch {
        toaster.error('ユーザー一覧の取得に失敗しました')
      } finally {
        this.loading = false
      }
    },

    async approve(user) {
      this.actioningId = user.id
      try {
        await authApi.approveUser(user.id)
        toaster.success(`${user.username} を承認しました`)
        await this.loadUsers()
      } catch {
        toaster.error('承認に失敗しました')
      } finally {
        this.actioningId = null
      }
    },

    async suspend(user) {
      this.actioningId = user.id
      try {
        await authApi.suspendUser(user.id)
        toaster.success(`${user.username} を停止しました`)
        await this.loadUsers()
      } catch (e) {
        toaster.error(e.response?.data?.detail ?? '停止に失敗しました')
      } finally {
        this.actioningId = null
      }
    },

    async reactivate(user) {
      this.actioningId = user.id
      try {
        await authApi.approveUser(user.id)
        toaster.success(`${user.username} を再開しました`)
        await this.loadUsers()
      } catch {
        toaster.error('再開に失敗しました')
      } finally {
        this.actioningId = null
      }
    },

    openDeleteDialog(user) {
      this.userToDelete = user
      this.deleteDialog = true
    },

    async confirmDelete() {
      this.actioningId = this.userToDelete.id
      const username = this.userToDelete.username
      try {
        await authApi.deleteUser(this.userToDelete.id)
        toaster.success(`${username} を削除しました`)
        this.deleteDialog = false
        this.userToDelete = null
        await this.loadUsers()
      } catch (e) {
        toaster.error(e.response?.data?.detail ?? '削除に失敗しました')
      } finally {
        this.actioningId = null
      }
    },
  },
}
</script>
