<template>
  <div v-if="family">
    <div class="fixed inset-0 min-h-full"
        :class="[isCartShown ? 'w-full lg:w-3/4' : 'w-full']">
      <div class="left-0 right-0 sticky top-0 w-full z-10">
        <div class="flex items-center px-4 py-2" :class="isEditing ? 'justify-end' : 'justify-between'">

          <div class="group" :class="isCartShown ? 'hidden' : ''">
            <span class="cursor-pointer uppercase" onclick="">Menu</span>
            <div class="absolute hidden group-hover:block">
              <div><span class="cursor-pointer hover:underline">About</span></div>
              <div><span class="cursor-pointer hover:underline">Contact</span></div>
            </div>
          </div>

          <div class="flex leading-10">
            <a href="#" class="hidden mx-5 hover:underline" :class="isCartShown ? '' : 'lg:block'">Specimen</a>
            <a href="#" class="hidden mx-5 hover:underline" :class="isCartShown ? '' : 'lg:block'">Trial</a>
            <div class="bg-secondary cursor-pointer h-10 leading-10 ml-5 rounded-full text-center text-primary w-10"
              :class="isCartShown ? 'hidden' : ''"
              @click="isCartShown = true"
              @mouseover="buyButtonHover = true"
              @mouseleave="buyButtonHover = false"
              v-show="!isCartShown">Buy</div>
            <div class="bg-secondary cursor-pointer h-10 leading-10 ml-5 rounded-full text-center text-primary w-10"
              :class="isEditing ? 'lg:hidden' : 'hidden'"
              @click="isEditing = false">Add</div>
          </div>

        </div>
      </div>

      <div class="absolute inset-0 p-10" :style="{ background: testerBackground, color: testerColor, fontFamily }">
        <div class="flex h-full items-center w-full" ref="container">
            <div class="balanced-text bg-transparent break-normal leading-none max-h-full outline-none text-center w-full whitespace-nowrap"
                :class="isDragging ? '' : 'select-auto'"
                ref="textarea"
                :style="testerStyle"
                style="font-variation-settings: 'wght' var(--wght); word-braek: keep-all !important;"
                spellcheck="false"
                contenteditable="true"
                @input="refresh"
                @paste="paste"
                @keydown="keydown"
                ><span v-html="sampleText" /></div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 mb-2 mx-4 right-0">
        <Slider v-for="(axis, key) in style"
          :key="key"
          :ref="setSliderRef"
          v-model="style[key]"
          v-on:update:modelValue="sliderChange"
          :min="family.axes[key].min"
          :max="family.axes[key].max"
          :markers="family.axes[key].markers"
          @start="isDragging = true"
          @end="isDragging = false"
          @select="refresh"
          :globalDragging="isDragging" />
      </div>
    </div>

    <div class="bg-beige bottom-0 fixed overflow-y-auto right-0 top-0 w-full lg:w-1/4" :class="isCartShown ? (isEditing ? 'hidden lg:block' : '') : 'hidden'">
      <div class="pt-2 relative min-h-full">

        <div class="pb-4 px-4">
          <div class="flex h-10 items-center justify-between leading-10">
            <span class="leading-none text-lg tracking-wide	uppercase">Buy {{ family.name }}</span>
            <div class="cursor-pointer h-10 relative rounded-full text-black w-10" @click="isCartShown = false">
              <span class="absolute border-current border-t-2 left-1/4 rotate-45 top-1/2 transform w-1/2"></span>
              <span class="absolute border-current border-t-2 left-1/4 -rotate-45 top-1/2 transform w-1/2"></span>
            </div>
          </div>

          <div>
            <div class="flex my-1 items-center">
              <p class="w-3/4">By dragging the sliders, you can design your style of {{ family.name }} typeface</p>
            </div>

            <p class="mb-2 mt-4">Your styles</p>

            <div :class="buyFullFamily ? 'opacity-50 pointer-events-none' : ''">
              <div class="cursor-pointer flex group" v-for="(s, i) in cart" :key="`cart_item_${i}`" @click="style = s; isEditing = true">
                <div :class="style === s && !buyFullFamily ? 'bg-secondary text-primary' : 'bg-white'" class="flex flex-grow items-center max-w-[calc(100%-3rem)] rounded-full">
                  <div class="h-10 min-w-[2.5rem] relative rounded-full" @click="removeStyle(s)">
                    <span class="absolute border-current border-t-2 left-1/4 rotate-45 top-1/2 transform w-1/2"></span>
                    <span class="absolute border-current border-t-2 left-1/4 -rotate-45 top-1/2 transform w-1/2"></span>
                  </div>
                  <div class="flex-grow min-w-0 px-4 truncate whitespace-nowrap">{{ family.name }} {{ styleName(s) }}</div>
                  <div class="lg:invisible lg:group-hover:visible px-4 whitespace-nowrap">Edit</div>
                </div>
                <div class="h-10 leading-10 rounded-full text-right w-12" :class="buyFullFamily ? 'invisible' : ''">&euro;{{ family.style_price }}</div>
              </div>

              <div class="cursor-pointer flex group" @click="addStyle">
                <div class="group-hover:bg-white flex flex-grow items-center max-w-full group-hover:max-w-[calc(100%-3rem)] rounded-full">
                  <div class="bg-white h-10 min-w-[2.5rem] relative rounded-full text-black">
                    <span class="absolute border-current border-t-2 left-1/4 rotate-0 top-1/2 transform w-1/2"></span>
                    <span class="absolute border-current border-t-2 left-1/4 rotate-90 top-1/2 transform w-1/2"></span>
                  </div>
                  <div class="min-w-0 px-4 truncate">Add style</div>
                </div>
                <div class="h-10 hidden group-hover:block leading-10 rounded-full text-right w-12">&euro;{{ family.style_price }}</div>
              </div>
            </div>

            <div class="cursor-pointer flex my-4 group w-full" @click="buyFullFamily = !buyFullFamily">
              <div :class="buyFullFamily ? 'bg-white max-w-[calc(100%-3rem)]' : 'group-hover:bg-white group-hover:max-w-[calc(100%-3rem)]'" class="flex flex-grow items-center rounded-full">
                <div class="bg-white h-10 min-w-[2.5rem] relative rounded-full text-black">
                  <span :class="buyFullFamily ? 'rotate-45' : 'rotate-0'" class="absolute border-current border-t-2 left-1/4 top-1/2 transform w-1/2"></span>
                  <span :class="buyFullFamily ? '-rotate-45' : 'rotate-90'" class="absolute border-current border-t-2 left-1/4 top-1/2 transform w-1/2"></span>
                </div>
                <div class="min-w-0 px-4 truncate whitespace-nowrap">{{ family.name }} full family</div>
              </div>
              <div :class="buyFullFamily ? '' : 'hidden group-hover:block'" class="h-10 leading-10 pl-2 rounded-full text-right w-12">&euro;{{ family.family_price }}</div>
            </div>
          </div>

          <p class="mb-2 mt-4">Licences</p>

          <CustomSelect v-model="users" :options="['1 person', '≤3 persons', '≤10 persons', '>10 persons']" />

          <div class="my-3">
            <span v-for="(value, key) in licences" :key="`licence_${key}`" @click="licences[key] = !licences[key]" :class="licences[key] ? 'bg-black text-white' : 'bg-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4">{{ key }}</span>
            <span class="relative" :class="isPoliticalShown ? 'relative z-50' : ''">
              <span @click="isPoliticalShown = !isPoliticalShown" :class="isPoliticalShown ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4">Political</span>
              <span class="absolute top-0 left-0 mt-9 text-sm" :class="isPoliticalShown ? '' : 'hidden'">Please contact us<br><a class="underline" href="mailto:info@blueshell.xyz">info@blueshell.xyz</a></span>
            </span>
          </div>

          <label class="cursor-pointer flex items-center mb-2 mt-4" v-if="total > 0">
            <span class="flex-grow ">Do you agree to <a class="underline" href="#">EULA</a></span>
            <input type="checkbox" v-model="agree" ref="agree" style="--alert-color: red" class="appearance-none bg-white checked:bg-black cursor-pointer h-10 rounded-full w-10">
          </label>
        </div>

        <div class="bg-white px-4 py-2" v-if="total > 0">
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

        <div class="border-black border-t-1 bottom-0 bg-beige sticky w-full z-30" v-if="total > 0">
          <div class="flex items-center p-4">
            <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
            <button @click="formSubmit" class="bg-white hover:bg-black inline-block h-10 leading-10 rounded-full text-center hover:text-white w-10">Buy</button>
          </div>
        </div>

        <div class="absolute cursor-pointer inset-0 bg-orange z-40" :class="isPoliticalShown ? '' : 'hidden'" @click="isPoliticalShown = false"></div>
      </div>
    </div>
    <Favicon :color="secondaryColor" />
  </div>
