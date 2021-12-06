<template>
    <div class="bg-primary bottom-0 fixed overflow-y-auto right-0 top-0 w-full lg:w-1/4" :class="{ 'hidden': !cartShown || editing, 'lg:block': cartShown && editing }">
        <div class="pt-2 relative min-h-full">
            <div class="pb-4 px-4">
                <div class="flex h-10 items-center justify-between leading-10">
                    <span class="leading-none text-lg tracking-wide	uppercase">Buy {{ family.name }}</span>
                    <div class="bg-times cursor-pointer h-10 rounded-full w-10" @click="$emit('close')"></div>
                </div>

                <div class="flex my-1 items-center">
                    <p class="w-3/4">By dragging the sliders, you can design your style of {{ family.name }} typeface</p>
                </div>

                <p class="mb-2 mt-4">Your styles of {{ family.name }}</p>

                <div :class="{ 'opacity-50 pointer-events-none': fullFamily }">
                    <div class="cursor-pointer flex group" v-for="(style, i) in cart" :key="`cart_item_${i}`" @click="$emit('selectStyle', style)">
                        <div :class="selectedStyle === style && !fullFamily ? 'bg-secondary text-primary' : 'bg-white'" class="flex flex-grow items-center max-w-[calc(100%-3rem)] rounded-full">
                            <div class="h-10 min-w-[2.5rem] rounded-full" @click="removeStyle(style)">
                            <svg class="h-full w-10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 45 45">
                                <line style="stroke:currentColor;stroke-width:1.79;" x1="31.42" y1="31.72" x2="13.58" y2="12.72"/>
                                <line style="stroke:currentColor;stroke-width:1.79;" x1="13.58" y1="31.72" x2="31.42" y2="12.72"/>
                            </svg>
                            </div>
                            <div class="flex-grow min-w-0 px-4 truncate whitespace-nowrap">{{ styleName(style) }}</div>
                            <div
                            @click="$emit('edit', style)"
                            class="h-10 leading-10 lg:invisible lg:group-hover:visible px-4 rounded-full"
                            :class="{ 'bg-white text-black': selectedStyle === style }"
                            :style="selectedStyle !== style ? { backgroundColor: valueToColor(Object.values(style)[0], true), color: valueToColor(Object.values(style)[0], false) } : {}">Edit</div>
                        </div>
                        <div class="h-10 leading-10 rounded-full text-right w-12" :class="{ 'invisible': fullFamily }">&euro;{{ family.style_price }}</div>
                    </div>

                    <div class="cursor-pointer flex group" @click="addStyle">
                        <div class="can-hover:group-hover:bg-white flex flex-grow items-center max-w-full can-hover:group-hover:max-w-[calc(100%-3rem)] rounded-full">
                            <div class="bg-plus bg-white h-10 min-w-[2.5rem] rounded-full"></div>
                            <div class="min-w-0 px-4 truncate">Add style</div>
                        </div>
                        <div class="h-10 hidden can-hover:group-hover:block leading-10 rounded-full text-right w-12">&euro;{{ family.style_price }}</div>
                    </div>
                </div>

                <div class="cursor-pointer flex my-4 group w-full" @click="fullFamily = !fullFamily">
                    <div :class="fullFamily ? 'bg-white max-w-[calc(100%-3rem)]' : 'can-hover:group-hover:bg-white can-hover:group-hover:max-w-[calc(100%-3rem)]'" class="flex flex-grow items-center rounded-full">
                        <div :class="fullFamily ? 'bg-times' : 'bg-plus'" class="bg-white h-10 min-w-[2.5rem] rounded-full"></div>
                        <div class="min-w-0 px-4 truncate whitespace-nowrap">Full family</div>
                    </div>
                    <div :class="{ 'hidden can-hover:group-hover:block': !fullFamily }" class="h-10 leading-10 pl-2 rounded-full text-right w-12">&euro;{{ family.family_price }}</div>
                </div>

                <p class="mb-2 mt-4">Licences</p>

                <CustomSelect v-model="users" :options="['1 person', '≤3 persons', '≤10 persons', '>10 persons']" />

                <div class="my-3">
                    <span v-for="(value, key) in licences" :key="`licence_${key}`" @click="licences[key] = !licences[key]" :class="licences[key] ? 'bg-black text-white' : 'bg-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4" data-licence>{{ key }}</span>
                    <span class="relative" :class="{ 'relative z-50': politicalShown }">
                        <span @click="politicalShown = !politicalShown" :class="politicalShown ? 'bg-black text-white' : 'bg-white'" class="cursor-pointer h-10 inline-block leading-10 rounded-full px-4" data-licence>Political</span>
                        <span class="absolute top-0 left-0 mt-9 text-sm text-white" :class="{ 'hidden': !politicalShown }">Please contact us<br><a class="underline" href="mailto:info@blueshell.xyz">info@blueshell.xyz</a></span>
                    </span>
                </div>

                <label class="cursor-pointer flex items-center mb-2 mt-4" v-if="total > 0">
                    <span class="flex-grow">Do you agree to <a class="underline" href="#">EULA</a></span>
                    <input type="checkbox" v-model="agree" ref="agree" class="appearance-none bg-white checked:bg-black cursor-pointer h-10 rounded-full w-10">
                </label>

                <div v-if="total > 0">
                    <p class="mb-2 mt-4">Summary</p>
                    <div class="bg-white px-4 py-2">
                        <table class="text-sm w-full">
                        <tbody v-if="fullFamily">
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
                    <span class="flex-grow px-4 text-right">&euro;{{ total }}</span>
                    <button data-content="Soon" @click="formSubmit" class="bg-white hover:bg-black inline-block h-10 leading-10 rounded-full text-center hover:text-white w-10">Buy</button>
                </div>
            </div>

            <div class="absolute cursor-pointer inset-0 bg-red z-40" :class="{ 'hidden': !politicalShown }" @click="politicalShown = false"></div>
        </div>
    </div>
