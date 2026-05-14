<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartupStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'stage' => 'required|string|max:255',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
            'currency' => 'nullable|string|in:USD,INR',
        ];
    }
}
