<template>
    <div class="h-full p-10">
        <div class="h-full flex items-center" ref="container">
            <div class="text-center w-full" ref="textarea" @paste="paste" @input="refresh" contenteditable="true" :style="`word-wrap: normal;`">{{ text }}</div>
        </div>
    </div>
</template>

<style scoped>
[contenteditable="true"] {
    outline: 0;
}
</style>

<script>
import { debounce } from "lodash"

export default {
    data() {
        return {
            text: '',
            debouncedRefresh: null,
            fontSize: 120,
        }
    },
    created() {
        this.debouncedRefresh = debounce(this.refresh, 5)
        // window.addEventListener('click', this.fit)
    },
    mounted() {
        // generate random text
        const words = Array.from({length: this.getRandomLength(10, 100)}, () => { return this.getRandomString(this.getRandomLength(5, 30)) })
        this.text = words.join(' ')

        // this.text = 'ZiylMvsFZwwTrIMFn TkMBJzfmwxZPrKLqveVIrhNmb xaIHfbsCqHx tLjDKjtyJ efqwTNMEFnrLlRjw RClcISDNWbtILdBQPxoWqzkKmIhRw HCsZVQVrHpbyeexprXEKCUYLXRIH ndfNKkpjhwbAXT mbbjyxIsseTDy ATEkqkXxFvKVPyGDOlkVLueirwY gGGLkdVizb uQFnDGgk YLejCIPCCpJQjzqOHeKeVu bhLgpcMEaaRFlDUIErtCdWKkaKA YAYjjnWySWwTqmXVxXd EmqVLrJIHRNSezpxeJVyQ FyIsfowRFKNUCvcHPxilMbIeMVF LzDfyRcPWOmRzoywBpLSDWhPIPXP YwRDFiOYtKuJd vHPMkDCDhOyYIeVYjWsoHfTdcemB yLQCCQEMHxFzmskskNicBbvsIoA XTLAZJFnOOcKTCnV acqZlCDOW NLGPjvR kgJJbhSjDrzsTcRLlgdULJWqSqp JYAwGUtZfatPg jDhXXebkAjCRBFYFPbqYUXRr dvcFxmghbdN rcZREXgzrqTdR hCUuAuZ VhVltUKqMMFIMJkcCagQWgXNzVw buOHHbN oPKYureTJbyqldukIUCNgZC dyZMLyYIdaYRyhzQ CjCMCgr zeEhuwRfFQcHWGTBnmVrmbWOLykcw MzyoQVLFFkKIDA aXRhgmmIpMikcmnYxbvQHPp wAMVVgkr lqLWFijPXpEDbIQTh hWieYuOFHTfYZFetgBgpeh gzPhdVTPEuTZWFdsGAMfGuxmBVk mCEntLomikLfhLIfoSarHfxbgt oWtLWoOOlHtCPTu dEpMgfhnuOzB monOcvZKqyZ rRfYqagcAiKRb MPzaajhdCORTAbssyKIElykpM PwDJlzlCtjfkUQ FIdRDiDszAAfUJKAfkUHCpXejR DPbGe aFsdpYKSoNELxGLot SsJNtcOhuYWxAfYPJayAnxrL pMEUrh MKqiqqtSIunKNOyg QKdsBHWZyzydGCUxTnrIqVmbBdlB SzwPxPpptcfvlOU IHowMfzQuf rxpXq OmveWYTe HBeIYpUoykfXkrbqu QcjOzVmpZKNEbChStuWgiwRE djNZyrrtBKxGOjTNKjmmRMNffLPZr lCWcYkEAzVSv UJexWBLqsyyWoLblD xPRPjaiGdWHrjTDiPnj DHbMhydavYJMAJmHdGOCaDYdWl PpIiapDuJsHBaXtktClHozvQF KpKVWMjWDFxuxoa jHVVUNPYvWNLLqvcgkeV goKhevbDbUUSa EDEnAESmmoIQ NxmwP OIBjKFZwjXkRgZDzv iAuqrSxWcPubRgGvX BjMnA VKBuqcDCphCNAawHhqullPzljLP ZurPgfJiryME BmUcxFKMYWOu lkLmRLosCWzJ qoQmZqpyaHwBp AbmiH DMeNiHJoBaXWLRcwCNwvCST VyfcCpo VFdVhHTxYwtpbanusG rXaBcirKkiGJQC znOcy IjbGQeHpkmSt PyQCxLSMOPaBfcGKK nAzrwYmwPMRcxhqUaIEb KFcRftADzXMTRhlNyOhjHOHaAnx XjojqwzgBuquiIIN tGhTrBbKfoeLCUtnTSIRyAfMYA SojgoLJJqoCJbCebQCPorHV GQTlrVcYhMcukLmJ lbxzvmFMnradpRoBbrzDVqqbQrvt drSoz XNhTIZrIOECFMoNvqwbJGliGcEk BkdXmysuvDTyotVMyCkfJSwGuUPAQ FbNYiUkKVemU twxEHtdCOEwpTaMUZ mqTtEPWPOwOOgoDVUMjTCDxCov BVGMpfOccoChittUHDqLHVs hMTVIqyn HgfHkjhBhJPspyFJrBi UfumfEvzpwPl IkkBnMNdbWpFhKgetCC LOUSFLOTSl RRShIWeLExRomvPvYQJuvixG glnYRZqz bkGuJSHImmaRENSpYiEosUaeFN lVVaoOC HNNsyNvAqRoiAYMgMHWZi IhJFsNfe wrWdcpouvUtJVAs ZiTEctZENjdRIDhdrHlsJWs dUXQTYwVErnItxvj wgcvTjDsyjrLNB GWCwisXcF yZUyTT KxgUzxZXehtYpSGnvGkpvn OLaHWVxAHqFiSTiYmowxzewmmE GZSWpj EetYCyi pbJtnkEFeuSwiHlpKNvspcGSSixT bSaByaWQPpukavIUZSvXxNfZC lGOEmWBiBNvzdvlSDx luvuqzsahEjGntqgzrJZk GXbOzLZcpVTBxgUOswAfrNgIqWo ynCWD oTLyzBNVzCBRZuHxjzzMm pHNoMlhQUgCIGJKegIgbHLHN glsrUMpbLGyJKawkbKGiTrhpwidTi tZXCKoygvQkNslNCvPTeAeKN FgzJAWlQxMv AaFvblIHRNTNVWCfJLPjaX rJZbSbG PdIqNXd dVsntbaVMvk nbXITPLmfQiJWnQMMKHkMxftsqZ CnKimUkmcVfNGKiukdtlMSM SABhxIReJdUKqQLBUzacaUVHi EBINkPxbdQQUyDxkdEAoir RLTyZNKnKSiuFTGNWWCV UnPryShGndTGgLZcf TOguhBVAFSsUYgafaSqUEWXexWcK nYXUpdjmppsGGLbtidfjGBdhQQbC jvuJbZeScwUxuhVvDGJJZveOlWTTl YvzKyAJqsoBrkswUJlQgzwJ IMlrPAfpWFRahvBhbfE VWhpTVFMRHxDoKXwYcYmKQs xIRBorfkVDNWtiFmILZyQXYd hMGEg SsJIDbydddxvVXewcZ jEfNvOOTBdgjhiGnII jrFnxMeQasOEmyTJskZJTBXAfhhR QpiukokXAUIAwocIFXqgqGiC KbihozoufqCZprSUQGmZI AVfnvesugefDcJnbAhOnVLCvFcXtW ifpYTzUAt gagNzYaygjJbzGtvFGhxfY FzDhOaqb LzhdzNinfcYQa ceishODGfEMEVMUCKTQX cKmVSypDAVZyqQVfnEtU zTdKf teVlkqHBQrqwkltjIXKMHd hLmjDiXP foFDCeZTjfmGOCgh OIkXJWjmzPb ZCNOvqaTHXWxIvMVQmNGWqME qsQifcgimbNmKBucw jAqEhwwjqhmyjGr XNyostneabmTfacuDKNCvv zJlsFbgszi PkrLdBHHlYbyUnQWIVkyyTtwhb cpTGAJtWtZRa eZIKsdFNyjzoE NLSjOINsUbzMBPxa hwXvxPTbGKJ sVPtOLePVgVaFzxuqIHSmHjsREO ayiEwfMURkcWkVH qHbVmFlKqWFRrouZNCpg aWupUJcONBLIfhhfpEaxfuD oTpVtozeUPAlcDJiyIqDtay mRADf PMiOuvsZhN CoNrhBYotmA nkcXnFJchtU TWgyskxsgKzqXkxGkpqLLnMUc PzvZOL oGthhbIriU puuiDlPzEydEKFGt NWQwbkhAPwKhxHYrB QnPhVety McZZKjooGl HkeCEiJTgdiyeVQuVykfgaQAlgB xfMuwEnQwDNsDnMu AhEdayRtBREuBIosxQrJuAScEVN wHQNDvW SgIhNoymoWkyOjp yjHsRKaOzFP aqEaRBMZWViXgHNyqUavDtjC QADIndATXASQNKEramDpsGQW sJGaocMEwKil jPeFVGf dlDLalNWDunyczHsJVhvHKElBiBz CKlaoMqlGAxdyHRzJscPpy wgZfRVEfQ AUPYEgsvYBlVVng EqSLKNGtCyNdqGiwmKQJzPu ljZFEsqwPiQeDubBAsIZqEZqS SsvifWnNOqcJu KIqXoQhOZmsvVTWeXixahLIKmDrxi fxKbSELmhJuyxsDoQVvt WSSnroWyrOgadsJeUMot rziLdGBtHqQNiZGlxSMhjlOyts IiMyh bKyXpmfXrrWZvQP RjECLidwGnJjIdMbqqQkIGt zeVkUginJy lXMvyQrYljz XsQjXrsUdykDzkYwGdfoEyyG NtIEudIipDAxqlRrzRGrkjdDGyE OjnamlxWYbMIcfDK KOtSAfdKBNzQN KSWdJdFxkMcdXthywMZByNECvlTz BmjIjPEV LRaytSfASmhXhxSP QrBayNbuMOOpRFoRNyFKsE qfLUWE cdtmLbuixDIDYpx irCplXByXIwyqFkrtnpFfS sAkyfheybYIyRGfWZHB ZRxHzKgfZcZvffLVlRBlbHFYX XKVnZuhBJWunhFh isPYHuLKPBOPOjctKKrfuMDyWQCLd zriobOfIWdx GQzGxKLwcYWA FempcTOjMHvCYOhqOAhxj ZmXOztEKemqwQMsYDkAlJmBXho nbzwRKEpnzwvlKmpOadiKzoPZk oZeOvkUJGVMYulMchK bMJZSQZJHlSNhNvHlhTtfiQfpMMCC QXwjivSfefNPhFLRqiBVtdyseyINX IPwPpkLGYwYyLSAwgjozZViSrnZpC bWZTogpV XYqPuFXakOdIkUzfuaaVwjq eaYAbmLv shAwMJQxxQDWnDTAFEUreWeHKLDYw TfkgTToAecQxkEf qtduCBwBpWAZqDtUIApUCn BKVHLlfKSzCpAecFdMNzlHFHop WHzmHeBKtVoaBtmqbBJNkCpFtz wWqKGwRwLdSmZCG gfvQlvNncwxvgxnwoHsbKv AluqRXGypPjYllyFaXJ XEHcGNxBIOEhhHEfPJ mdYgImNkXYs RhlZSSuwznEzWGZGGA cSdKnB EWYVFISPoUkgFnwyKyEuIKYCn PIHzmYQmkkzPqYgXeIf jyYqMrAwukspGjsIDupJIcvCIOAmx efWgwcNy ijSwDQQmlDDtRedBVsrow wCFFmCXvbGlp FFvUwC iOpGaPCHbyRVJdU HufrSiQXWkJmMxk SxCPlPtrQZnbsOhJHHgODdFE LJCzHhTyNIVSGTjk jphaOFcxiKaxDBRrVZvpsnrEfCI vAKOt ucVTqGtmDpWQPZGpVJTT KLXssAPeMtKizW VVZUXqHJAKkXUwOrFxnaL CgyVRSYWYUDEpUs ZEfpsgqXHpyviVnO pDyrkSLeaK PrzZXMBYgPhN IUFprAuyUqjHFkRSlTW AzccTeGriF UriBvwtVhcvpI ntybcvDqLsFuPVFuFqCZenXwWK UFdcPagKpePRwFqjjHADivAgW blvVLxBASgHNhEMOFILJtJZpFTn laDrBAdSacpHqrorsHLlEDcWfF aNdbUwMzOpuMfPORz NSpWoFGJQUxfVdVnanmtV XMCDw ScrHOLqInLj QupGCjWihgyoCEbkR wNxRyeKOmYmUGuXSjl lrnSsrqaqQQCCtw WxiHkhNzu NkcojWJdqPlgCj uQkvbblVvwapHxKQuCuPc XjwOtfiyaeNnKT zOSfuAkYjGB GXgeIExPiCucQtVXYoKeEtYEPgP btgEKkiAycrycCt IlRdSIRSExbXYIMxqEuYR SVJeyIIul tmBhXzyJHkidrcmgGVqCaWfQTxak jknLbKZlptVz LgEtBpXwNNPDxRzAFLUrcQDbTe TtLKiOnDUejckNNCOETQouImhZkt mWhIyTXRNLgWGsFaq rdJAndrjGMZtAxRPTJTGnRSeF SXBpSzqdyYVRBPybdrzMiYT esCHalQQ OzfQVPYnmUamsomKZ dtIfjTVOpZMHIpKwnaepcnYHps kllrgWlch rpWVBWlYeZhbhtcGzdEbNBzj qAaRrepnbgqwyvmTOB MnKDNBlnB phhIGrztIVpRMtRyaGQG rgmjRvtgv hXeWZGNpGTW ldhWRYGnzLFhKRdfSdsB FLvgQHHMebOytApmjBpIyev FbaQlEwTxuye HWxprHyNEJQusM BGbkdTyDBkiaS IXMlj TXAahthHGQCsDiek HuClXk EyLYPNJpWacfqilQgAeMHXdanzUGH mRYfnGAmjqDHuYvCdfGnwZsJ TJmDIpqrElZxJiPTfZyDvxpkI TsvufPuFHlUtkoBTPdxgodAoYCv XRypzgKZdavUkBIelvUiV WbYpsnkUPlIWKF lpgKB hHtnqCUznjjVZOkpgOslhL LUGptGjkUrKkHqARwM MTZIkiVcfjPxzadxOtEreYnNO uCTtNviaxiR VbmxSyzs DXLlUakylcFJL RByytmAWXXyUqwMWTvCQ jKMzibNNgkXfnUdhuoFWiYoqB eHBTYMmNQeEpTqeIIL AyhqsVYQajxpWJ iOcyjYNz TPdHlivxqPPdQcUDbCziVMjIMOcy TSSGAlQuiERhjyDyzi PvRLMejQRQUcnsLYeyvOBDxajTtD ubfuIvm YRfdNLulzgUeIqrlESycaAaLgonQ PSmpktRjpFSFQcFOOOp NDSLVTFBVLyXbSSpKoFLaOfNYr mRlzCiMCTQnk sLgbHopdmHKZZbxbbtHSoiBLDSZ kuWAdKnvxotCkbuXc QGWyyBK sMoouTFHYpqV oXoxiHKXlrkzpcQgDPlzg TyYQJQeqzoTSMmanRMDRaZqoI fUeDKiLHHPzBVtRJmZga XXhcaTuVbbsWnXoOfcNimIImckJ OgjZhDzLNkbHuGrntCFVFjIs NzDJBrXDdPES DmcqYsiUcOBuujmbO EcWcCzzVimgHB ewdtj njTNgbJuGTmUjfBw wuibSLygx LgQFtrrXXLZtFbv xCIMAsrPkAIS SmRRWpehADujqz yNSURnFX PEdyPDyzUAG OdkDzkkTiEdjReOvrjyTLtIMLElPQ XYOGjygPS HLJwaDsvbBzx lzTHi XXVoEDedzsYLBHcsu FYacIsBwSVD DSeQsfKjzUr YsIDsJPGlZ vYYPlNQMBRBXmtnAoWbkQmX wNPtZhjlAspnsY fDVOLROKT gMsPEuHzscFlFxQcc thGtNvPzK sjMDbcVVecAoemtxfhSei MHrbTgIMslHmGFCVmlOBWYY kBkOxstnqoKeiq OqMyyhDKDRwDrcOVLK wXlKbOJgqIUkzfwzqKxMSBQXzBe NLTZksAAlCpnoGflFYmzxPW yJiDBnlnkFfBOrRysjBbF KuWhpidZBnkaAekQQUmlkZox oBQfECFCxtEIfUK kowZrEdNJPqr ASOzGZu CdtDGOgyyrECXZCjCLlHoHrlHo kRCpPCOHItQlxJVZwx kDJDWMrTKHDcikegaaTSqy ZOdappCMFKJW'
        // this.text = 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'

        // this.$nextTick(() => {
        //     this.refresh()
        // })
    },
    methods: {
        getRandomString(length) {
            var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            var result = ''
            for ( var i = 0; i < length; i++ ) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
            }
            return result
        },
        getRandomLength(from, to) {
            return Math.floor(Math.random() * (to - from) + from)
        },
        paste(e) {
            e.preventDefault()
            const text = e.clipboardData.getData('text/plain')
            document.execCommand('insertText', false, text)
        },
        refresh() {
            const container = this.$refs.container
            const containerHeight = container.offsetHeight
            this.fontSize = containerHeight / 2

            // const initialOffsetWidth = textarea.offsetWidth
            // const initialOffsetHeight = textarea.offsetHeight
            // const initialScrollWidth = textarea.scrollWidth
            // const initialScrollHeight = textarea.scrollHeight
            // console.log(initialOffsetWidth, initialOffsetHeight, initialScrollWidth, initialScrollHeight)

            // resize method 1
            // const ratio = 0.9
            // while ((textarea.offsetWidth < textarea.scrollWidth || textarea.offsetHeight < textarea.scrollHeight)) {
            //     fontSize *= ratio
            //     textarea.style.fontSize = `${fontSize}px`
            // }

            // resize method 2

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
        }
    }
}
</script>

<style scoped>
[contenteditable="true"] * {
    font-family: inherit !important;
    font-size: inherit !important;
}
</style>
