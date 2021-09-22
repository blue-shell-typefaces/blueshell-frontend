<template>
    <div class="relative">
        <div class="cursor-pointer inline-block" @click="show = !show">
          <div class="absolute bg-black h-10 rounded-full w-10">    
            <div :class="!show ? 'transform rotate-180': ''" class="w-full h-full">
              <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
            </div>
          </div>

          <span class="bg-white h-10 inline-block leading-10 pl-12 pr-4 rounded-full">{{ family.name }} {{ name }}</span>
        </div>

        <div v-show="show">
          <div class="group" v-for="instance in preset" :key="instance.name">
            <span class="relative" @click="callback(instance)">
              <button class="absolute bg-black h-10 rounded-full w-10" v-show="cart.includes(instance)"></button>

              <span class="bg-white cursor-pointer h-10 inline-block leading-10 rounded-full" :class="[cart.includes(instance) ? 'pl-12' : 'bg-white ml-8 pl-4']">{{ instance.name }} <span class="h-10 inline-block leading-10 rounded-full text-center w-10">&euro;{{ family.stylePrice }}</span></span>
            </span>
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