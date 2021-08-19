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
      <Tester :values="properties" />
      <div class="absolute bottom-0 group left-0 right-0">
        <Slider v-model="properties.wght" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Black'}" />
        <Slider v-model="properties.mood" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Bold'}" />
      </div>
    </div>

    <div class="bg-white bottom-0 fixed overflow-y-auto py-1 right-0 top-0 w-full lg:w-1/4" v-show="isCartShown">
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

          <p class="mb-2 mt-4">Your style {{ style }}</p>

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

        <FamilyPreset :family="family" :preset="preset" :name="name" :cart="cart" :callback="toggleInstance" v-for="(preset, name) in family.presets" :key="name" />

        <p class="mb-2 mt-4">Licences</p>

        <CustomSelect selected="&lt;10k visitors/mth" :options="['<10k visitors/mth', '<40k visitors/mth', '>100k visitors/mth']" />
        <CustomSelect selected="1 user" :options="['1 user', '4 users', '10+ users']" />
        <CustomSelect selected="1 app" :options="['1 app', '4 apps', '10+ apps']" />

        <label class="cursor-pointer flex items-center my-4">
          <input type="checkbox" name="agree" class="appearance-none bg-beige checked:bg-blue h-10 rounded-full w-10">
          <span class="pl-2">Agree to <a class="underline" href="#">EULA</a></span>
        </label>

        <p class="mb-2 mt-4">Summary</p>
      </div>

      <div class="border-black border-t-2">
        <div class="border-black border-dashed border-b-2 px-4 py-2">
          <table class="text-sm w-full">
            <tr v-for="(item, i) in cart" :key="`item_${i}`">
              <td>{{ getItemName(item) }}</td>
              <td class="text-right">&euro;{{ family.stylePrice }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="flex items-center px-4 py-2">
        <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
        <button class="bg-orange inline-block h-10 leading-10 rounded-full px-4">Buy</button>
      </div>

      <!--
      <form @submit.prevent="formSubmit" method="post">
       <div v-for="item in items" :key="item.id">
         <label>
           <input type="checkbox" name="variant" :value="item.id" v-model="item.active">
           {{ item.name }}
         </label>
       </div>
        <div>
          <label>Mood <input type="number" name="loc[mood]" value="500"></label>
        </div>
        <div>
          <label>Wght <input type="number" name="loc[wght]" value="500"></label>
        </div>
        <div>
          <input type="hidden" name="font" value="ChrastinaProGX.ttf">
        </div>
        <button type="submit">Pay {{ total }}&euro;</button>
      </form>
      -->
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
      items: [
        { id: 1, price: 70, name: 'Variant 1', active: false },
        { id: 2, price: 80, name: 'Variant 2', active: false },
        { id: 3, price: 90, name: 'Variant 3', active: false },
      ],
      cart: [],
      properties: {
        wght: 400,
        mood: 400,
      },
    }
  },
  mounted() {
    this.family = fonts.find(font => font.slug === this.$route.params.family)
  },
  methods: {
    formSubmit(e) {
      const data = new FormData(e.target);
      axios.post(`${process.env.VUE_APP_API_URL}/pay-link`, data).then(({data}) => {
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
      this.cart = this.cart.filter(item => !item.custom)
    },
    getGroupName(instance) {
      for (const group in this.family.presets) {
        for (const style in this.family.presets[group]) {
          if (instance === this.family.presets[group][style]) {
            return group
          }
        }
      }
    },
    getItemName(instance) {
      if (instance.custom) {
        return `${this.family.name} ${this.customStyle}`
      } else {
        return `${this.family.name} ${this.getGroupName(instance)} ${instance.name}`
      }
    },
    showCart() {
      this.isCartShown = true
      this.removeCustom()
      this.cart.push({
        custom: true,
      })
    }
  },
  computed: {
    total() {
      return this.cart.length * this.family.stylePrice
    },
    customStyle() {
      return Object.values(this.properties).join('')
    },
    hasCustom() {
      return this.cart.some(item => item.custom)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isCartShown = false
    next()
  }
}
</script>
