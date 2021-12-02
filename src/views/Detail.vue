<template>
  <div v-if="family">
    <div class="fixed inset-0 min-h-full"
        :class="[isCartShown ? 'w-full lg:w-3/4' : 'w-full']">
      <div class="left-0 right-0 sticky top-0 w-full z-10">
        <div class="flex items-center px-4 py-2" :class="isEditing ? 'justify-end' : 'justify-between'">

          <div class="group" :class="isCartShown ? 'hidden' : ''">
            <span class="cursor-pointer uppercase" onclick="">Menu</span>
            <div class="absolute hidden group-hover:block">
              <div><span class="cursor-pointer hover:underline" :data-content="about" @click="menu">About</span></div>
              <div><span class="cursor-pointer hover:underline" :data-content="contact" @click="menu">Contact</span></div>
            </div>
          </div>

          <div class="flex leading-10">
            <span class="cursor-pointer hidden mx-5 hover:underline" :class="isCartShown ? '' : 'lg:block'" data-content="Soon" @click="menu">Specimen</span>
            <span class="cursor-pointer hidden mx-5 hover:underline" :class="isCartShown ? '' : 'lg:block'" data-content="Soon" @click="menu">Trial</span>
            <div class="bg-secondary cursor-pointer h-10 leading-10 ml-5 rounded-full text-center text-primary w-10"
              :class="isCartShown ? 'hidden' : ''"
              @click="isCartShown = true"
              @mouseover="buyHover(true)"
              @mouseleave="buyHover(false)"
              v-show="!isCartShown">Buy</div>
            <div class="bg-secondary cursor-pointer h-10 leading-10 ml-5 rounded-full text-center text-primary w-10"
              :class="isEditing ? 'lg:hidden' : 'hidden'"
              @click="isEditing = false">Add</div>
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
        <SelectSlider v-for="(axis, key) in style"
          :key="key"
          :ref="el => { if (el) selectSliderRefs.push(el) }"
          v-model="style[key]"
          v-on:update:modelValue="updateColors"
          :min="family.axes[key].min"
          :max="family.axes[key].max"
          :markers="family.axes[key].markers"
          @start="isDragging = true"
          @end="isDragging = false"
          @select="refresh" />
        <MarkerSlider v-for="(axis, key) in style"
          :key="key"
          :ref="el => { if (el) markerSliderRefs.push(el) }"
          v-model="style[key]"
          v-on:update:modelValue="updateColors"
          :min="family.axes[key].min"
          :max="family.axes[key].max"
          :markers="family.axes[key].markers"
          @start="isDragging = true"
          @end="isDragging = false"
          :globalDragging="isDragging" />
      </div>
    </div>

    <div class="bg-primary bottom-0 fixed overflow-y-auto right-0 top-0 w-full lg:w-1/4" :class="isCartShown ? (isEditing ? 'hidden lg:block' : '') : 'hidden'">
      <div class="pt-2 relative min-h-full">

        <div class="pb-4 px-4">
          <div class="flex h-10 items-center justify-between leading-10">
            <span class="leading-none text-lg tracking-wide	uppercase">Buy {{ family.name }}</span>
            <div class="bg-times cursor-pointer h-10 rounded-full w-10" @click="isCartShown = false"></div>
          </div>

          <div>
            <div class="flex my-1 items-center">
              <p class="w-3/4">By dragging the sliders, you can design your style of {{ family.name }} typeface</p>
            </div>

            <p class="mb-2 mt-4">Your styles of {{ family.name }}</p>

            <div :class="buyFullFamily ? 'opacity-50 pointer-events-none' : ''">
              <div class="cursor-pointer flex group" v-for="(s, i) in cart" :key="`cart_item_${i}`" @click="style = s; bounceSliders()">
                <div :class="style === s && !buyFullFamily ? 'bg-secondary text-primary' : 'bg-white'" class="flex flex-grow items-center max-w-[calc(100%-3rem)] rounded-full">
                  <div class="h-10 min-w-[2.5rem] rounded-full" @click="removeStyle(s)">
                    <svg class="h-full w-10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 45 45">
                      <line style="stroke:currentColor;stroke-width:1.79;" x1="31.42" y1="31.72" x2="13.58" y2="12.72"/>
                      <line style="stroke:currentColor;stroke-width:1.79;" x1="13.58" y1="31.72" x2="31.42" y2="12.72"/>
                    </svg>
                  </div>
                  <div class="flex-grow min-w-0 px-4 truncate whitespace-nowrap">{{ styleName(s) }}</div>
                  <div
                    @click="isEditing = true"
                    class="h-10 leading-10 lg:invisible lg:group-hover:visible px-4 rounded-full"
                    :class="style === s ? 'bg-white text-black' : ''"
                    :style="style !== s ? { backgroundColor: valueToColor(Object.values(s)[0], true), color: valueToColor(Object.values(s)[0], false) } : {}">Edit</div>
                </div>
                <div class="h-10 leading-10 rounded-full text-right w-12" :class="buyFullFamily ? 'invisible' : ''">&euro;{{ family.style_price }}</div>
              </div>

              <div class="cursor-pointer flex group" @click="addStyle(); bounceSliders()">
                <div class="can-hover:group-hover:bg-white flex flex-grow items-center max-w-full can-hover:group-hover:max-w-[calc(100%-3rem)] rounded-full">
                  <div class="bg-plus bg-white h-10 min-w-[2.5rem] rounded-full"></div>
                  <div class="min-w-0 px-4 truncate">Add style</div>
                </div>
                <div class="h-10 hidden can-hover:group-hover:block leading-10 rounded-full text-right w-12">&euro;{{ family.style_price }}</div>
              </div>
            </div>

            <div class="cursor-pointer flex my-4 group w-full" @click="buyFullFamily = !buyFullFamily">
              <div :class="buyFullFamily ? 'bg-white max-w-[calc(100%-3rem)]' : 'can-hover:group-hover:bg-white can-hover:group-hover:max-w-[calc(100%-3rem)]'" class="flex flex-grow items-center rounded-full">
                <div :class="buyFullFamily ? 'bg-times' : 'bg-plus'" class="bg-white h-10 min-w-[2.5rem] rounded-full"></div>
                <div class="min-w-0 px-4 truncate whitespace-nowrap">Full family</div>
              </div>
              <div :class="buyFullFamily ? '' : 'hidden can-hover:group-hover:block'" class="h-10 leading-10 pl-2 rounded-full text-right w-12">&euro;{{ family.family_price }}</div>
            </div>
          </div>

          <p class="mb-2 mt-4">Licences</p>

          <CustomSelect v-model="users" :options="['1 person', '≤3 persons', '≤10 persons', '>10 persons']" />

          <div class="my-3">
            <span v-for="(value, key) in licences" :key="`licence_${key}`" @click="licences[key] = !licences[key]" :class="licences[key] ? 'bg-black text-white' : 'bg-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4" data-licence>{{ key }}</span>
            <span class="relative" :class="isPoliticalShown ? 'relative z-50' : ''">
              <span @click="isPoliticalShown = !isPoliticalShown" :class="isPoliticalShown ? 'bg-black text-white' : 'bg-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4" data-licence>Political</span>
              <span class="absolute top-0 left-0 mt-9 text-sm text-white" :class="isPoliticalShown ? '' : 'hidden'">Please contact us<br><a class="underline" href="mailto:info@blueshell.xyz">info@blueshell.xyz</a></span>
            </span>
          </div>

          <label class="cursor-pointer flex items-center mb-2 mt-4" v-if="total > 0">
            <span class="flex-grow ">Do you agree to <a class="underline" href="#">EULA</a></span>
            <input type="checkbox" v-model="agree" ref="agree" class="appearance-none bg-white checked:bg-black cursor-pointer h-10 rounded-full w-10">
          </label>

          <div v-if="total > 0">
            <p class="mb-2 mt-4">Summary</p>
            <div class="bg-white px-4 py-2">
              <table class="text-sm w-full">
                <tbody v-if="buyFullFamily">
                  <tr>
                    <td>{{ family.name }} full family</td>
                    <td class="text-right">&euro;{{ family.family_price }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(style, i) in filteredCart" :key="`summary_item_${i}`">
                    <td>{{ family.name }} {{ styleName(style) }}</td>
                    <td class="text-right">&euro;{{ family.style_price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="bottom-0 bg-primary sticky w-full z-30" v-if="total > 0">
          <div class="flex items-center p-4">
            <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
            <button data-content="Soon" @click="formSubmit" class="bg-white hover:bg-black inline-block h-10 leading-10 rounded-full text-center hover:text-white w-10">Buy</button>
          </div>
        </div>

        <div class="absolute cursor-pointer inset-0 bg-red z-40" :class="isPoliticalShown ? '' : 'hidden'" @click="isPoliticalShown = false"></div>
      </div>
    </div>
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
import CustomSelect from "../components/CustomSelect.vue"
import Favicon from "../components/Favicon.vue"
import MarkerSlider from "../components/MarkerSlider.vue"
import SelectSlider from "../components/SelectSlider.vue"
import axios from "axios"
import { reactive } from "vue"

export default {
  name: 'Detail',
  components: {
    CustomSelect,
    Favicon,
    MarkerSlider,
    SelectSlider,
  },
  data() {
    return {
      refreshLock: false,
      family: null,
      isCartShown: false,
      isEditing: false,
      cart: [],
      style: null,
      users: '1 person',
      agree: false,
      primaryColor: 'white',
      secondaryColor: 'black',
      isDragging: false,
      buyButtonHover: false,
      fontSize: 0,
      $fonts: [],
      buyFullFamily: false,
      isPoliticalShown: false,
      isMenuShown: false,
      sampleText: '',
      markerSliderRefs: [],
      selectSliderRefs: [],
      licences: {
        'Desktop/Print': false,
        'Web': false,
        'App/ePub': false,
        'Video': false,
        'Social Media': false,
      },
      about: 'This website and typeface is still under development. We released it as public beta to catch any inconsistencies.\nSupported using public funding by Slovak Arts Council\n\u2133',
      contact: 'info@blueshell.xyz',
    }
  },
  created() {
    window.addEventListener('resize', this.windowResized)
  },
  destroyed() {
    window.removeEventListener('resize', this.windowResized)
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
    introAnimation() {
      if (document.visibilityState !== 'visible') return
      document.removeEventListener('visibilitychange', this.introAnimation)
      Object.entries(this.family.axes).forEach(([name, axis]) => {
        const animation = progress => {
          const value = progress * (axis.origin - axis.min) + axis.min
          this.updateColors(value)
          this.style[name] = value
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
    buyHover(value) {
      if (!this.isTouchDevice()) {
        this.buyButtonHover = value
      }
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
      this.family = this.$fonts.find(font => font.slug === 'gates')
      const fontLoader = new FontFace(this.family.name, `url(${import.meta.env.VITE_STATIC_URL}/${this.family.filename})`)
      fontLoader.load().then(fontFace => {
        document.fonts.add(fontFace)
        document.fonts.ready.then(() => {
          this.sampleText = this.family.sample_text
          const style = {}
          Object.entries(this.family.axes).forEach(([name, axis]) => {
            style[name] = axis.origin
          })
          this.style = reactive(style)

          this.$nextTick(() => {
            this.refresh()
            this.refreshLock = true

            Object.keys(this.family.axes).forEach(name => {
              this.style[name] = 0
            })

            document.addEventListener('visibilitychange', this.introAnimation)
            this.introAnimation()

            this.focus(this.$refs.textarea)
            this.addStyle()
          })
        })
      }).catch(function () {
        // todo
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
    blink(el) {
      el.classList.remove('animate-alert')
      // todo
      window.setTimeout(() => {
        el.classList.add('animate-alert')
      }, 100)
    },
    validateForm() {
      let valid = true

      if (!this.agree) {
        this.blink(this.$refs.agree)
        valid = false
      }

      if (Object.values(this.licences).every(licence => !licence)) {
        document.querySelectorAll('[data-licence]').forEach(el => {
          this.blink(el)
        })

        valid = false
      }

      return valid
    },
    formSubmit(e) {
      if (this.validateForm()) {
        this.menu(e)

        // axios.post(`${import.meta.env.VITE_API_URL}/pay-link`, {
        //   familyId: this.family.id,
        //   styles: this.styles,
        //   fullFamily: this.buyFullFamily,
        //   users: this.users,
        //   licences: this.licences,
        // }).then(({data}) => {
        //   window.Paddle.Checkout.open({
        //     override: data,
        //   })
        // })
      }
    },
    addStyle() {
      this.style = reactive({ ...this.style })
      this.cart.push(this.style)
    },
    bounceSliders() {
      this.markerSliderRefs.forEach(slider => {
        slider.bounce()
      })
      this.selectSliderRefs.forEach(slider => {
        slider.bounce()
      })
    },
    removeStyle(style) {
      this.cart = this.cart.filter(s => s !== style)
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
    windowResized() {
      this.refresh()
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
    styleName(style) {
      const values = Object.entries(style)
        .map(([key, value]) => {
          const rounded = Math.round(value).toString()
          if (rounded in this.family.axes[key].markers) {
            return this.family.axes[key].markers[rounded]
          } else {
            return rounded.padStart(3, '0')
          }
        })
        .join('')

      return values
    },
  },
  computed: {
    filteredCart() {
      const set = new Set()
      return this.cart.filter(style => {
        const name = this.styleName(style)
        const result = !set.has(name)
        set.add(name)
        return result
      })
    },
    styles() {
      return Object.fromEntries(this.cart.map(style => [this.styleName(style), style]))
    },
    fontFamily() {
      return `"${this.family.name}"`
    },
    total() {
      if (this.buyFullFamily) {
        return this.family.family_price
      } else {
        return this.filteredCart.length * this.family.style_price
      }
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
      if (!this.style) return

      const style = {}
      style.fontVariationSettings = Object.keys(this.style)
        .map(axis => `'${axis}' var(--${axis})`)
        .join(',')

      Object.entries(this.style).map(([key, value]) => {
        style[`--${key}`] = value
      })

      return style
    }
  },
  watch: {
    isCartShown(value) {
      if (!value) {
        this.isEditing = false
      }

      this.$nextTick(function () {
        this.refresh()
      })
    },
    isEditing() {
      this.$nextTick(function () {
        this.refresh()
      })
    },
    isDragging(value) {
      if (value === false) {
        this.refresh()
      }
    },
    style(newStyle) {
      const key = Object.keys(newStyle)[0]
      const value = newStyle[key]
      this.updateColors(value)
    },
    primaryColor(value) {
      this.$el.style.setProperty('--primary-color', value)
    },
    secondaryColor(value) {
      this.$el.style.setProperty('--secondary-color', value)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isCartShown = false
    next()
    this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
  }
}
</script>