<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToArray;

/**
 * A minimal import used to read every raw row of the uploaded spreadsheet so
 * the application can drive its own column-mapping and normalization flow.
 */
class CustomersImport implements ToArray
{
    /**
     * The raw rows parsed from the first sheet.
     *
     * @var array<int, array<int, mixed>>
     */
    public array $rows = [];

    /**
     * Capture the parsed rows.
     *
     * @param  array<int, array<int, mixed>>  $array
     */
    public function array(array $array): void
    {
        $this->rows = $array;
    }
}
