<?php

namespace App\Services\Order;

use App\Models\Order;
use Illuminate\Support\Facades\View;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;

/**
 * Renders official-looking invoice / proforma PDFs for an order using mpdf,
 * which natively shapes Persian (RTL) text.
 */
class OrderPdfService
{
    /**
     * Build the PDF document for the order and return its binary contents.
     */
    public function render(Order $order): string
    {
        $order->loadMissing(['items', 'user']);

        $html = View::make('pdf.invoice', [
            'order' => $order,
            'isProforma' => $order->isProforma(),
        ])->render();

        $tempDir = storage_path('app/mpdf');

        if (! is_dir($tempDir)) {
            mkdir($tempDir, 0775, true);
        }

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'tempDir' => $tempDir,
            'default_font' => 'dejavusans',
            'margin_top' => 14,
            'margin_bottom' => 14,
            'margin_left' => 12,
            'margin_right' => 12,
        ]);

        $mpdf->autoScriptToLang = true;
        $mpdf->autoLangToFont = true;
        $mpdf->SetDirectionality('rtl');
        $mpdf->WriteHTML($html);

        return $mpdf->Output('', Destination::STRING_RETURN);
    }

    /**
     * A safe, descriptive download filename for the order document.
     */
    public function filename(Order $order): string
    {
        $prefix = $order->isProforma() ? 'proforma' : 'invoice';

        return "{$prefix}-{$order->code}.pdf";
    }
}
