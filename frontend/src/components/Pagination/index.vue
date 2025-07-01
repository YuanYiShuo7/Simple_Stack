<template>
  <div class="pagination">
    <button 
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="pagination-button"
    >
      上一页
    </button>
    
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: page === currentPage }"
      class="pagination-button"
    >
      {{ page }}
    </button>
    
    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      class="pagination-button"
    >
      下一页
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    maxVisibleButtons: {
      type: Number,
      default: 5
    }
  },
  emits: ['page-changed'],
  setup(props, { emit }) {
    const totalPages = computed(() => 
      Math.ceil(props.totalItems / props.itemsPerPage)
    )

    const pages = computed(() => {
      const range = []
      const half = Math.floor(props.maxVisibleButtons / 2)
      let start = Math.max(props.currentPage - half, 1)
      const end = Math.min(start + props.maxVisibleButtons - 1, totalPages.value)
      
      if (end - start + 1 < props.maxVisibleButtons) {
        start = Math.max(end - props.maxVisibleButtons + 1, 1)
      }

      for (let i = start; i <= end; i++) {
        range.push(i)
      }

      return range
    })

    const changePage = (page: number) => {
      if (page < 1 || page > totalPages.value) return
      emit('page-changed', page)
    }

    return {
      totalPages,
      pages,
      changePage
    }
  }
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
}

.pagination-button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:hover:not(:disabled) {
  background: #f0f0f0;
}

.pagination-button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>