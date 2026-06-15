<?php

namespace App\Services\Customer;

use App\Enums\CustomerStatus;
use App\Imports\CustomersImport;
use App\Models\Customer;
use App\Models\User;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Reads an uploaded spreadsheet, lets the caller map its columns onto customer
 * fields, normalizes the values and upserts customers for the user. Existing
 * customers are detected by their id or phone and updated in place.
 */
class CustomerImportService
{
    /**
     * The disk temporary import files are stored on.
     */
    public string $disk = 'local';

    /**
     * The customer fields a spreadsheet column may be mapped to.
     *
     * @return array<int, array{key: string, label: string, required: bool}>
     */
    public static function fields(): array
    {
        return [
            ['key' => 'id', 'label' => 'شناسه (برای بروزرسانی)', 'required' => false],
            ['key' => 'name', 'label' => 'نام مشتری', 'required' => true],
            ['key' => 'phone', 'label' => 'موبایل', 'required' => false],
            ['key' => 'email', 'label' => 'ایمیل', 'required' => false],
            ['key' => 'national_code', 'label' => 'کد ملی', 'required' => false],
            ['key' => 'province', 'label' => 'استان', 'required' => false],
            ['key' => 'city', 'label' => 'شهر', 'required' => false],
            ['key' => 'address', 'label' => 'آدرس', 'required' => false],
            ['key' => 'postal_code', 'label' => 'کد پستی', 'required' => false],
            ['key' => 'status', 'label' => 'وضعیت', 'required' => false],
            ['key' => 'note', 'label' => 'یادداشت', 'required' => false],
        ];
    }

    /**
     * Read every row from the stored spreadsheet.
     *
     * @return array<int, array<int, mixed>>
     */
    public function rows(string $path): array
    {
        $sheets = Excel::toArray(new CustomersImport, $path, $this->disk);

        return $sheets[0] ?? [];
    }

    /**
     * Build a preview payload: header labels plus the first few data rows.
     *
     * @return array{headers: array<int, string>, rows: array<int, array<int, mixed>>}
     */
    public function preview(string $path, int $sampleSize = 5): array
    {
        $rows = $this->rows($path);
        $headers = array_map(static fn ($value): string => (string) $value, $rows[0] ?? []);

        return [
            'headers' => $headers,
            'rows' => array_slice($rows, 1, $sampleSize),
        ];
    }

    /**
     * Import the customers described by the spreadsheet using the column mapping.
     *
     * @param  array<string, int>  $mapping  Map of field key => column index.
     * @return array{created: int, updated: int, skipped: int}
     */
    public function import(string $path, array $mapping, User $user): array
    {
        $rows = $this->rows($path);
        array_shift($rows); // drop the header row

        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($rows as $row) {
            $values = $this->mapRow($row, $mapping);

            if (($values['name'] ?? '') === '') {
                $skipped++;

                continue;
            }

            $existing = $this->findExisting($values, $user);
            $attributes = $this->normalize($values);

            if ($existing !== null) {
                $existing->update($attributes);
                $updated++;
            } else {
                $user->customers()->create($attributes);
                $created++;
            }
        }

        return ['created' => $created, 'updated' => $updated, 'skipped' => $skipped];
    }

    /**
     * Extract the mapped raw values from a spreadsheet row.
     *
     * @param  array<int, mixed>  $row
     * @param  array<string, int>  $mapping
     * @return array<string, string>
     */
    protected function mapRow(array $row, array $mapping): array
    {
        $values = [];

        foreach ($mapping as $field => $columnIndex) {
            $raw = $row[$columnIndex] ?? null;
            $values[$field] = $raw === null ? '' : trim((string) $raw);
        }

        return $values;
    }

    /**
     * Find an existing customer to update, matching by id then phone.
     *
     * @param  array<string, string>  $values
     */
    protected function findExisting(array $values, User $user): ?Customer
    {
        if (($values['id'] ?? '') !== '') {
            $customer = $user->customers()->whereKey($this->toInt($values['id']))->first();

            if ($customer !== null) {
                return $customer;
            }
        }

        if (($values['phone'] ?? '') !== '') {
            return $user->customers()->where('phone', $values['phone'])->first();
        }

        return null;
    }

    /**
     * Normalize the raw mapped values into persistable customer attributes.
     *
     * @param  array<string, string>  $values
     * @return array<string, mixed>
     */
    protected function normalize(array $values): array
    {
        $attributes = [
            'name' => $values['name'],
        ];

        foreach (['phone', 'email', 'national_code', 'province', 'city', 'address', 'postal_code', 'note'] as $field) {
            if (array_key_exists($field, $values)) {
                $attributes[$field] = $values[$field] !== '' ? $values[$field] : null;
            }
        }

        if (($values['status'] ?? '') !== '') {
            $attributes['status'] = (CustomerStatus::fromLabel($values['status']) ?? CustomerStatus::Active)->value;
        }

        return $attributes;
    }

    /**
     * Convert a possibly localized numeric string to an integer.
     */
    protected function toInt(string $value): int
    {
        $value = $this->normalizeDigits($value);

        return (int) preg_replace('/[^0-9\-]/', '', $value);
    }

    /**
     * Translate Persian and Arabic digits to their ASCII equivalents.
     */
    protected function normalizeDigits(string $value): string
    {
        $persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        $arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        $english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return str_replace([...$persian, ...$arabic], [...$english, ...$english], $value);
    }
}
