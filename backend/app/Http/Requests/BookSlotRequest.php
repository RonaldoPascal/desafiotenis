<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'challenger_name' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'challenger_name.required' => 'Informe seu nome ou apelido.',
            'challenger_name.max'      => 'O nome não pode ter mais de 100 caracteres.',
        ];
    }
}
