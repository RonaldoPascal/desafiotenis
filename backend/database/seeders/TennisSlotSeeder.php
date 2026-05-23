<?php

namespace Database\Seeders;

use App\Models\TennisSlot;
use Illuminate\Database\Seeder;

class TennisSlotSeeder extends Seeder
{
    public function run(): void
    {
        $slots = [
            [
                'date'            => '2026-05-23',
                'time'            => '09:00',
                'court'           => 'Alçapão Central (Saibro)',
                'level'           => 'Intermediário',
                'notes'           => 'Jogo de simples, traga tubinho de bolas novo. Água e refrigerante na quadra.',
                'status'          => 'available',
                'challenger_name' => null,
            ],
            [
                'date'            => '2026-05-23',
                'time'            => '16:30',
                'court'           => 'Alçapão Central (Saibro)',
                'level'           => 'Avançado',
                'notes'           => 'Treino de saque e fundo de quadra. Já tem tubinho reservado.',
                'status'          => 'booked',
                'challenger_name' => 'Guga Kuerten',
            ],
            [
                'date'            => '2026-05-24',
                'time'            => '10:00',
                'court'           => 'Alçapão Central (Saibro)',
                'level'           => 'Intermediário',
                'notes'           => 'Simples valendo uma rodada de cerveja para o vencedor.',
                'status'          => 'available',
                'challenger_name' => null,
            ],
            [
                'date'            => '2026-05-25',
                'time'            => '19:00',
                'court'           => 'Quadra Anexa 02 (Rápida)',
                'level'           => 'Qualquer Nível',
                'notes'           => 'Jogo noturno com iluminação completa. Partida amistosa.',
                'status'          => 'booked',
                'challenger_name' => 'Beto Cascalho',
            ],
        ];

        foreach ($slots as $slot) {
            TennisSlot::updateOrCreate(
                ['date' => $slot['date'], 'time' => $slot['time'], 'court' => $slot['court']],
                $slot
            );
        }
    }
}
