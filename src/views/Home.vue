<template>
  <div class="bg-homepage h-full p-4">
    <div class="flex justify-between">
      <Menu />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'

export default {
  name: 'Home',
  components: {
    Menu
  }
}
</script>
