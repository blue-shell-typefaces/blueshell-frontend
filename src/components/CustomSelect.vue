<template>
    <div class="relative">
        <div class="cursor-pointer inline-block" @click="show = !show">
          <div class="absolute bg-black h-10 rounded-full w-10">    
            <div :class="!show ? 'transform rotate-180': ''" class="w-full h-full">
              <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
            </div>
          </div>

          <span class="bg-white h-10 inline-block leading-10 pl-12 pr-4 rounded-full">{{ value }}</span>
        </div>

        <div v-show="show">
          <div v-for="(option, i) in options" :key="`option_${i}`">
            <span class="relative" @click="$emit('input', option); show = false">
              <button class="absolute bg-black h-10 rounded-full w-10" v-show="option === value"></button>

              <span class="bg-white cursor-pointer h-10 inline-block leading-10 pr-4 rounded-full" :class="[option === value ? 'pl-12' : 'ml-8 pl-4']">{{ option }}</span>
            </span>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomSelect',
    props: ['value', 'options', 'selected'],
    data() {
        return {
            show: false,
        }
    }
}
</script>