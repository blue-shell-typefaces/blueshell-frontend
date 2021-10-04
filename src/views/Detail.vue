<template>
  <div v-if="family">
    <div :style="isDragging ? 'user-select: none;' : ''">
      <div class="fixed inset-0 min-h-full"
          :class="[isCartShown ? 'w-3/4' : 'w-full']">
        <div class="left-0 right-0 sticky top-0 w-full z-10">
          <div class="flex justify-between px-4 py-1">
            <Menu />
            <div class="flex leading-10">
              <a href="#" class="hidden lg:block mx-5">About</a>
              <a href="#" class="hidden lg:block mx-5">Characters</a>
              <a href="#" class="hidden lg:block mx-5">Specimen</a>
              <a href="#" class="hidden lg:block mx-5">Trial</a>
              <button class="h-10 leading-10 ml-5 rounded-full w-10"
                :style="{ background: secondaryColor, color: primaryColor }"
                @click="isCartShown = true"
                @mouseover="buyButtonHover = true"
                @mouseleave="buyButtonHover = false"
                v-show="!isCartShown">Buy</button>
            </div>
          </div>
        </div>
        <div class="absolute flex inset-0 items-center overflow-y-auto"
            :style="{ background: testerBackground, color: testerColor, fontFamily }">
            <div class="balanced-text bg-transparent break-normal leading-none max-h-full overflow-hidden outline-none p-10 text-center w-full "
                :placeholder="placeholder"
                ref="textarea"
                :style="[ { '--wght': axes.wght }, this.testerStyle ]"
                style="font-variation-settings: 'wght' var(--wght);"
                spellcheck="false"
                contenteditable="true"
                @input="refresh"
                @paste="paste"
                @keydown="keydown"
                ></div>
        </div>
        <div class="absolute bottom-0 left-0 mb-2 mx-4 right-0">
          <Slider v-for="(axis, key) in family.axes" :key="key" v-model="axes[key]" @input="sliderChange" :min="axis.min" :max="axis.max" :markers="axis.markers" :background="secondaryColor" :color="primaryColor" @start="dragStart" @end="dragEnd" :globalDragging="isDragging" />
        </div>
      </div>

      <div class="bg-beige bottom-0 fixed overflow-y-auto pt-1 right-0 top-0 w-full lg:w-1/4" v-show="isCartShown">
        <div class="pb-4 px-4">
          <div class="flex h-10 leading-10 justify-between">
            <span class="uppercase">Buy {{ family.name }}</span>
            <button class="close bg-black h-10 relative rounded-full text-white w-10" :style="{ '--hover-background': secondaryColor, '--hover-color': primaryColor }" @click="isCartShown = false">
              <span class="absolute border-current border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
              <span class="absolute border-current border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
            </button>
          </div>

          <div>
            <div class="flex my-2 items-center">
              <div class="border border-black h-10 mr-3 rounded-full w-10"></div>
              <p class="text-xs w-1/2">By dragging the sliders, you have designed your style of {{ family.name }} typeface</p>
            </div>

            <p class="mb-2 mt-4">Your style</p>

            <div class="flex group leading-10">
              <div @click="toggleCustom" class="flex" :class="[ hasCustom ? 'bg-white flex-grow rounded-full' : '']">
                <div class="cursor-pointer h-10 rounded-full w-10" :class="[ hasCustom ? 'bg-black' : 'group-hover:bg-white' ]"></div>
                <div class="bg-white cursor-pointer px-4 rounded-l-full" :class="[ hasCustom ? 'flex-grow rounded-full' : '']">{{ family.name }} {{ customStyle }}</div>
              </div>
              <div @click="toggleCustom" class="bg-white cursor-pointer h-10 rounded-r-full text-center w-10" :class="[ hasCustom ? 'rounded-full' : '']">&euro;{{ family.stylePrice }}</div>
            </div>
          </div>

          <p class="mb-2 mt-4">Preset styles</p>

          <div class="flex group leading-10" v-for="preset in family.presets" :key="preset.name">
            <div @click="toggleInstance(preset)" class="flex" :class="[ cart.includes(preset) ? 'bg-white flex-grow rounded-full' : '']">
              <div class="cursor-pointer h-10 rounded-full w-10" :class="[ cart.includes(preset) ? 'bg-black' : 'group-hover:bg-white' ]"></div>
              <div class="bg-white cursor-pointer px-4 rounded-l-full" :class="[ cart.includes(preset) ? 'flex-grow rounded-full' : '']">{{ preset.name }}</div>
            </div>
            <div @click="toggleInstance(preset)" class="bg-white cursor-pointer h-10 rounded-r-full text-center w-10" :class="[ cart.includes(preset) ? 'rounded-full' : '']">&euro;{{ family.stylePrice }}</div>
          </div>

          <FamilyPreset :family="family" :preset="preset" :name="name" :cart="cart" :callback="toggleInstance" v-for="(preset, name) in family.groups" :key="name" />

          <p class="mb-2 mt-4">Licences</p>

          <CustomSelect v-model="visitors" :options="['<10k visitors/mth', '<40k visitors/mth', '>100k visitors/mth']" />
          <CustomSelect v-model="users" :options="['1 user', '4 users', '10+ users']" />
          <CustomSelect v-model="apps" :options="['1 app', '4 apps', '10+ apps']" />

          <label class="cursor-pointer flex items-center mb-2 mt-4" v-if="total > 0">
            <input type="checkbox" name="agree" class="appearance-none bg-white checked:bg-green cursor-pointer h-10 rounded-full w-10">
            <span class="pl-2">Agree to <a class="underline" href="#">EULA</a></span>
          </label>

          <!--
          <div class="my-2" v-if="total > 0">
            <label class="cursor-pointer flex items-center">
              <input v-model="newsletter" type="checkbox" name="newsletter" class="appearance-none bg-white checked:bg-green cursor-pointer h-10 rounded-full w-10">
              <span class="pl-2">Subscribe to newsletter</span>
            </label>

            <div class="mr-10" v-if="newsletter">
              <input type="text" name="email" placeholder="Enter e-mail address" class="bg-white h-10 leading-10 placeholder-current rounded-full text-center w-full">
            </div>
          </div>
          -->
        </div>

        <p class="mb-2 mt-8 px-4" v-if="total > 0">Summary</p>
        <div class="bg-white" v-if="total > 0">
          <div class="px-4 py-2">
            <table class="text-sm w-full">
              <tr v-for="(item, i) in cart" :key="`item_${i}`">
                <td>{{ getItemName(item) }}</td>
                <td class="text-right">&euro;{{ family.stylePrice }}</td>
              </tr>
            </table>
          </div>

          <div class="border-black border-dashed border-t-1 flex items-center p-4">
            <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
            <button @click="formSubmit" class="inline-block h-10 leading-10 rounded-full text-center w-10" :class="[!total ? 'bg-gray-300' : '']" :style="[ total ? {color: primaryColor, background: secondaryColor} : {} ]">Buy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
