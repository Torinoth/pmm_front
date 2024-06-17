<script setup>

</script>

<template>
  <header>
    <v-breadcrumbs
        :items="['home','積みリスト','商品ページ']"
    ></v-breadcrumbs>
    {{ serverItems }}
  </header>
  <main>
    <v-container>
      <v-row>
        <v-col cols="6">
          <img src="" alt="なにか">
        </v-col>
        <v-col cols="6">
          <p>name: {{ details.name }}</p>
          <p>Purchase Date: {{ details.purchase_date }}</p>
          <p>Maker: {{ details.maker }}</p>
          <p>Brand: {{ details.brand }}</p>
          <p>Price: {{ details.price }}</p>
        </v-col>
      </v-row>
    </v-container>
  </main>


</template>

<script>
import {pmmApiStore} from "@/stores/pmm_store.js"

export default {
  data: () => ({
    pmmApi: pmmApiStore(),
    details: {
      id: 1,
      name: 'Frozen Yogurt',
      purchase_date: '2024/06/17',
      image: null,
      maker: 'maker',
      brand: 'brand',
      price: '1000',
    },
  }),
  methods: {

    setServerItems() {
      this.serverItems = this.details;
    },
    // async details(team_id) {
    //   await axios.get('http://localhost:8000/api/dcode/' + id)
    //       .then(response => {
    //         // Use this data in your application
    //         this.dcodeResponseData = response.data;
    //       })
    //       .catch(error => {
    //         console.error(error);
    //       });
    // },
  },
  created() {
    this.setServerItems();
  },
}
</script>