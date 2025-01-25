<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>URL Shortener</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-gray-100">
        <div class="container mx-auto px-4">
            <h1 class="text-3xl font-bold text-center my-8">URL Shortener</h1>
            <div id="app">
                <create-link-form></create-link-form>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
                console.log('Page loaded');
                console.log('App element:', document.getElementById('app'));
            });
        </script>
    </body>
</html>
