<template>
    <div class="relative">
        <div class="cursor-pointer inline-block" @click="show = !show">
          <div class="absolute bg-black h-10 rounded-full w-10">    
            <div :class="!show ? 'transform rotate-180': ''" class="w-full h-full">
              <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
            </div>
          </div>

          <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">{{ family.name }} {{ name }}</span>
        </div>

        <div v-show="show">
          <div class="group" v-for="instance in preset" :key="instance.name">
            <span class="relative" @click="callback(instance)">
              <button class="absolute bg-black h-10 rounded-full w-10" v-show="cart.includes(instance)">
                <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
              </button>

              <span class="cursor-pointer h-10 inline-block leading-10 pr-4 rounded-full" :class="[cart.includes(instance) ? 'bg-blue pl-12' : 'bg-beige ml-8 pl-4']">{{ instance.name }}</span>
            </span>
            <span class="hidden group-hover:inline px-2">&euro;{{ family.stylePrice }}</span>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FamilyPreset',
    props: ['family', 'preset', 'name', 'callback', 'cart'],
    data() {
        return {
            show: false,
        }
    }
}
</script>