</template>

<script>
import CustomSelect from "./CustomSelect.vue"
import axios from "axios"
import { reactive } from "vue"

export default {
    props: ['cartShown', 'editing', 'family', 'selectedStyle', 'valueToColor'],
    emits: ['selectStyle', 'edit', 'submit', 'close'],
    components: {
        CustomSelect,
    },
    data() {
        return {
            cart: [this.selectedStyle],
            politicalShown: false,
            fullFamily: false,
            agree: false,
            users: '1 person',
            licences: {
                'Desktop/Print': false,
                'Web': false,
                'App/ePub': false,
                'Video': false,
                'Social Media': false,
            },
        }
    },
    methods: {
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
                this.$emit('submit', e)

                // axios.post(`${import.meta.env.VITE_API_URL}/pay-link`, {
                //   familyId: this.family.id,
                //   styles: this.styles,
                //   fullFamily: this.fullFamily,
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
            const style =  reactive({ ...this.selectedStyle })
            this.$emit('selectStyle', style)
            this.cart.push(style)
        },
        removeStyle(style) {
            this.cart = this.cart.filter(s => s !== style)
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
        blink(el) {
            el.classList.remove('animate-alert')
            // todo
            window.setTimeout(() => {
                el.classList.add('animate-alert')
            }, 100)
        },
    },
    computed: {
        styles() {
            return Object.fromEntries(this.cart.map(style => [this.styleName(style), style]))
        },
        total() {
            if (this.fullFamily) {
                return this.family.family_price
            } else {
                return this.filteredCart.length * this.family.style_price
            }
        },
        filteredCart() {
            const set = new Set()
            return this.cart.filter(style => {
                const name = this.styleName(style)
                const result = !set.has(name)
                set.add(name)
                return result
            })
        },
    }
}
</script>