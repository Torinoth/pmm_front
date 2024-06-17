<script setup>

</script>

<template>
  <header>
    <v-breadcrumbs
        :items="['home','積みリスト']"
  ></v-breadcrumbs>
  </header>

  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      item-value="name"
      @update:options="loadItems"
  ></v-data-table-server>
</template>

<script>
const desserts = [
  {
    name: 'Frozen Yogurt',
    purchase_date: '2024/06/17',
    elapsed_days: 6.0,
  },
  {
    name: 'Jelly bean',
    purchase_date: '2024/06/16',
    elapsed_days: 0.0,
  },
  {
    name: 'KitKat',
    purchase_date: '2024/06/17',
    elapsed_days: 26.0,
  },
  {
    name: 'Eclair',
    purchase_date: '2024/06/17',
    elapsed_days: 16.0,
  },
  {
    name: 'Gingerbread',
    purchase_date: '2024/06/17',
    elapsed_days: 16.0,
  },
  {
    name: 'Ice cream sandwich',
    purchase_date: '2024/06/17',
    elapsed_days: 9.0,
  },
  {
    name: 'Lollipop',
    purchase_date: '2024/06/17',
    elapsed_days: 0.2,
  },
  {
    name: 'Cupcake',
    purchase_date: '2024/06/17',
    elapsed_days: 3.7,
  },
  {
    name: 'Honeycomb',
    purchase_date: '2024/06/17',
    elapsed_days: 3.2,
  },
  {
    name: 'Donut',
    purchase_date: '2024/06/17',
    elapsed_days: 25.0,
  },
]

const FakeAPI = {
  async fetch({page, itemsPerPage, sortBy}) {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        const items = desserts.slice()

        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          items.sort((a, b) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }

        const paginated = items.slice(start, end)

        resolve({items: paginated, total: items.length})
      }, 500)
    })
  },
}

export default {
  data: () => ({
    itemsPerPage: 5,
    headers: [
      {
        title: '商品名',
        align: 'start',
        sortable: false,
        key: 'name',
      },
      {title: '購入日', key: 'purchase_date', align: 'end'},
      {title: '経過日数', key: 'elapsed_days', align: 'end'},
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
  }),
  methods: {
    loadItems({page, itemsPerPage, sortBy}) {
      this.loading = true
      FakeAPI.fetch({page, itemsPerPage, sortBy}).then(
          ({items, total}) => {
            this.serverItems = items
            this.totalItems = total
            this.loading = false
          }
      )
    },
  },
}
</script>