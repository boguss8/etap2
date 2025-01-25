import './bootstrap';
import { createApp } from 'vue'
import CreateLinkForm from './components/CreateLinkForm.vue'
import LinksList from './components/LinksList.vue'

console.log('Vue app initializing...');
console.log('CreateLinkForm component:', CreateLinkForm);

const app = createApp({
    components: {
        'create-link-form': CreateLinkForm,
        'links-list': LinksList,
    },
});

app.mount('#app');
console.log('Vue app mounted');
