<template>
  <div class="h-full p-4">
    <div class="flex justify-between">
      <Menu />
    </div>
    About page
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'

export default {
  name: 'About',
  components: {
    Menu
  }
}
</script>
