<?php

namespace App\Exports;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

/**
 * Exports a user's products into a spreadsheet whose columns line up with the
 * import format, so an exported file can be edited and re-imported in bulk.
 */
class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(private readonly User $user) {}

    /**
     * The root products to export.
     *
     * @return Collection<int, Product>
     */
    public function collection(): Collection
    {
        return $this->user->products()->roots()->with('category')->orderBy('id')->get();
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return [
            'شناسه', 'نام محصول', 'شناسه محصول', 'قیمت (تومان)', 'موجودی', 'وزن (گرم)',
            'درصد تخفیف', 'واحد فروش', 'وضعیت سفارش‌گیری', 'دسته‌بندی', 'پیشنهاد ویژه', 'فعال',
        ];
    }

    /**
     * @param  Product  $product
     * @return array<int, mixed>
     */
    public function map($product): array
    {
        return [
            $product->id,
            $product->name,
            $product->sku,
            $product->price,
            $product->stock,
            $product->weight,
            $product->discount_percent,
            $product->sales_unit->label(),
            $product->order_mode->label(),
            $product->category?->name,
            $product->is_special_offer ? 'بله' : 'خیر',
            $product->is_active ? 'بله' : 'خیر',
        ];
    }
}
