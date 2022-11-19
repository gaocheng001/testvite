import { createApp } from 'vue'
import App from './Viewer.vue'
import './asserts/styles/viewer/viewer.css'
const dom=document.createElement('div')
dom.style.height='100%'
document.body.append(dom)
createApp(App).mount(dom)

