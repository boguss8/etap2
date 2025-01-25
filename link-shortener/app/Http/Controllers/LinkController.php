<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Http\Requests\StoreLinkRequest;
use Illuminate\Support\Str;

class LinkController extends Controller
{
    public function store(StoreLinkRequest $request)
    {
        $link = Link::create([
            'original_url' => $request->url,
            'short_url' => Str::random(6)
        ]);

        return response()->json([
            'short_url' => url($link->short_url)
        ]);
    }

    public function redirect($shortUrl)
    {
        $link = Link::where('short_url', $shortUrl)->firstOrFail();
        return redirect()->away($link->original_url);
    }
}
