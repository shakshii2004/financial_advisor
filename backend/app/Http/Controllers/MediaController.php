<?php

namespace App\Http\Controllers;

use App\Models\Startup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $startup = Startup::findOrFail($request->startup_id);

        if ($startup->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($startup->logo_url) {
                // remove the /storage/ prefix to get the path
                $oldPath = str_replace('/storage/', '', $startup->logo_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('logo')->store('logos', 'public');
            $url = '/storage/' . $path;

            $startup->update(['logo_url' => $url]);

            return response()->json([
                'success' => true,
                'message' => 'Logo uploaded successfully.',
                'data' => [
                    'logo_url' => $url
                ]
            ]);
        }

        return response()->json(['message' => 'No file uploaded.'], 400);
    }
}
