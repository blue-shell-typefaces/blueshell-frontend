<template>
  <div v-if="family">
    <div class="fixed inset-0 min-h-full"
         :class="[isCartShown ? 'w-3/4' : 'w-full']"
         :style="isDragging ? 'user-select: none;' : ''">
      <div class="left-0 right-0 sticky top-0 w-full z-10">
        <div class="flex justify-between px-4 py-1">
          <Menu />
          <div class="flex leading-10">
            <a href="#" class="hidden lg:block mx-5">About</a>
            <a href="#" class="hidden lg:block mx-5">Characters</a>
            <a href="#" class="hidden lg:block mx-5">Specimen</a>
            <a href="#" class="hidden lg:block mx-5">Trial</a>
            <button class="h-10 leading-10 ml-5 rounded-full w-10" :style="{ background: color, color: background }" @click="showCart" v-show="!isCartShown">Buy</button>
          </div>
        </div>
      </div>
      <Tester :values="axes" :background="background" :color="color" :globalDragging="isDragging" ref="tester" />
      <div class="absolute bottom-0 left-0 mb-2 mx-4 right-0">
        <Slider v-model="axes.wght" @input="sliderChange" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Black'}" :background="color" :color="background"  @start="dragStart" @end="dragEnd" :globalDragging="isDragging" />
        <!-- <Slider v-model="axes.wdth" @input="sliderChange" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Bold'}" :background="color" :color="background" @start="dragStart" @end="dragEnd" :globalDragging="isDragging" /> -->
      </div>
    </div>

    <div class="bg-beige bottom-0 fixed overflow-y-auto pb-4 pt-1 right-0 top-0 w-full lg:w-1/4" v-show="isCartShown">
      <div class="px-4">
        <div class="flex h-10 leading-10 justify-between">
          <span class="uppercase">Buy {{ family.name }}</span>
          <button class="bg-black h-10 relative rounded-full w-10" @click="isCartShown = false">
            <span class="absolute border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
            <span class="absolute border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
          </button>
        </div>

        <div>
          <div class="flex my-2 items-center">
            <div class="border border-black h-10 mr-3 rounded-full w-10"></div>
            <p class="text-xs w-1/2">By dragging the sliders, you have designed your style of {{ family.name }} typeface</p>
          </div>

          <p class="mb-2 mt-4">Your style</p>

          <span class="cursor-pointer" @click="toggleCustom">
            <span :class="[hasCustom ? 'bg-black' : '']" class="h-10 inline-block rounded-full w-10"></span>
            <span class="bg-white h-10 inline-block leading-10 px-4 rounded-full">{{ family.name }} {{ customStyle }} &euro;{{ family.stylePrice }}</span>
          </span>
        </div>

        <p class="mb-2 mt-4">Preset styles</p>

        <FamilyPreset :family="family" :preset="preset" :name="name" :cart="cart" :callback="toggleInstance" v-for="(preset, name) in family.groups" :key="name" />

        <p class="mb-2 mt-4">Licences</p>

        <CustomSelect v-model="visitors" :options="['<10k visitors/mth', '<40k visitors/mth', '>100k visitors/mth']" />
        <CustomSelect v-model="users" :options="['1 user', '4 users', '10+ users']" />
        <CustomSelect v-model="apps" :options="['1 app', '4 apps', '10+ apps']" />

        <label class="cursor-pointer flex items-center mb-2 mt-4" v-if="total > 0">
          <input type="checkbox" name="agree" class="appearance-none bg-white checked:bg-green cursor-pointer h-10 rounded-full w-10">
          <span class="pl-2">Agree to <a class="underline" href="#">EULA</a></span>
        </label>

        <div class="my-2" v-if="total > 0">
          <label class="cursor-pointer flex items-center">
            <input v-model="newsletter" type="checkbox" name="newsletter" class="appearance-none bg-white checked:bg-green cursor-pointer h-10 rounded-full w-10">
            <span class="pl-2">Subscribe to newsletter</span>
          </label>

          <div class="mr-10" v-if="newsletter">
            <input type="text" name="email" placeholder="Enter e-mail address" class="bg-white h-10 leading-10 placeholder-current rounded-full text-center w-full">
          </div>
        </div>

        <p class="mb-2 mt-8" v-if="total > 0">Summary</p>
      </div>

      <div class="bg-white px-4 py-2" v-if="total > 0">
        <table class="text-sm w-full">
          <tr v-for="(item, i) in cart" :key="`item_${i}`">
            <td>{{ getItemName(item) }}</td>
            <td class="text-right">&euro;{{ family.stylePrice }}</td>
          </tr>
        </table>
      </div>

      <div class="flex items-center px-4 pt-4" v-if="total > 0">
        <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
        <button @click="formSubmit" class="inline-block h-10 leading-10 rounded-full px-4" :class="[!total ? 'bg-gray-300' : '']" :style="[ total ? {color: background, background: color} : {} ]">Buy</button>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from "@/components/CustomSelect"
