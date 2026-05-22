<script setup>
import {ref, watch, onMounted} from 'vue'
import {tagsApi} from '@/api/index.js'

const props = defineProps({
  modelValue: {type: Array, default: () => []},
})
const emit = defineEmits(['update:modelValue'])

const availableTags = ref([])
const selectedTags = ref([])

onMounted(async () => {
  await loadTags()
})

async function loadTags() {
  const res = await tagsApi.list()
  availableTags.value = res.data.results ?? res.data
  syncFromIds()
}

function syncFromIds() {
  selectedTags.value = availableTags.value.filter(t => props.modelValue.includes(t.id))
}

watch(() => props.modelValue, () => syncFromIds())

async function onUpdate(val) {
  const newObjects = []
  for (const item of val) {
    if (typeof item === 'string') {
      const existing = availableTags.value.find(t => t.name === item)
      if (existing) {
        newObjects.push(existing)
      } else {
        const res = await tagsApi.create({name: item})
        availableTags.value.push(res.data)
        newObjects.push(res.data)
      }
    } else if (item && item.id) {
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
