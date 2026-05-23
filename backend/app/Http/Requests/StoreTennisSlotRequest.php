<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTennisSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'  => 'required|date|after_or_equal:today',
            'time'  => 'required|date_format:H:i',
            'court' => 'required|string|max:100',
            'level' => 'required|in:Qualquer Nível,Iniciante,Intermediário,Avançado',
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'date.required'         => 'A data é obrigatória.',
            'date.after_or_equal'   => 'A data não pode ser no passado.',
            'time.required'         => 'O horário é obrigatório.',
            'time.date_format'      => 'O horário deve estar no formato HH:MM.',
            'court.required'        => 'A quadra é obrigatória.',
            'level.required'        => 'O nível é obrigatório.',
            'level.in'              => 'Nível inválido.',
        ];
    }
}