import FamilyPreset from "@/components/FamilyPreset"
import Menu from "@/components/Menu"
import Slider from "@/components/Slider"
import Tester from "@/components/Tester"
import axios from "axios"
import { shallowEqual } from "fast-equals"
import { fonts } from "../data.js"

export default {
  name: 'Detail',
  components: {
    CustomSelect,
    FamilyPreset,
    Menu,
    Slider,
    Tester,
  },
  data() {
    return {
      family: null,
      isCartShown: false,
      cart: [],
      axes: {
        wght: 100,
        wdth: 100,
      },
      visitors: '<10k visitors/mth',
      users: '1 user',
      apps: '1 app',
      background: 'white',
      color: 'black',
      isDragging: false,
      newsletter: false,
    }
  },
  mounted() {
    this.family = fonts.find(font => font.slug === this.$route.params.family)
  },
  methods: {
    formSubmit() {
      axios.post(`${process.env.VUE_APP_API_URL}/pay-link`, this.cart).then(({data}) => {
        window.Paddle.Checkout.open({
          override: data.url,
        })
      })
    },
    toggleInstance(instance) {
      if (this.cart.includes(instance)) {
        this.cart = this.cart.filter(item => item !== instance)
      } else {
        this.cart.push(instance)
      }
    },
    toggleCustom() {
      if (this.hasCustom) {
        this.removeCustom()
      } else {
        this.addCustom()
      }
    },
    addCustom() {
      this.cart.push({axes: this.axes})
    },
    removeCustom() {
      this.cart = this.cart.filter(item => !this.isCustom(item))
    },
    getGroupName(instance) {
      for (const group in this.family.groups) {
        for (const style in this.family.groups[group]) {
          if (shallowEqual(instance.axes, this.family.groups[group][style].axes)) {
            return group
          }
        }
      }
    },
    getItemName(instance) {
      if (this.isCustom(instance)) {
        return `${this.family.name} ${this.customStyle}`
      } else {
        return `${this.family.name} ${this.getGroupName(instance)} ${this.getPreset(instance).name}`
      }
    },
    showCart() {
      this.isCartShown = true
      this.cart = [{axes: this.axes}]
      this.$refs.tester.refresh()
    },
    isCustom(item) {
      return !this.getPreset(item)
    },
    getPreset(item) {
      return Object.values(this.family.groups)
        .flat()
        .find(preset => shallowEqual(preset.axes, item.axes))
    },
    sliderChange(value) {
      const mapped = 360 * value / 1000
      const opposite = mapped > 180 ? mapped - 180 : mapped + 180
      this.background = `hsl(${opposite}, 100%, 50%)`
      this.color = `hsl(${mapped}, 100%, 50%)`

    },
    dragStart() {
      this.isDragging = true
    },
    dragEnd() {
      this.isDragging = false
    }
  },
  computed: {
    total() {
      return this.cart.length * this.family.stylePrice
    },
    customStyle() {
      return Object.values(this.axes)
        .map(value => value.toString().padStart(3, '0'))
        .join('')
    },
    hasCustom() {
      return this.cart.some(item => this.isCustom(item))
    },
  },
  watch: {
    isCartShown(value) {
      // if (value) {
      //   this.background = 'black'
      //   this.color = 'white'
      // } else {
      //   this.background = 'white'
      //   this.color = 'black'
      // }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.isCartShown = false
    next()
  }
}
</script>
