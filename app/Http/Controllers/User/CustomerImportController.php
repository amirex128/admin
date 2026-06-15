<?php

namespace App\Http\Controllers\User;

use App\Exports\CustomersTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\PreviewCustomerImportRequest;
use App\Http\Requests\User\ProcessCustomerImportRequest;
use App\Services\Customer\CustomerImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CustomerImportController extends Controller
{
    public function __construct(private readonly CustomerImportService $importService) {}

    /**
     * Store the uploaded spreadsheet temporarily and return a column preview so
     * the user can map their columns onto customer fields.
     */
    public function preview(PreviewCustomerImportRequest $request): JsonResponse
    {
        $extension = $request->file('file')->getClientOriginalExtension() ?: 'xlsx';
        $token = Str::uuid()->toString().'.'.$extension;

        $request->file('file')->storeAs($this->directory($request), $token, $this->importService->disk);

        $preview = $this->importService->preview($this->path($request, $token));

        return response()->json([
            'token' => $token,
            'headers' => $preview['headers'],
            'rows' => $preview['rows'],
            'fields' => CustomerImportService::fields(),
        ]);
    }

    /**
     * Run the import using the confirmed column mapping.
     */
    public function import(ProcessCustomerImportRequest $request): RedirectResponse
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
            'message' => "ایمپورت انجام شد: {$result['created']} مشتری جدید، {$result['updated']} بروزرسانی.",
        ]);

        return to_route('customers.index');
    }

    /**
     * Download a ready-to-fill import template.
     */
    public function template(): BinaryFileResponse
    {
        return Excel::download(new CustomersTemplateExport, 'customers-template.xlsx');
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
