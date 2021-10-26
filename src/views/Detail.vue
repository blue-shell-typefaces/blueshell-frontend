<template>
  <div v-if="family">
    <div :style="isDragging ? 'user-select: none;' : ''">
      <div class="fixed inset-0 min-h-full"
          :class="[isCartShown ? 'w-full lg:w-3/4' : 'w-full']">
        <div class="left-0 right-0 sticky top-0 w-full z-10">
          <div class="flex justify-between px-4 py-2">
            <Menu :fonts="$fonts" />
            <div class="flex leading-10">
              <a :href="family.specimenUrl" class="hidden lg:block mx-5">Specimen</a>
              <a :href="family.trialUrl" class="hidden lg:block mx-5">Trial</a>
              <div class="cursor-pointer h-10 leading-10 ml-5 rounded-full text-center w-10"
                :style="{ background: secondaryColor, color: primaryColor }"
                @click="isCartShown = true"
                @mouseover="buyButtonHover = true"
                @mouseleave="buyButtonHover = false"
                v-show="!isCartShown">Buy</div>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 p-10" :style="{ background: testerBackground, color: testerColor, fontFamily }">
          <div class="flex h-full items-center w-full" ref="container">
              <div class="balanced-text bg-transparent break-normal max-h-full outline-none text-center w-full"
                  ref="textarea"
                  :style="testerStyle"
                  style="font-variation-settings: 'wght' var(--wght);"
                  spellcheck="false"
                  contenteditable="true"
                  @input="refresh"
                  @paste="paste"
                  @keydown="keydown"
                  >{{ family.sampleText }}</div>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 mb-2 mx-4 right-0">
          <Slider v-for="(axis, key) in style" :key="key" v-model="style[key]" @input="sliderChange" :min="family.axes[key].min" :max="family.axes[key].max" :markers="family.axes[key].markers" :background="secondaryColor" :color="primaryColor" @start="isDragging = true" @end="isDragging = false" :globalDragging="isDragging" />
        </div>
      </div>

      <div class="bg-beige bottom-0 fixed overflow-y-auto pt-2 right-0 top-0 w-full lg:w-1/4" v-show="isCartShown">
        <div class="pb-4 px-4">
          <div class="flex h-10 items-center justify-between leading-10">
            <span class="leading-none uppercase">Buy<br>{{ family.name }}</span>
            <div class="cursor-pointer h-10 relative rounded-full text-black w-10" @click="isCartShown = false">
              <span class="absolute border-current border-t-1 left-1/4 rotate-45 top-1/2 transform w-1/2"></span>
              <span class="absolute border-current border-t-1 left-1/4 -rotate-45 top-1/2 transform w-1/2"></span>
            </div>
          </div>

          <div>
            <div class="flex my-4 items-center">
              <div class="border border-black h-10 mr-3 rounded-full w-10"></div>
              <p class="text-xs w-1/2">By dragging the sliders, you have designed your style of {{ family.name }} typeface</p>
            </div>

            <p class="mb-2 mt-4">Your styles</p>

            <div :class="buyFullFamily ? 'opacity-50 pointer-events-none' : ''">
              <div class="cursor-pointer flex group" v-for="(s, i) in cart" :key="`cart_item_${i}`" @click="style = s">
                <div :class="style === s ? 'bg-black text-white' : 'bg-white'" class="flex flex-grow items-center rounded-full">
                  <div class="h-10 relative rounded-full w-10" @click="removeStyle(s)">
                    <span class="absolute border-current border-t-1 left-1/4 rotate-45 top-1/2 transform w-1/2"></span>
                    <span class="absolute border-current border-t-1 left-1/4 -rotate-45 top-1/2 transform w-1/2"></span>
                  </div>
                  <div class="px-4">{{ styleName(s) }}</div>
                </div>
                <div class="bg-black h-10 leading-10 rounded-full text-center text-white w-10">&euro;{{ family.stylePrice }}</div>
              </div>

              <div class="cursor-pointer flex group" @click="addStyle">
                <div class="group-hover:bg-white flex flex-grow items-center rounded-full">
                  <div class="bg-white h-10 relative rounded-full text-black w-10">
                    <span class="absolute border-current border-t-1 left-1/4 rotate-0 top-1/2 transform w-1/2"></span>
                    <span class="absolute border-current border-t-1 left-1/4 rotate-90 top-1/2 transform w-1/2"></span>
                  </div>
                  <div class="px-4">Add style</div>
                </div>
                <div class="h-10 hidden group-hover:block leading-10 rounded-full text-center w-10">&euro;{{ family.stylePrice }}</div>
              </div>
            </div>

            <div class="cursor-pointer flex my-4 group" @click="buyFullFamily = !buyFullFamily">
              <div :class="buyFullFamily ? 'bg-white' : 'group-hover:bg-white'" class="flex flex-grow items-center rounded-full">
                <div class="bg-white h-10 relative rounded-full text-black w-10">
                  <span :class="buyFullFamily ? 'rotate-45' : 'rotate-0'" class="absolute border-current border-t-1 left-1/4 top-1/2 transform w-1/2"></span>
                  <span :class="buyFullFamily ? '-rotate-45' : 'rotate-90'" class="absolute border-current border-t-1 left-1/4 top-1/2 transform w-1/2"></span>
                </div>
                <div class="px-4">{{ family.name }} full family</div>
              </div>
              <div :class="buyFullFamily ? 'bg-black text-white' : 'hidden group-hover:block'" class="h-10  leading-10 rounded-full text-center w-10">&euro;{{ family.familyPrice }}</div>
            </div>
          </div>

          <p class="mb-2 mt-4">Licences</p>

          <CustomSelect v-model="users" :options="['1 body', '≤3 bodies', '≤10 bodies', '>10 bodies']" />

          <div class="my-4">
            <span v-for="(value, key) in licences" :key="`licence_${key}`" @click="licences[key] = !licences[key]" :class="licences[key] ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4">{{ key }}</span>
          </div>

          <label class="cursor-pointer flex items-center mb-2 mt-4" v-if="total > 0">
            <span class="flex-grow ">Do you agree to <a class="underline" href="#">EULA</a></span>
            <input type="checkbox" name="agree" class="appearance-none bg-white checked:bg-black cursor-pointer h-10 rounded-full w-10">
          </label>

          <!--
          <div class="my-2" v-if="total > 0">
            <label class="cursor-pointer flex items-center">
              <input v-model="newsletter" type="checkbox" name=
              "newsletter" class="appearance-none bg-white checked:bg-green cursor-pointer h-10 rounded-full w-10">
              <span class="pl-2">Subscribe to newsletter</span>
            </label>

            <div class="mr-10" v-if="newsletter">
              <input type="text" name="email" placeholder="Enter e-mail address" class="bg-white h-10 leading-10 placeholder-current rounded-full text-center w-full">
            </div>
          </div>
          -->
        </div>

        <div class="bg-white border-black border-dashed border-t-1" v-if="total > 0">
          <div class=" px-4 py-2">
            <table class="text-sm w-full">
              <tr v-for="(style, i) in cart" :key="`summary_item_${i}`">
                <td>{{ styleName(style) }}</td>
                <td class="text-right">&euro;{{ family.stylePrice }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="border-black border-t-1 bottom-0 bg-beige sticky w-full">
          <div class="flex items-center p-4" v-if="total > 0">
            <div class="flex-grow px-4 text-right">&euro;{{ total }}</div>
            <button @click="formSubmit" class="bg-white inline-block h-10 leading-10 rounded-full text-center w-10">Buy</button>
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
</style>

<script>
import CustomSelect from "../components/CustomSelect.vue"
import Menu from "../components/Menu.vue"
import Slider from "../components/Slider.vue"
import axios from "axios"

export default {
  name: 'Detail',
  components: {
    CustomSelect,
    Menu,
    Slider,
  },
  data() {
    return {
      family: null,
      isCartShown: false,
      cart: [],
      style: null,
      users: '1 body',
      primaryColor: 'white',
      secondaryColor: 'black',
      isDragging: false,
      buyButtonHover: false,
      fontSize: 40,
      $fonts: [],
      buyFullFamily: false,
      licences: {
        'Desktop/Print': false,
        'Web': false,
        'App/ePub': false,
        'Video': false,
        'Social Media': false,
        'Political': false,
      }
    }
  },
  created() {
    axios.get(`https://static.blueshell.xyz/data.json`)
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
  mounted() {
    this.$nextTick(() => {
      // this.$refs.textarea.focus()
    })
  },
  methods: {
    updateFamily() {
      this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
      const fontLoader = new FontFace(this.family.name, 'url(https://static.blueshell.xyz/BSGatesBeta1VF.ttf)')
      fontLoader.load().then(fontFace => {
        document.fonts.add(fontFace)
        document.fonts.ready.then(() => {
          const el = this.$refs.textarea
          const selection = window.getSelection()
          const range = document.createRange()
          selection.removeAllRanges()
          range.selectNodeContents(el)
          range.collapse(false)
          selection.addRange(range)
          this.$refs.textarea.focus()

          this.style = {}
          for (const [name, axis] of Object.entries(this.family.axes)) {
            // this.$set(this.style, name, axis.min)

            this.animate(
              function (timeFraction) { return timeFraction },
              progress => this.style[name] = progress * (axis.origin - axis.min) + axis.min,
              1000
            )
          }

          this.addStyle()

          this.refresh()
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
        users: this.users,
      }).then(({data}) => {
        window.Paddle.Checkout.open({
          override: data.url,
        })
      })
    },
    addStyle() {
      const style = { ...this.style }
      this.style = style
      this.cart.push(style)
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
      this.fontSize = 40

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
        .map(value => value.toString().padStart(3, '0'))
        .join('')

      return `${this.family.name} ${values}`
    },
  },
  computed: {
    fontFamily() {
      return `"${this.family.name}"`
    },
    total() {
      return this.cart.length * this.family.stylePrice
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

        if (this.isDragging) {
          Object.assign(style, { 'user-select': 'none' })
        } else {
          Object.assign(style, { 'user-select': 'text' })
        }

        return style
    }
  },
  watch: {
    isCartShown() {
      this.$nextTick(function () {
        this.refresh()
      })
    },
    isDragging(value) {
      if (value === false) {
        this.refresh()
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isCartShown = false
    next()
    this.family = this.$fonts.find(font => font.slug === this.$route.params.family)
  }
}
</script>