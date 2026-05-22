import {ref, computed} from 'vue'
import {defineStore} from 'pinia'

export const pmmApiStore = defineStore(
    'pmmStore', () => {
        const pmm_api = ref(null)
        const itemsPerPage = ref(null)

        function store_reset() {
            pmm_api.value = null
        }

        return {pmm_api, store_reset}
    })
