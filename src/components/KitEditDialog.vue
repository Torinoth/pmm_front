<template>
  <v-dialog
      :model-value="modelValue"
      max-width="600"
      persistent
      @update:model-value="val => !val && close()"
  >
    <v-card>
      <v-card-title>{{ form.id ? 'キット編集' : 'キット登録' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
              v-model="form.name"
              label="キット名"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-select
              v-model="form.brand"
              :items="brands"
              item-title="name"
              item-value="id"
              label="ブランド"
              :loading="mastersLoading"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-select
              v-model="form.scale"
              :items="scales"
              item-title="size"
              item-value="id"
              label="スケール"
              :loading="mastersLoading"
              :rules="[v => !!v || '必須項目です']"
              required
          />
          <v-text-field
              v-model="form.price"
              label="価格（円）"
              type="number"
              :rules="[v => (v !== null && v !== '') || '必須項目です']"
              required
          />
          <tag-input v-model="form.tag_ids"/>

          <v-select
              v-model="form.status"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              label="ステータス"
              :rules="[v => !!v || '必須項目です']"
              required
              class="mt-2"
          />

          <v-file-input
              v-model="form.imageFile"
              label="キット画像"
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              clearable
              class="mt-2"
              :hint="form.currentImageUrl && !form.imageFile ? '新しい画像を選択すると上書きされます' : ''"
              persistent-hint
          />
          <v-img
              v-if="imagePreviewUrl"
              :src="imagePreviewUrl"
              max-height="140"
              cover
              class="rounded mt-2"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn variant="text" @click="close">キャンセル</v-btn>
        <v-btn color="primary" :loading="saving" @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {kitsApi, brandsApi, scalesApi} from '@/api/index.js'
import TagInput from '@/components/TagInput.vue'
import toaster from '@/plugins/Toaster.js'

const emptyForm = () => ({
  id: null,
  name: '',
  brand: null,
  scale: null,
  price: '',
  tag_ids: [],
  status: 'backlog',
  imageFile: null,
  currentImageUrl: '',
})

export default {
  components: {TagInput},

  props: {
    modelValue: {type: Boolean, required: true},
    kit: {type: Object, default: null},
  },

  emits: ['update:modelValue', 'saved'],

  computed: {
    imagePreviewUrl() {
      const f = this.form.imageFile
      if (f instanceof File) return URL.createObjectURL(f)
      return this.form.currentImageUrl || null
    },
  },

  data: () => ({
    form: emptyForm(),
    brands: [],
    scales: [],
    mastersLoading: false,
    saving: false,
    statusOptions: [
      {value: 'backlog',     label: '積み'},
      {value: 'in_progress', label: '製作中'},
      {value: 'completed',   label: '完成'},
      {value: 'on_hold',     label: '中断'},
      {value: 'sold',        label: '売却済み'},
      {value: 'parted_out',  label: '素材化'},
    ],
  }),

  watch: {
    modelValue(val) {
      if (val) {
        this.initForm()
        this.loadMasters()
      }
    },
  },

  methods: {
    initForm() {
      if (this.kit) {
        this.form = {
          id: this.kit.id,
          name: this.kit.name,
          brand: this.kit.brand,
          scale: this.kit.scale,
          price: this.kit.price,
          tag_ids: (this.kit.tags ?? []).map(t => t.id),
          status: this.kit.status ?? 'backlog',
          imageFile: null,
          currentImageUrl: this.kit.image || '',
        }
      } else {
        this.form = emptyForm()
      }
    },

    async loadMasters() {
      this.mastersLoading = true
      try {
        const [brRes, scRes] = await Promise.all([
          brandsApi.list(),
          scalesApi.list(),
        ])
        this.brands = brRes.data.results ?? brRes.data
        this.scales = scRes.data.results ?? scRes.data
      } catch {
        toaster.error('マスターデータの取得に失敗しました')
      } finally {
        this.mastersLoading = false
      }
    },

    close() {
      this.$emit('update:modelValue', false)
    },

    async save() {
      const valid = await this.$refs.formRef?.validate()
      if (!valid?.valid) return
      this.saving = true
      try {
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('brand', this.form.brand)
        formData.append('scale', this.form.scale)
        formData.append('price', this.form.price)
        formData.append('status', this.form.status)
        if (this.form.imageFile instanceof File) {
          formData.append('image', this.form.imageFile)
        }
        this.form.tag_ids.forEach(id => formData.append('tag_ids', id))

        if (this.form.id) {
          await kitsApi.update(this.form.id, formData)
          toaster.success('キットを更新しました')
        } else {
          await kitsApi.create(formData)
          toaster.success('キットを登録しました')
        }
        this.close()
        this.$emit('saved')
      } catch {
        toaster.error('保存に失敗しました')
      } finally {
        this.saving = false
      }
    },
  },
}
</script>
