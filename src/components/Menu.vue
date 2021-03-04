<template>
  <div>
    <div class="flex items-start">
      <router-link class="border-b-1 border-t-1 border-transparent mr-4" to="/">Blue Shell</router-link>
      <div class="relative">
        <ul class="absolute flex flex-col group items-start whitespace-nowrap">
          <li class="bg-gray-100 border-gray-100 border-1 px-3 rounded-full">Typefaces <span class="text-xs">▼</span></li>
          <li class="bg-black border-black border-1 hidden px-3 rounded-full text-white group-hover:block">
            <router-link :to="{ name: 'detail', params: { family: 'chrastina' } }">Chrastina</router-link>
          </li>
          <li class="bg-black border-black border-1 hidden px-3 rounded-full text-white group-hover:block">
            <router-link :to="{ name: 'detail', params: { family: 'zaum' } }">Zaum</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <router-link to="/info">Info</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu'
}
</script>