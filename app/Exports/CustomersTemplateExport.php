<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

/**
 * A ready-to-fill spreadsheet template demonstrating the expected columns and
 * value formats for the customer import.
 */
class CustomersTemplateExport implements FromArray, WithHeadings
{
    /**
     * @return array<int, array<int, mixed>>
     */
    public function array(): array
    {
        return [
            ['علی رضایی', '09121112233', 'ali@example.com', '0012345678', 'تهران', 'تهران', 'خیابان آزادی، پلاک ۱۰', '1234567890', 'فعال', 'مشتری وفادار'],
            ['زهرا کریمی', '09127778899', '', '', 'اصفهان', 'اصفهان', '', '', 'مسدود', ''],
        ];
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return [
            'نام مشتری', 'موبایل', 'ایمیل', 'کد ملی', 'استان', 'شهر', 'آدرس', 'کد پستی', 'وضعیت', 'یادداشت',
        ];
    }
}
