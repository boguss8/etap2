<template>
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="submitForm" class="space-y-4">
            <div>
                <label for="url" class="block text-sm font-medium text-gray-700">Enter URL to shorten</label>
                <input 
                    id="url"
                    type="url" 
                    v-model="url" 
                    placeholder="https://example.com" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
            </div>
            <button 
                type="submit" 
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                Shorten URL
            </button>
        </form>
        <div v-if="shortUrl" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-800">Your shortened URL:</p>
            <a :href="shortUrl" target="_blank" class="text-blue-600 hover:text-blue-800 break-all">{{ shortUrl }}</a>
        </div>
        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">{{ error }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            shortUrl: '',
            error: ''
        }
    },
    methods: {
        async submitForm() {
            try {
                const response = await axios.post('/links', { url: this.url });
                this.shortUrl = response.data.short_url;
                this.error = '';
                this.url = '';
            } catch (error) {
                this.error = error.response.data.message || 'An error occurred';
            }
        }
    }
}
</script>
