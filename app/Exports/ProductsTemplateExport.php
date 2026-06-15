<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

/**
 * A ready-to-fill spreadsheet template demonstrating the expected columns and
 * value formats for the product import.
 */
class ProductsTemplateExport implements FromArray, WithHeadings
{
    /**
     * @return array<int, array<int, mixed>>
     */
    public function array(): array
    {
        return [
            ['', 'تیشرت نخی', 'SKU-001', 250000, 30, 200, 10, 'عدد', 'ثبت سفارش مستقیم', 'پوشاک', 'بله', 'بله'],
            ['', 'پارچه متری', 'SKU-002', 90000, 100, 0, 0, 'متر', 'فقط صدور پیش‌فاکتور', 'پارچه', 'خیر', 'بله'],
        ];
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
}
