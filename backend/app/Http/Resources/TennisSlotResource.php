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
            'date'            => $this->date->format('Y-m-d'),
            'time'            => substr($this->time, 0, 5),
            'court'           => $this->court,
            'level'           => $this->level,
            'notes'           => $this->notes,
            'status'          => $this->status,
            'challenger_name' => $this->challenger_name,
            'created_at'      => $this->created_at,
        ];
    }
}
