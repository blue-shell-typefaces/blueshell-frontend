<template>
  <div v-if="family">
    <div class="flex flex-col h-full">
      <div class="fixed w-full">
        <div class="flex justify-between m-1">
          <Menu />
          <div class="flex leading-10">
            <a href="#" class="hidden lg:block mx-5">About</a>
            <a href="#" class="hidden lg:block mx-5">Characters</a>
            <a href="#" class="hidden lg:block mx-5">Specimen</a>
            <a href="#" class="hidden lg:block mx-5">Trial</a>
            <button class="bg-orange h-10 leading-10 ml-5 rounded-full w-10" @click="showCart = !showCart">Buy</button>
          </div>
        </div>
      </div>
      <div class="h-full">
        <textarea class="bg-transparent flex-grow flex-shrink-0 h-full placeholder-current resize-none text-center w-full"
                  :class="`font-${$route.params.family}`"
                  placeholder="Only kill"
                  ref="textarea"
                  :style="`--wght: ${wght}; --mood: ${mood}; font-variation-settings: 'wght' var(--wght), 'mood' var(--mood);`"
                  spellcheck="false"></textarea>
        <div class="bottom-0 left-0 right-0 fixed">
          <Slider :value.sync="wght" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Black'}" />
          <Slider :value.sync="mood" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Bold'}" />
        </div>
      </div>
    </div>

    <div class="bg-white bottom-0 fixed overflow-y-auto p-1 right-0 top-0" v-show="showCart">
      <div class="flex h-10 leading-10 justify-between">
        <span>Buy {{ family.name }}</span>
        <button class="bg-black h-10 relative rounded-full w-10" @click="showCart = false">
          <span class="absolute border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
          <span class="absolute border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
        </button>
      </div>
      
      <p class="my-3">You have created your own style of {{ family.name }} typeface.</p>

      <p class="my-3">Your style</p>

      <div class="relative">
        <button class="absolute bg-black h-10  rounded-full w-10">          
          <span class="absolute border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
          <span class="absolute border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
        </button>

        <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">BS Zaum ReNa233</span>
      </div>

      <p class="my-3">Preset styles</p>

      <div class="relative" v-for="(preset, name) in family.presets" :key="name">
        <button class="absolute bg-black h-10 rounded-full w-10">          
          <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
        </button>

        <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">{{ name }}</span>

        <div class="relative" v-for="instance in preset" :key="instance.name">
          <button class="absolute bg-black h-10 rounded-full w-10" v-show="selectedInstances.has(instance)">
            <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
          </button>
        
          <span class="cursor-pointer h-10 inline-block leading-10 pr-4 rounded-full" @click="toggleInstance(instance)" :class="[selectedInstances.has(instance) ? 'bg-blue pl-12' : 'bg-beige ml-8 pl-4']">{{ instance.name }}</span>
        </div>
      </div>

<!--
      <div class="relative">
        <button class="absolute bg-black h-10 rounded-full w-10">          
          <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
        </button>

        <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">Zaum Narrow</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black hidden h-10 rounded-full w-10">
          <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
        </button>
      
        <span class="bg-beige h-10 inline-block leading-10 ml-8 pl-4 pr-4 rounded-full">White</span>
      </div>
  
      <div class="relative">
        <button class="absolute bg-black hidden h-10 rounded-full w-10">
          <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
        </button>
      
        <span class="bg-beige h-10 inline-block leading-10 ml-8 pl-4 pr-4 rounded-full">Thin</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black h-10 rounded-full w-10">
          <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
        </button>
      
        <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">Light</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black hidden h-10 rounded-full w-10">
          <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
        </button>
      
        <span class="bg-beige h-10 inline-block leading-10 ml-8 pl-4 pr-4 rounded-full">Medium</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black hidden h-10 rounded-full w-10">
          <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
        </button>
      
        <span class="bg-beige h-10 inline-block leading-10 ml-8 pl-4 pr-4 rounded-full">Bold</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black hidden h-10 rounded-full w-10">
          <span class="absolute bg-white h-1 left-1/2 rounded-full transform top-1/2 -translate-x-1/2 -translate-y-1/2 w-1"></span>
        </button>
      
        <span class="bg-beige h-10 inline-block leading-10 ml-8 pl-4 pr-4 rounded-full">Black</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black h-10 rotate-180 rounded-full transform w-10">          
          <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
        </button>

        <span class="bg-beige h-10 inline-block leading-10 pl-12 pr-4 rounded-full">Zaum Standard</span>
      </div>

      <span class="bg-beige h-10 inline-block leading-10 my-3 px-4 rounded-full">Zaum Complete Family</span>


      <p class="my-3">Licences</p>

      <div class="relative">
        <button class="absolute bg-black h-10 rotate-180 rounded-full transform w-10">          
          <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
        </button>

        <span class="bg-beige h-10 inline-block leading-10 pl-12 pr-4 rounded-full">&lt;10k visitors</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black h-10 rotate-180 rounded-full transform w-10">          
          <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
        </button>

        <span class="bg-beige h-10 inline-block leading-10 pl-12 pr-4 rounded-full">Number of users</span>
      </div>

      <div class="relative">
        <button class="absolute bg-black h-10 rotate-180 rounded-full transform w-10">          
          <span class="absolute border-t-1 border-l-1 h-1/2 left-1/4 rotate-45 -mt-1 top-1/2 transform w-1/2"></span>
        </button>

        <span class="bg-beige h-10 inline-block leading-10 pl-12 pr-4 rounded-full">Number of apps</span>
      </div>
-->

      <label class="cursor-pointer flex items-center my-3">
        <input type="checkbox" name="agree" class="appearance-none bg-beige checked:bg-blue h-10 rounded-full w-10">
        <span class="pl-2">Agree to <a class="underline" href="#">EULA</a></span>
      </label>

      <div class="text-right">
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
import Menu from "@/components/Menu"
import Slider from "@/components/Slider"
import axios from "axios"
import { fonts } from "../data.js"

export default {
  name: 'Detail',
  components: {
    Menu,
    Slider,
  },
  data() {
    return {
      family: null,
      wght: 400,
      mood: 401,
      showCart: true,
      items: [
        { id: 1, price: 70, name: 'Variant 1', active: false },
        { id: 2, price: 80, name: 'Variant 2', active: false },
        { id: 3, price: 90, name: 'Variant 3', active: false },
      ],
      selectedInstances: new Set(),
    }
  },
  mounted() {
    this.family = fonts.find(font => font.slug === this.$route.params.family)
    this.$nextTick(() => {
      this.$refs.textarea.style.fontSize = `${window.innerHeight / 2}px`
    })
  },
  methods: {
    formSubmit(e) {
      const data = new FormData(e.target);
      axios.post(`${process.env.VUE_APP_API_URL}/pay-link`, data).then(({data}) => {
        window.Paddle.Checkout.open({
          override: data.url,
        });
      });
    },
    toggleInstance(instance) {
      if (this.selectedInstances.has(instance)) {
        this.selectedInstances.delete(instance)
      } else {
        this.selectedInstances.add(instance)
        console.log(this.selectedInstances)
      }
    }
  },
  computed: {
    total() {
      return 70
      // return this.items
      //     .filter(item => item.active)
      //     .map(item => item.price)
      //     .reduce((a, b) => a + b, 0);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.showCart = false
    next()
  }
}
</script>
