<?php

namespace App\Services\Product;

use App\Enums\OrderMode;
use App\Enums\SalesUnit;
use App\Imports\ProductsImport;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Reads an uploaded spreadsheet, lets the caller map its columns onto product
 * fields, normalizes the values and upserts products for the user. Existing
 * products are detected by their id or SKU and updated in place (bulk edit).
 */
class ProductImportService
{
    /**
     * The disk temporary import files are stored on.
     */
    public string $disk = 'local';

    /**
     * The product fields a spreadsheet column may be mapped to.
     *
     * @return array<int, array{key: string, label: string, required: bool}>
     */
    public static function fields(): array
    {
        return [
            ['key' => 'id', 'label' => 'شناسه (برای بروزرسانی)', 'required' => false],
            ['key' => 'name', 'label' => 'نام محصول', 'required' => true],
            ['key' => 'sku', 'label' => 'شناسه محصول', 'required' => false],
            ['key' => 'price', 'label' => 'قیمت (تومان)', 'required' => false],
            ['key' => 'stock', 'label' => 'موجودی', 'required' => false],
            ['key' => 'weight', 'label' => 'وزن (گرم)', 'required' => false],
            ['key' => 'discount_percent', 'label' => 'درصد تخفیف', 'required' => false],
            ['key' => 'sales_unit', 'label' => 'واحد فروش', 'required' => false],
            ['key' => 'order_mode', 'label' => 'وضعیت سفارش‌گیری', 'required' => false],
            ['key' => 'category', 'label' => 'دسته‌بندی', 'required' => false],
            ['key' => 'is_special_offer', 'label' => 'پیشنهاد ویژه', 'required' => false],
            ['key' => 'is_active', 'label' => 'فعال', 'required' => false],
            ['key' => 'description', 'label' => 'توضیحات', 'required' => false],
        ];
    }

    /**
     * Read every row from the stored spreadsheet.
     *
     * @return array<int, array<int, mixed>>
     */
    public function rows(string $path): array
    {
        $sheets = Excel::toArray(new ProductsImport, $path, $this->disk);

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
     * Import the products described by the spreadsheet using the column mapping.
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

            $attributes = $this->normalize($values, $user);

            if ($existing !== null) {
                $existing->update($attributes);
                $updated++;
            } else {
                $user->products()->create($attributes);
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
     * Find an existing product to update, matching by id then SKU.
     *
     * @param  array<string, string>  $values
     */
    protected function findExisting(array $values, User $user): ?Product
    {
        if (($values['id'] ?? '') !== '') {
            $product = $user->products()->whereKey($this->toInt($values['id']))->first();

            if ($product !== null) {
                return $product;
            }
        }

        if (($values['sku'] ?? '') !== '') {
            return $user->products()->where('sku', $values['sku'])->first();
        }

        return null;
    }

    /**
     * Normalize the raw mapped values into persistable product attributes.
     *
     * @param  array<string, string>  $values
     * @return array<string, mixed>
     */
    protected function normalize(array $values, User $user): array
    {
        $attributes = [
            'name' => $values['name'],
        ];

        if (array_key_exists('sku', $values)) {
            $attributes['sku'] = $values['sku'] !== '' ? $values['sku'] : null;
        }

        if (array_key_exists('price', $values)) {
            $attributes['price'] = $this->toInt($values['price']);
        }

        if (array_key_exists('stock', $values)) {
            $attributes['stock'] = $this->toInt($values['stock']);
        }

        if (array_key_exists('weight', $values)) {
            $attributes['weight'] = $values['weight'] !== '' ? $this->toInt($values['weight']) : null;
        }

        if (array_key_exists('discount_percent', $values)) {
            $attributes['discount_percent'] = $values['discount_percent'] !== ''
                ? min(100, $this->toInt($values['discount_percent']))
                : null;
        }

        if (array_key_exists('sales_unit', $values)) {
            $attributes['sales_unit'] = (SalesUnit::fromLabel($values['sales_unit']) ?? SalesUnit::Piece)->value;
        }

        if (array_key_exists('order_mode', $values)) {
            $attributes['order_mode'] = (OrderMode::fromLabel($values['order_mode']) ?? OrderMode::Direct)->value;
        }

        if (array_key_exists('description', $values)) {
            $attributes['description'] = $values['description'] !== '' ? $values['description'] : null;
        }

        if (array_key_exists('is_special_offer', $values)) {
            $attributes['is_special_offer'] = $this->toBool($values['is_special_offer']);
        }

        if (array_key_exists('is_active', $values)) {
            $attributes['is_active'] = $this->toBool($values['is_active']);
        }

        if (($values['category'] ?? '') !== '') {
            $attributes['category_id'] = $this->resolveCategory($values['category'], $user)->id;
        }

        return $attributes;
    }

    /**
     * Find or create a category for the user by name.
     */
    protected function resolveCategory(string $name, User $user): Category
    {
        return $user->categories()->firstOrCreate(
            ['name' => $name],
            ['slug' => Str::slug($name).'-'.Str::lower(Str::random(6))],
        );
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
     * Interpret a localized truthy value.
     */
    protected function toBool(string $value): bool
    {
        return in_array(
            Str::lower($this->normalizeDigits(trim($value))),
            ['1', 'true', 'yes', 'بله', 'فعال', 'دارد'],
            true,
        );
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
