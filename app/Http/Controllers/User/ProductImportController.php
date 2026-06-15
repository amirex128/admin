<?php

namespace App\Http\Controllers\User;

use App\Exports\ProductsTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\PreviewProductImportRequest;
use App\Http\Requests\User\ProcessProductImportRequest;
use App\Services\Product\ProductImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProductImportController extends Controller
{
    public function __construct(private readonly ProductImportService $importService) {}

    /**
     * Store the uploaded spreadsheet temporarily and return a column preview so
     * the user can map their columns onto product fields.
     */
    public function preview(PreviewProductImportRequest $request): JsonResponse
    {
        $extension = $request->file('file')->getClientOriginalExtension() ?: 'xlsx';
        $token = Str::uuid()->toString().'.'.$extension;

        $request->file('file')->storeAs($this->directory($request), $token, $this->importService->disk);

        $preview = $this->importService->preview($this->path($request, $token));

        return response()->json([
            'token' => $token,
            'headers' => $preview['headers'],
            'rows' => $preview['rows'],
            'fields' => ProductImportService::fields(),
        ]);
    }

    /**
     * Run the import using the confirmed column mapping.
     */
    public function import(ProcessProductImportRequest $request): RedirectResponse
    {
        $token = basename($request->validated('token'));
        $path = $this->path($request, $token);

        abort_unless(Storage::disk($this->importService->disk)->exists($path), 404);

        /** @var array<string, int> $mapping */
        $mapping = $request->validated('mapping');

        $result = $this->importService->import($path, $mapping, $request->user());

        Storage::disk($this->importService->disk)->delete($path);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "ایمپورت انجام شد: {$result['created']} محصول جدید، {$result['updated']} بروزرسانی.",
        ]);

        return to_route('products.index');
    }

    /**
     * Download a ready-to-fill import template.
     */
    public function template(): BinaryFileResponse
    {
        return Excel::download(new ProductsTemplateExport, 'products-template.xlsx');
    }

    /**
     * The per-user directory temporary import files live in.
     */
    protected function directory(Request $request): string
    {
        return 'imports/'.$request->user()->id;
    }

    /**
     * The full storage path for a temporary import file.
     */
    protected function path(Request $request, string $token): string
    {
        return $this->directory($request).'/'.$token;
    }
}
