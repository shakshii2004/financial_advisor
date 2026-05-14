<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartupUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'industry' => 'sometimes|required|string|max:255',
            'stage' => 'sometimes|required|string|max:255',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
            'currency' => 'nullable|string|in:USD,INR',
        ];
    }
}
