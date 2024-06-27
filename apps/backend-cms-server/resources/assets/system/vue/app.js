import { createApp } from "vue";
const app = createApp();
import Display from './components/Display.vue'
import Room from './components/Room.vue'

app.component('Display' , Display)
app.component('Room' , Room)
app.mount('#app');