[contenteditable=true] {
  font-family: inherit !important;
  line-break: strict;
  -webkit-line-break: after-white-space;
}

[contenteditable=true]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block;
}

.close:hover {
  background: var(--hover-background);
  color: var(--hover-color);
}
</style>

<script>
import CustomSelect from "@/components/CustomSelect"
import FamilyPreset from "@/components/FamilyPreset"
import Menu from "@/components/Menu"
import Slider from "@/components/Slider"
import axios from "axios"
import { shallowEqual } from "fast-equals"

export default {
  name: 'Detail',
  components: {
    CustomSelect,
    FamilyPreset,
    Menu,
    Slider,
  },
  data() {
    return {
      family: null,
      isCartShown: false,
      cart: [],
      axes: {},
      visitors: '<10k visitors/mth',
      users: '1 user',
      apps: '1 app',
      primaryColor: 'white',
      secondaryColor: 'black',
      isDragging: false,
      newsletter: false,
      buyButtonHover: false,
      fontSize: 0,
      placeholder: '',
    }
  },
  created() {
    window.addEventListener('resize', this.windowResized)
  },
  destroyed() {
    window.removeEventListener('resize', this.windowResized)
  },
  mounted() {
    this.updateFamily()
    this.$nextTick(() => {
      this.refresh()
      this.$refs.textarea.focus()
    })
    this.addCustom()
  },
  methods: {
    updateFamily() {
      this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
      const fontLoader = new FontFace(this.family.name, 'url(https://static.blueshell.xyz/BSGatesBeta1VF.ttf)')
      fontLoader.load().then(fontFace => {
        document.fonts.add(fontFace)
        document.fonts.ready.then(() => {
          this.placeholder = 'Tester'
          this.axes = {}
          for (const [name, axis] of Object.entries(this.family.axes)) {
            this.$set(this.axes, name, axis.min)

            this.animate(
              function (timeFraction) { return timeFraction },
              progress => this.axes[name] = progress * (axis.origin - axis.min) + axis.min,
              1000
            )
          }

          this.fontSize = window.innerHeight / 2
        })
      }).catch(function () {
        // todo
      })

    },
    animate(timing, draw, duration) {
      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration
        if (timeFraction < 0) timeFraction = 0
        if (timeFraction > 1) timeFraction = 1

        let progress = timing(timeFraction)

        draw(progress)

        if (timeFraction < 1) {
          requestAnimationFrame(animate)
        }
      });
    },
    formSubmit() {
      axios.post(`${process.env.VUE_APP_API_URL}/pay-link`, {
        cart: this.cart,
        visitors: this.visitors,
        users: this.users,
        apps: this.apps,
      }).then(({data}) => {
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
      return instance.group
    },
    getItemName(instance) {
      const name = [this.family.name]
      if (this.isCustom(instance)) {
        name.push(this.customStyle)
      } else {
        const group = this.getGroupName(instance)
        if (group) {
          name.push(group)
        }
        name.push(this.getPreset(instance).name)
      }

      return name.join(' ')
    },
    isCustom(item) {
      return !this.getPreset(item)
    },
    getPreset(item) {
      return Object.values(this.family.presets)
        .find(preset => shallowEqual(preset.values, item.values))
    },
    sliderChange(value) {
      const mapped = 360 * value / 1000
      const opposite = mapped > 180 ? mapped - 180 : mapped + 180
      this.primaryColor = `hsl(${opposite}, 100%, 50%)`
      this.secondaryColor = `hsl(${mapped}, 100%, 50%)`
    },
    dragStart() {
      this.isDragging = true
    },
    dragEnd() {
      this.isDragging = false
      this.refresh()
    },
    windowResized() {
        this.refresh()
    },
    refresh() {
        const textarea = this.$refs.textarea
        const min = 14
        this.fontSize = window.innerHeight / 2
        const ratio = 0.9
        textarea.style.fontSize = `${this.fontSize}px`

        while ((textarea.offsetWidth < textarea.scrollWidth || textarea.offsetHeight < textarea.scrollHeight) && this.fontSize * ratio > min) {
            console.log(textarea.offsetHeight, textarea.scrollHeight)
            this.fontSize *= ratio
            textarea.style.fontSize = `${this.fontSize}px`
        }
    },
    paste(e) {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
    },
    keydown(e) {
        if (e.key === 'Enter') {
            document.execCommand('insertLineBreak')
            e.preventDefault()
        }
    },
  },
  computed: {
    fontFamily() {
      return `"${this.family.name}"`
    },
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
    testerBackground() {
      if (this.isDragging) {
        return this.primaryColor
      }

      if (this.buyButtonHover || this.isCartShown) {
        return 'black'
      } else {
        return 'white'
      }
    },
    testerColor() {
      if (this.isDragging) {
        return this.secondaryColor
      }

      if (this.buyButtonHover || this.isCartShown) {
        return 'white'
      } else {
        return 'black'
      }
    },
    testerStyle() {
        const style = {}

        if (this.fontSize < 20) {
            Object.assign(style, { columns: 3, textAlign: 'left' })
        } else if (this.fontSize < 30) {
            Object.assign({ columns: 2, textAlign: 'left' })
        } else {
            Object.assign({ columns: 1, textAlign: 'center' })
        }

        if (this.isDragging) {
            Object.assign({ 'user-select': 'none' })
        } else {
            Object.assign({ 'user-select': 'text' })
        }

        return style
    }
  },
  watch: {
    isCartShown() {
      this.$nextTick(function () {
        this.refresh() // todo
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isCartShown = false
    next()
    this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
  }
}
</script>
