@php
    /** @var \App\Models\Order $order */
    $faDigits = static function ($value): string {
        $value = (string) $value;
        return strtr($value, ['0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴', '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹']);
    };
    $money = static function ($amount) use ($faDigits): string {
        return $faDigits(number_format((int) $amount)).' تومان';
    };
    $date = $order->created_at?->format('Y/m/d H:i');
@endphp
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: dejavusans, sans-serif; color: #1f2937; font-size: 11px; }
        .header { border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 16px; }
        .doc-title { font-size: 20px; font-weight: bold; color: #4f46e5; }
        .doc-sub { color: #6b7280; font-size: 11px; margin-top: 4px; }
        .meta-table, .items-table { width: 100%; border-collapse: collapse; }
        .meta-table td { padding: 4px 6px; vertical-align: top; }
        .label { color: #6b7280; }
        .value { font-weight: bold; }
        .section-title { font-weight: bold; font-size: 13px; margin: 16px 0 8px; color: #111827; }
        .items-table th { background: #4f46e5; color: #fff; padding: 7px 6px; text-align: right; font-size: 11px; }
        .items-table td { padding: 7px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; }
        .items-table tr:nth-child(even) td { background: #f9fafb; }
        .totals { width: 45%; margin-right: 55%; margin-top: 12px; }
        .totals td { padding: 5px 6px; }
        .totals .grand { font-size: 14px; font-weight: bold; color: #4f46e5; border-top: 2px solid #4f46e5; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 10px; background: #eef2ff; color: #4f46e5; font-size: 10px; }
        .footer { margin-top: 28px; color: #9ca3af; font-size: 10px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width:100%">
            <tr>
                <td>
                    <div class="doc-title">{{ $isProforma ? 'پیش‌فاکتور' : 'فاکتور فروش' }}</div>
                    <div class="doc-sub">{{ $order->user->name }}</div>
                </td>
                <td style="text-align:left">
                    <div><span class="label">شماره سند:</span> <span class="value">{{ $order->code }}</span></div>
                    <div><span class="label">تاریخ:</span> <span class="value">{{ $faDigits($date) }}</span></div>
                    <div style="margin-top:4px"><span class="badge">{{ $order->status->label() }}</span></div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section-title">مشخصات سفارش‌دهنده</div>
    <table class="meta-table">
        <tr>
            <td><span class="label">نام:</span> <span class="value">{{ $order->customer_name }}</span></td>
            <td><span class="label">تلفن:</span> <span class="value">{{ $order->customer_phone ? $faDigits($order->customer_phone) : '—' }}</span></td>
        </tr>
        <tr>
            <td><span class="label">استان / شهر:</span> <span class="value">{{ trim(($order->province ?? '').' / '.($order->city ?? ''), ' /') ?: '—' }}</span></td>
            <td><span class="label">روش ارسال:</span> <span class="value">{{ $order->shipping_method?->label() ?? '—' }}</span></td>
        </tr>
        <tr>
            <td colspan="2"><span class="label">آدرس:</span> <span class="value">{{ $order->address ?: '—' }}</span></td>
        </tr>
    </table>

    <div class="section-title">اقلام</div>
    <table class="items-table">
        <thead>
            <tr>
                <th style="width:5%">#</th>
                <th style="width:39%">کالا</th>
                <th style="width:18%">قیمت واحد</th>
                <th style="width:12%">تعداد</th>
                <th style="width:12%">تخفیف</th>
                <th style="width:14%">جمع</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $index => $item)
                <tr>
                    <td>{{ $faDigits($index + 1) }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $money($item->unit_price) }}</td>
                    <td>{{ $faDigits($item->quantity) }}</td>
                    <td>{{ $faDigits($item->discount_percent) }}٪</td>
                    <td>{{ $money($item->total) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="label">جمع کل اقلام</td>
            <td style="text-align:left">{{ $money($order->subtotal) }}</td>
        </tr>
        <tr>
            <td class="label">مالیات ({{ $faDigits($order->tax_percent) }}٪)</td>
            <td style="text-align:left">{{ $money($order->tax_amount) }}</td>
        </tr>
        <tr>
            <td class="label">هزینه ارسال</td>
            <td style="text-align:left">{{ $money($order->shipping_cost) }}</td>
        </tr>
        <tr>
            <td class="grand">مبلغ قابل پرداخت</td>
            <td class="grand" style="text-align:left">{{ $money($order->total) }}</td>
        </tr>
    </table>

    @if ($order->note)
        <div class="section-title">توضیحات</div>
        <div>{{ $order->note }}</div>
    @endif

    <div class="footer">
        این سند توسط سامانه به صورت خودکار صادر شده است.
        @if ($isProforma)
            (این پیش‌فاکتور صرفاً جهت استعلام قیمت بوده و سند پرداخت محسوب نمی‌شود.)
        @endif
    </div>
</body>
</html>
