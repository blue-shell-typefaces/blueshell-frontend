<template>
  <div v-if="family">
    <div class="fixed inset-0 min-h-full w-full"
        :class="{ 'lg:w-3/4': cartShown }">
      <div class="left-0 right-0 sticky top-0 w-full z-10">
        <div class="flex items-center px-4 py-2" :class="editing ? 'justify-end' : 'justify-between'">

          <div class="group" :class="{ 'hidden': cartShown }">
            <span class="cursor-pointer uppercase" onclick="">Menu</span>
            <div class="absolute hidden group-hover:block">
              <div><span class="cursor-pointer hover:underline" :data-content="about" @click="menu">About</span></div>
              <div><span class="cursor-pointer hover:underline" :data-content="contact" @click="menu">Contact</span></div>
            </div>
          </div>

          <div class="flex leading-10">
            <span class="cursor-pointer hidden mx-5 hover:underline" :class="{ 'lg:block': !cartShown }" data-content="Soon" @click="menu">Specimen</span>
            <span class="cursor-pointer hidden mx-5 hover:underline" :class="{ 'lg:block': !cartShown }" data-content="Soon" @click="menu">Trial</span>
            <div class="bg-secondary cursor-pointer h-10 leading-10 ml-5 rounded-full text-center text-primary w-10"
              :class="{ 'hidden': cartShown }"
              @click="cartShown = true"
              @mouseover="buyButtonHover = true"
              @mouseleave="buyButtonHover = false"
              v-show="!cartShown">Buy</div>
            <div class="bg-secondary cursor-pointer h-10 leading-10 ml-5 rounded-full text-center text-primary w-10"
              :class="editing ? 'lg:hidden' : 'hidden'"
              @click="editing = false">Add</div>
          </div>
        </div>
      </div>

      <div class="absolute inset-0 p-10" :style="{ background: testerBackground, color: testerColor, fontFamily }">
        <div class="flex h-full items-center w-full" ref="container">
          <div class="balanced-text bg-transparent break-normal leading-none max-h-full outline-none overflow-hidden resize-none text-center tracking-normal w-full"
            :data-replicated-value="sampleText"
            :style="testerStyle">
            <textarea class="balanced-text bg-transparent break-normal leading-none max-h-full outline-none overflow-hidden resize-none text-center tracking-normal w-full"
              @input="refresh"
              ref="textarea"
              resize="false"
              spellcheck="false"
              :style="testerStyle"
              v-model="sampleText"
              rows="1"
              ></textarea>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 mb-2 mx-4 right-0">
        <SelectSlider v-for="(axis, key) in selectedStyle"
          :key="key"
          :ref="el => { if (el) selectSliderRefs.push(el) }"
          v-model="selectedStyle[key]"
          v-on:update:modelValue="updateColors"
          :min="family.axes[key].min"
          :max="family.axes[key].max"
          :markers="family.axes[key].markers"
          @start="globalDragging = true"
          @end="globalDragging = false"
          @select="refresh" />
        <MarkerSlider v-for="(axis, key) in selectedStyle"
          :key="key"
          :ref="el => { if (el) markerSliderRefs.push(el) }"
          v-model="selectedStyle[key]"
          v-on:update:modelValue="updateColors"
          :min="family.axes[key].min"
          :max="family.axes[key].max"
          :markers="family.axes[key].markers"
          @start="globalDragging = true"
          @end="globalDragging = false"
          :globalDragging="globalDragging" />
      </div>
    </div>

    <Cart
      ref="cart"
      @close="cartShown = false"
      @edit="edit"
      @selectStyle="selectStyle"
      @submit="menu"
      v-bind="{ cartShown, editing, family, selectedStyle, valueToColor }" />

    <Favicon :color="secondaryColor" />
  </div>
</template>

<style scoped>
[data-replicated-value] {
  @apply grid;
}

[data-replicated-value]::after {
  /* append null character for empty new line to have effect */
  content: attr(data-replicated-value) "\200b";
  @apply invisible whitespace-pre-wrap;
}

