<script setup>
import {ref, watch, onMounted} from 'vue'
import {tagsApi} from '@/api/index.js'
import toaster from '@/plugins/Toaster.js'

const props = defineProps({
  modelValue: {type: Array, default: () => []},
})
const emit = defineEmits(['update:modelValue'])

const availableTags = ref([])
const selectedTags = ref([])
const creatingNames = new Set()

onMounted(async () => {
  await loadTags()
})

async function loadTags() {
  try {
    const res = await tagsApi.list()
    availableTags.value = res.data.results ?? res.data
    syncFromIds()
  } catch {
    toaster.error('タグの取得に失敗しました')
  }
}

function syncFromIds() {
  selectedTags.value = availableTags.value.filter(t => props.modelValue.includes(t.id))
}

watch(() => props.modelValue, () => syncFromIds())

async function onUpdate(val) {
  const newObjects = []
  for (const item of val) {
    if (typeof item === 'string') {
      const name = item.trim()
      if (!name) continue
      const existing = availableTags.value.find(t => t.name === name)
      if (existing) {
        newObjects.push(existing)
      } else if (!creatingNames.has(name)) {
        creatingNames.add(name)
        try {
          const res = await tagsApi.create({name})
          availableTags.value.push(res.data)
          newObjects.push(res.data)
        } catch {
          const found = availableTags.value.find(t => t.name === name)
          if (found) newObjects.push(found)
          else toaster.error(`タグ「${name}」の作成に失敗しました`)
        } finally {
          creatingNames.delete(name)
        }
      }
    } else if (item?.id) {
      newObjects.push(item)
    }
  }
  selectedTags.value = newObjects
  emit('update:modelValue', newObjects.map(t => t.id))
}
</script>

<template>
  <v-combobox
      :model-value="selectedTags"
      :items="availableTags"
      item-title="name"
      item-value="id"
      label="タグ"
      multiple
      chips
      closable-chips
      return-object
      hint="既存タグを選択するか、新しいタグ名を入力してEnter"
      persistent-hint
      @update:model-value="onUpdate"
  />
</template>
