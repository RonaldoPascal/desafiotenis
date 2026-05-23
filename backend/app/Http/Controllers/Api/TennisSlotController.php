<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookSlotRequest;
use App\Http\Requests\StoreTennisSlotRequest;
use App\Http\Resources\TennisSlotResource;
use App\Models\TennisSlot;
use App\Services\TennisSlotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TennisSlotController extends Controller
{
    public function __construct(private readonly TennisSlotService $service) {}

    public function publicIndex(): JsonResponse
    {
        $slots = TennisSlot::orderBy('date')->orderBy('time')->get();

        return response()->json([
            'data' => TennisSlotResource::collection($slots),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $slots = TennisSlot::query()
            ->when($request->level, fn ($q) => $q->where('level', $request->level))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return response()->json([
            'data' => TennisSlotResource::collection($slots),
        ]);
    }

    public function show(TennisSlot $slot): JsonResponse
    {
        return response()->json([
            'data' => new TennisSlotResource($slot),
        ]);
    }

    public function store(StoreTennisSlotRequest $request): JsonResponse
    {
        $slot = $this->service->create($request->validated());

        return response()->json([
            'data'    => new TennisSlotResource($slot),
            'message' => 'Horário cadastrado com sucesso.',
        ], 201);
    }

    public function book(BookSlotRequest $request, TennisSlot $slot): JsonResponse
    {
        $slot = $this->service->book($slot, $request->validated('challenger_name'));

        return response()->json([
            'data'    => new TennisSlotResource($slot),
            'message' => 'Vaga garantida com sucesso!',
        ]);
    }

    public function release(TennisSlot $slot): JsonResponse
    {
        $slot = $this->service->release($slot);

        return response()->json([
            'data'    => new TennisSlotResource($slot),
            'message' => 'Vaga liberada com sucesso.',
        ]);
    }

    public function destroy(TennisSlot $slot): JsonResponse
    {
        $slot->delete();

        return response()->json([
            'message' => 'Horário removido com sucesso.',
        ]);
    }
}
