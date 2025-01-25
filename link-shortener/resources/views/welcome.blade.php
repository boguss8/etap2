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
                <create-link-form @link-created="$refs.linksList.fetchLinks()"></create-link-form>
                <links-list ref="linksList"></links-list>
            </div>
        </div>
    </body>
</html>
