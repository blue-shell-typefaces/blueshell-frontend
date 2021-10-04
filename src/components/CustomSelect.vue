<template>
    <div class="relative">
        <div class="cursor-pointer inline-block" @click="show = !show">
          <div class="absolute bg-white h-10 rounded-full w-10">
            <div :class="!show ? 'transform rotate-180': ''" class="w-full h-full">
              <span class="absolute border-l-1 border-t-1 border-black h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
            </div>
          </div>

          <span class="bg-white h-10 inline-block leading-10 pl-12 pr-4 rounded-full">{{ value }}</span>
        </div>

        <div v-show="show">
          <div v-for="(option, i) in options" :key="`option_${i}`">
            <div class="flex group leading-10">
              <div @click="$emit('input', option); show = false" class="flex" :class="[ option === value ? 'bg-white rounded-full' : '']">
                <div class="cursor-pointer h-10 rounded-full w-10" :class="[ option === value ? 'bg-black' : 'group-hover:bg-white' ]"></div>
                <div class="bg-white cursor-pointer px-4 rounded-full">{{ option }}</div>
              </div>
            </div>
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