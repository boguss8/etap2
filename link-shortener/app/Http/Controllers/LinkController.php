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

    public function index()
    {
        $links = Link::latest()->get()->map(function ($link) {
            return [
                'id' => $link->id,
                'original_url' => $link->original_url,
                'short_url' => url($link->short_url),
                'created_at' => $link->created_at->diffForHumans()
            ];
        });

        return response()->json($links);
    }
}
