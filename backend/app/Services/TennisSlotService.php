<?php

namespace App\Services;

use App\Models\TennisSlot;
use Illuminate\Http\Exceptions\HttpResponseException;

class TennisSlotService
{
    private const MAX_AVAILABLE_SLOTS = 4;

    public function create(array $data): TennisSlot
    {
        $availableCount = TennisSlot::where('status', 'available')->count();

        if ($availableCount >= self::MAX_AVAILABLE_SLOTS) {
            throw new HttpResponseException(response()->json([
                'message' => 'Limite de '.self::MAX_AVAILABLE_SLOTS.' horários disponíveis atingido. Aguarde confirmações antes de abrir novas vagas.',
            ], 422));
        }

        return TennisSlot::create([
            'date'   => $data['date'],
            'time'   => $data['time'],
            'court'  => $data['court'],
            'level'  => $data['level'],
            'notes'  => $data['notes'] ?? null,
            'status' => 'available',
        ]);
    }

    public function book(TennisSlot $slot, string $challengerName): TennisSlot
    {
        if ($slot->status === 'booked') {
            throw new HttpResponseException(response()->json([
                'message' => 'Este horário já está garantido por outro desafiante.',
            ], 422));
        }

        $slot->update([
            'status'          => 'booked',
            'challenger_name' => $challengerName,
        ]);

        return $slot->fresh();
    }

    public function release(TennisSlot $slot): TennisSlot
    {
        $slot->update([
            'status'          => 'available',
            'challenger_name' => null,
        ]);

        return $slot->fresh();
    }
}
