<template>
  <div class="about">


    <div v-for="post in posts" :key="post.id">
      {{ post.purchase_date }}


    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script>
import axios from 'axios';

import {useStore} from "pinia";
import {pmmApiStore} from "@/stores/pmm_store.js";

export default {
  setup(){
  const store = useStore(pmmApiStore);
  },

  data() {
    return {
      posts: []
    }
  },
  created() {
    this.getPosts()
  },
  methods: {
    async getPosts() {
      const response = await axios.get('http://127.0.0.1:8000/api/products/?format=json')
      this.posts = response.data
    }
  },
  computed: {}
}

</script>