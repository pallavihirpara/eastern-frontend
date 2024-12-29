import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vue3-toastify/dist/index.css'
import Vue3Toastify from 'vue3-toastify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
// Import Vuetify styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Ensures 'mdi' is the default icon set
    aliases: {
      mdiUpload: 'mdi-file-upload', // Optional: Custom alias for clarity
    },
  },
});
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(Vue3Toastify);

app.mount('#app');