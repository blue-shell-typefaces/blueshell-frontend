<template>
  <div v-if="family">
    <div class="fixed inset-0 min-h-full" :class="[isCartShown ? 'bg-black text-white w-3/4' : 'w-full']">
      <div class="left-0 right-0 sticky top-0 w-full z-10">
        <div class="flex justify-between px-4 py-1">
          <Menu />
          <div class="flex leading-10">
            <a href="#" class="hidden lg:block mx-5">About</a>
            <a href="#" class="hidden lg:block mx-5">Characters</a>
            <a href="#" class="hidden lg:block mx-5">Specimen</a>
            <a href="#" class="hidden lg:block mx-5">Trial</a>
            <button class="bg-orange h-10 leading-10 ml-5 rounded-full w-10" @click="showCart" v-show="!isCartShown">Buy</button>
          </div>
        </div>
      </div>
      <Tester :values="axes" />
      <div class="absolute bottom-0 left-0 right-0">
        <Slider v-model="axes.wght" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Black'}" />
        <Slider v-model="axes.wdth" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Bold'}" />
      </div>
    </div>

    <div class="bg-white bottom-0 fixed overflow-y-auto pb-4 pt-1 right-0 top-0 w-full lg:w-1/4" v-show="isCartShown">
      <div class="px-4">
        <div class="flex h-10 leading-10 justify-between">
          <span>Buy {{ family.name }}</span>
          <button class="bg-black h-10 relative rounded-full w-10" @click="isCartShown = false">
            <span class="absolute border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
            <span class="absolute border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
          </button>
        </div>
        
        <div v-if="hasCustom">
          <p class="my-4">You have created your own style of {{ family.name }} typeface.</p>

          <p class="mb-2 mt-4">Your style {{ customStyle }}</p>

          <span class="relative">
            <button class="delete-button absolute bg-black group h-10 rounded-full w-10" @click="removeCustom">
              <span class="absolute bg-white h-1 group-hover:hidden left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
              <span class="absolute border-t-1 hidden group-hover:inline left-1/4 rotate-45 transform w-1/2"></span>
              <span class="absolute border-t-1 hidden group-hover:inline left-1/4 -rotate-45 transform w-1/2"></span>
            </button>

            <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">{{ family.name }} {{ customStyle }}</span>
          </span>
        </div>

        <p class="mb-2 mt-4">Preset styles</p>

        <FamilyPreset :family="family" :preset="preset" :name="name" :cart="cart" :callback="toggleInstance" v-for="(preset, name) in family.groups" :key="name" />

        <p class="mb-2 mt-4">Licences</p>

        <CustomSelect v-model="visitors" :options="['<10k visitors/mth', '<40k visitors/mth', '>100k visitors/mth']" />
        <CustomSelect v-model="users" :options="['1 user', '4 users', '10+ users']" />
        <CustomSelect v-model="apps" :options="['1 app', '4 apps', '10+ apps']" />

        <label class="cursor-pointer flex items-center my-4" v-if="total > 0">
          <input type="checkbox" name="agree" class="appearance-none bg-beige checked:bg-blue cursor-pointer h-10 rounded-full w-10">
          <span class="pl-2">Agree to <a class="underline" href="#">EULA</a></span>
        </label>

        <p class="mb-2 mt-4" v-if="total > 0">Summary</p>
      </div>

      <div class="border-black border-t-2" v-if="total > 0">
        <div class="border-black border-dashed border-b-2 px-4 py-2">
          <table class="text-sm w-full">
            <tr v-for="(item, i) in cart" :key="`item_${i}`">
              <td>{{ getItemName(item) }}</td>
              <td class="text-right">&euro;{{ family.stylePrice }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="flex items-center px-4 pt-4" v-if="total > 0">
        <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
        <button @click="formSubmit" class="inline-block h-10 leading-10 rounded-full px-4" :class="[total > 0 ? 'bg-orange' : 'bg-gray-300']">Buy</button>
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
        wght: 400,
        wdth: 400,
      },
      visitors: '<10k visitors/mth',
      users: '1 user',
      apps: '1 app',
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
    },
    isCustom(item) {
      return !this.getPreset(item)
    },
    getPreset(item) {
      return Object.values(this.family.groups)
        .flat()
        .find(preset => shallowEqual(preset.axes, item.axes))
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
  beforeRouteUpdate(to, from, next) {
    this.isCartShown = false
    next()
  }
}
</script>
