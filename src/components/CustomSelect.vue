<template>
    <div class="relative">
        <div class="cursor-pointer inline-block" @click="show = !show">
          <div class="absolute bg-caret bg-white h-10 rounded-full w-10" :class="show ? 'rotate-180': ''"></div>
          <span class="bg-white h-10 inline-block leading-10 pl-14 pr-4 rounded-full">{{ modelValue }}</span>
        </div>

        <div v-show="show">
          <div v-for="(option, i) in options" :key="`option_${i}`">
            <div class="flex group leading-10">
              <div @click="$emit('update:modelValue', option); show = false" class="flex" :class="[ option === modelValue ? 'bg-white rounded-full' : '']">
                <div class="cursor-pointer h-10 rounded-full w-10" :class="[ option === modelValue ? 'bg-black' : 'group-hover:bg-white' ]"></div>
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
    props: ['modelValue', 'options', 'selected'],
    data() {
        return {
            show: false,
        }
    }
}
</script>