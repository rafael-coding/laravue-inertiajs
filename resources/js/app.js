import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { createPinia } from 'pinia'
import './bootstrap';

createInertiaApp({
  title: () => 'Laravue Inertia',
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
    return pages[`./Pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
      const pinia = createPinia()
    createApp({ render: () => h(App, props) })
      .use(pinia)
      .use(plugin)
      .mount(el)
  },
})
