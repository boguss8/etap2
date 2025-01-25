<template>
    <div class="mt-8">
        <h2 class="text-xl mb-4">Recent Links</h2>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <table v-if="links.length > 0">
                <thead>
                    <tr>
                        <th class="p-2">Original URL</th>
                        <th class="p-2">Short URL</th>
                        <th class="p-2">Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="link in links" :key="link.id">
                        <td class="p-2">{{ link.original_url }}</td>
                        <td class="p-2">{{ link.short_url }}</td>
                        <td class="p-2">{{ link.created_at }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else>No links yet</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            links: [],
            loading: true,
        };
    },
    mounted() {
        this.fetchLinks();
    },
    methods: {
        async fetchLinks() {
            try {
                const response = await axios.get("/links");
                this.links = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
