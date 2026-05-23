<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TennisSlotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'date'            => $this->date,
            'time'            => $this->time,
            'court'           => $this->court,
            'level'           => $this->level,
            'notes'           => $this->notes,
            'status'          => $this->status,
            'challenger_name' => $this->challenger_name,
            'created_at'      => $this->created_at,
        ];
    }
}