</template>

<style scoped>
[contenteditable=true] {
  font-family: inherit !important;
}

[contenteditable=true]::selection {
  color: var(--secondary-color);
  background: none;
}
</style>

<script>
import CustomSelect from "../components/CustomSelect.vue"
import Favicon from "../components/Favicon.vue"
import Slider from "../components/Slider.vue"
import axios from "axios"
import { reactive } from "vue"

export default {
  name: 'Detail',
  components: {
    CustomSelect,
    Favicon,
    Slider,
  },
  data() {
    return {
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
      sliderRefs: [],
      licences: {
        'Desktop/Print': false,
        'Web': false,
        'App/ePub': false,
        'Video': false,
        'Social Media': false,
      }
    }
  },
  created() {
    axios.get(`${import.meta.env.VITE_API_URL}/families`)
      .then(({data}) => {
        this.$fonts = data
        this.updateFamily()
      })
      .catch(function () {
        // todo error
      })

    window.addEventListener('resize', this.windowResized)
  },
  destroyed() {
    window.removeEventListener('resize', this.windowResized)
  },
  methods: {
    updateFamily() {
      this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
      const fontLoader = new FontFace(this.family.name, `url(${import.meta.env.VITE_STATIC_URL}/${this.family.filename})`)
      fontLoader.load().then(fontFace => {
        document.fonts.add(fontFace)
        document.fonts.ready.then(() => {
          this.sampleText = this.family.sample_text
          this.$nextTick(() => {
            const style = {}
            Object.keys(this.family.axes).forEach(name => {
              style[name] = this.family.axes[name].origin
            })

            this.style = reactive(style)

            this.$nextTick(() => {
              this.refresh()
              Object.keys(this.family.axes).forEach(name => {
                this.style[name] = 0
              })

              for (const [name, axis] of Object.entries(this.family.axes)) {
                setTimeout(() => {
                  this.animate(
                    function (t) {
                      return t;
                    },
                    progress => {
                      const value = progress * (axis.origin - axis.min) + axis.min
                      this.sliderChange(value)
                      this.style[name] = value
                    },
                    1200
                  )
                }, 500)
              }

              const el = this.$refs.textarea
              const selection = window.getSelection()
              const range = document.createRange()
              selection.removeAllRanges()
              range.selectNodeContents(el)
              range.collapse(false)
              selection.addRange(range)
              this.$refs.textarea.focus()

              this.addStyle()
            })
          })
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
    validateForm() {
      if (!this.agree) {
        const el = this.$refs.agree
        el.classList.remove('animate-alert')
        // todo
        window.setTimeout(() => {
          el.classList.add('animate-alert')
        }, 100)
        return false
      }

      return true
    },
    formSubmit() {
      if (this.validateForm()) {
        this.buyClicked = true
        axios.post(`${import.meta.env.VITE_API_URL}/pay-link`, {
          familyId: this.family.id,
          styles: this.styles,
          fullFamily: this.buyFullFamily,
          users: this.users,
          licences: this.licences,
        }).then(({data}) => {
          window.Paddle.Checkout.open({
            override: data,
          })
        })
      }
    },
    addStyle() {
      this.style = reactive({ ...this.style })
      this.cart.push(this.style)
      this.sliderRefs.forEach(slider => {
        slider.blink()
      })
    },
    removeStyle(style) {
      this.cart = this.cart.filter(s => s !== style)
    },
    sliderChange(value) {
      const mapped = 360 * value / 1000
      const opposite = mapped > 180 ? mapped - 180 : mapped + 180
      this.primaryColor = `hsl(${opposite}, 100%, 50%)`
      this.secondaryColor = `hsl(${mapped}, 100%, 50%)`
    },
    windowResized() {
        this.refresh()
    },
    refresh() {
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
      textarea.style.fontSize = `${Math.floor(this.fontSize)}px`

      return ratio
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
    styleName(style) {
      const values = Object.values(style)
        .map(value => Math.round(value).toString().padStart(3, '0'))
        .join('')

      return values
    },
    setSliderRef(el) {
      if (el) {
        this.sliderRefs.push(el)
      }
    }
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
        const style = {}

        if (this.style) {
          Object.assign(
            style,
            Object.fromEntries(
              Object.entries(this.style).map(([k, v]) => [`--${k}`, v])
            )
          )
        }

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
      const mapped = 360 * value / 1000
      const opposite = mapped > 180 ? mapped - 180 : mapped + 180
      this.primaryColor = `hsl(${opposite}, 100%, 50%)`
      this.secondaryColor = `hsl(${mapped}, 100%, 50%)`
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