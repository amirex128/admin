<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAiModelRequest;
use App\Http\Requests\Admin\UpdateAiModelRequest;
use App\Http\Resources\AiModelResource;
use App\Models\AiModel;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Enums\Lab;

class AiModelController extends Controller
{
    /**
     * Display the AI models managed by the administrator.
     */
    public function index(): Response
    {
        $models = AiModel::query()
            ->withCount('users')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('admin/settings/ai', [
            'models' => AiModelResource::collection($models),
            'providers' => array_map(
                static fn (Lab $lab): array => ['value' => $lab->value, 'label' => $lab->name],
                Lab::cases(),
            ),
        ]);
    }

    /**
     * Store a new AI model.
     */
    public function store(StoreAiModelRequest $request): RedirectResponse
    {
        AiModel::create($request->modelAttributes());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مدل هوش مصنوعی ایجاد شد.']);

        return to_route('admin.ai-models.index');
    }

    /**
     * Update an AI model.
     */
    public function update(UpdateAiModelRequest $request, AiModel $aiModel): RedirectResponse
    {
        $aiModel->update($request->modelAttributes());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مدل هوش مصنوعی بروزرسانی شد.']);

        return to_route('admin.ai-models.index');
    }

    /**
     * Toggle the active state of an AI model.
     */
    public function toggle(AiModel $aiModel): RedirectResponse
    {
        $aiModel->update(['is_active' => ! $aiModel->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $aiModel->is_active ? 'مدل فعال شد.' : 'مدل غیرفعال شد.',
        ]);

        return back();
    }

    /**
     * Remove an AI model.
     */
    public function destroy(AiModel $aiModel): RedirectResponse
    {
        $aiModel->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مدل هوش مصنوعی حذف شد.']);

        return back();
    }
}