[data-replicated-value]::after,
textarea {
  grid-area: 1 / 1 / 2 / 2;
}

textarea::selection {
  @apply bg-none text-secondary;
}
</style>

<script>
import Cart from "../components/Cart.vue"
import Favicon from "../components/Favicon.vue"
import MarkerSlider from "../components/MarkerSlider.vue"
import SelectSlider from "../components/SelectSlider.vue"
import axios from "axios"
import { reactive } from "vue"
import { debounce } from "lodash"

export default {
  name: 'Detail',
  components: {
    Cart,
    Favicon,
    MarkerSlider,
    SelectSlider,
  },
  data() {
    return {
      cartShown: false,
      refreshLock: false,
      family: null,
      editing: false,
      selectedStyle: null,
      primaryColor: 'white',
      secondaryColor: 'black',
      globalDragging: false,
      buyButtonHover: false,
      fontSize: 0,
      $fonts: [],
      sampleText: '',
      markerSliderRefs: [],
      selectSliderRefs: [],
      about: 'This website and typeface is still under development. We released it as public beta to catch any inconsistencies.\nSupported using public funding by Slovak Arts Council\n\u2133',
      contact: 'info@blueshell.xyz',
      refreshDebounced: debounce(this.refresh, 300)
    }
  },
  created() {
    window.addEventListener('resize', this.refreshDebounced)
  },
  destroyed() {
    window.removeEventListener('resize', this.refreshDebounced)
  },
  mounted() {
    axios.get(`${import.meta.env.VITE_API_URL}/families`)
      .then(({data}) => {
        this.$fonts = data
        this.updateFamily()
      })
      .catch(function () {
        // todo error
      })
  },
  methods: {
    edit(style) {
      this.selectStyle(style)
      this.editing = true
    },
    selectStyle(style) {
      this.selectedStyle = style
      const key = Object.keys(style)[0]
      const value = style[key]
      this.updateColors(value)
      this.bounceSliders()
      this.refresh()
    },
    introAnimation() {
      if (document.visibilityState !== 'visible') return
      document.removeEventListener('visibilitychange', this.introAnimation)
      Object.entries(this.family.axes).forEach(([name, axis]) => {
        const animation = progress => {
          const value = progress * (axis.origin - axis.min) + axis.min
          this.updateColors(value)
          this.selectedStyle[name] = value
        }

        this
          .animate(t => t, animation, 2000)
          .then(() => {
            this.refreshLock = false
            this.refresh()
          })
      })
    },
    isTouchDevice() {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0))
    },
    menu(e) {
      this.sampleText = '';
      const characters = [...e.target.dataset.content]
      this.animateText(characters, characters.length)
    },
    animateText(characters, length) {
      if (!characters.length) return
      const character = characters.shift()
      this.sampleText += character
      this.$nextTick(() => {
        this.refresh(true)
        setTimeout(() => {
          this.animateText(characters, length)
        }, Math.ceil(400 / length))
      })
    },
    updateFamily() {
      const family = this.$fonts.find(font => font.slug === 'gates')
      const fontLoader = new FontFace(family.name, `url(${import.meta.env.VITE_STATIC_URL}/${family.filename})`)
      fontLoader.load().then(fontFace => {
        document.fonts.add(fontFace)
        document.fonts.ready.then(() => {
          this.sampleText = family.sample_text
          const style = {}
          Object.entries(family.axes).forEach(([name, axis]) => {
            style[name] = axis.origin
          })
          this.selectedStyle = reactive(style)
          this.family = family

          this.$nextTick(() => {
            this.refresh()
            this.refreshLock = true

            Object.keys(family.axes).forEach(name => {
              this.selectedStyle[name] = 0
            })

            document.addEventListener('visibilitychange', this.introAnimation)
            this.introAnimation()

            this.focus(this.$refs.textarea)
          })
        })
      })
    },
    focus(el) {
      const selection = window.getSelection()
      const range = document.createRange()
      selection.removeAllRanges()
      range.selectNodeContents(el)
      range.collapse(false)
      selection.addRange(range)
      el.focus()
    },
    animate(timing, draw, duration) {
      const start = performance.now()
      return new Promise(resolve => {
        requestAnimationFrame(function animate(time) {
          let timeFraction = (time - start) / duration
          if (timeFraction < 0) timeFraction = 0
          if (timeFraction > 1) timeFraction = 1

          let progress = timing(timeFraction)

          draw(progress)

          if (timeFraction < 1) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        });
      })
    },
    bounceSliders() {
      this.markerSliderRefs.forEach(slider => {
        slider.bounce()
      })
      this.selectSliderRefs.forEach(slider => {
        slider.bounce()
      })
    },
    updateColors(value) {
      this.primaryColor = this.valueToColor(value, false)
      this.secondaryColor = this.valueToColor(value, true)
    },
    valueToColor(value, opposite) {
      const mapped = ((360 - 100) * value / 1000) + 100
      if (opposite) {
        const opposite = mapped > 240 ? mapped - 240 : mapped + 240
        return `hsl(${opposite}, 100%, 50%)`
      } else {
        return `hsl(${mapped}, 100%, 50%)`
      }
    },
    refresh(force = false) {
      if (this.refreshLock && !force) return

      this.fontSize = 1000
      let ratio

      do {
        ratio = this.fit()
      } while (ratio > 1)

      do {
        ratio = this.fit()
      } while (ratio < 1)

      do {
        ratio = this.fit()
      } while (ratio > 1)
    },
    fit() {
      const container = this.$refs.container
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight

      const textarea = this.$refs.textarea

      const textareaScrollWidth = textarea.scrollWidth
      const textareaScrollHeight = textarea.scrollHeight

      let ratio = 1

      if (textareaScrollWidth > containerWidth && textareaScrollHeight > containerHeight) {
        ratio *= Math.sqrt(containerWidth * containerHeight / (textareaScrollWidth * textareaScrollHeight))
      } else if (textareaScrollWidth > containerWidth) {
        ratio *= containerWidth / textareaScrollWidth
      } else if (textareaScrollHeight > containerHeight) {
        ratio *= Math.sqrt(containerHeight / textareaScrollHeight)
      } else if (textareaScrollHeight < containerHeight) {
        ratio *= Math.sqrt(containerHeight / textareaScrollHeight)
      }

      this.fontSize *= ratio
      this.$refs.container.style.fontSize = `${Math.floor(this.fontSize)}px`

      return ratio
    },
  },
  computed: {
    fontFamily() {
      return `"${this.family.name}"`
    },
    testerBackground() {
      if (this.globalDragging) {
        return this.primaryColor
      }

      if (this.buyButtonHover && !this.isTouchDevice() || this.cartShown) {
        return 'black'
      } else {
        return 'white'
      }
    },
    testerColor() {
      if (this.globalDragging) {
        return this.secondaryColor
      }

      if (this.buyButtonHover && !this.isTouchDevice() || this.cartShown) {
        return 'white'
      } else {
        return 'black'
      }
    },
    testerStyle() {
      if (!this.selectedStyle) return

      const style = {}
      style.fontVariationSettings = Object.keys(this.selectedStyle)
        .map(axis => `'${axis}' var(--${axis})`)
        .join(',')

      Object.entries(this.selectedStyle).map(([key, value]) => {
        style[`--${key}`] = value
      })

      return style
    }
  },
  watch: {
    globalDragging(value) {
      if (value === false) {
        this.refresh()
      }
    },
    primaryColor(value) {
      this.$el.style.setProperty('--primary-color', value)
    },
    secondaryColor(value) {
      this.$el.style.setProperty('--secondary-color', value)
    },
    cartShown(value) {
      if (!value) {
        this.editing = false
      }

      this.$nextTick(function () {
        this.refresh()
      })
    },
    editing() {
      this.$nextTick(function () {
        this.refresh()
      })
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.cartShown = false
    next()
    this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
  },
}
</script>