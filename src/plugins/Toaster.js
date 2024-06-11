import {createToaster} from '@meforma/vue-toaster'

export const toaster = createToaster({
    position: 'top-right', //←表示場所の指定
    duration: 2500
})

export default toaster