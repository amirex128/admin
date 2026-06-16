<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Storefront base domain
    |--------------------------------------------------------------------------
    |
    | Sellers receive a free subdomain under this base domain, e.g.
    | "myshop.sotoon53.com".
    |
    */
    'base_domain' => env('STOREFRONT_BASE_DOMAIN', 'sotoon53.com'),

    /*
    |--------------------------------------------------------------------------
    | Nameservers
    |--------------------------------------------------------------------------
    |
    | Shown in the DNS connection guide for sellers connecting a custom domain.
    |
    */
    'nameservers' => [
        'ns.sotoon53.com',
        'd.ns.sotoon53.com',
    ],

    /*
    |--------------------------------------------------------------------------
    | Storefront templates
    |--------------------------------------------------------------------------
    |
    | The selectable storefront templates. Each `key` maps to a folder under
    | resources/js/pages/storefront/{key}. See docs/storefront-templates.md for
    | how to add a new template.
    |
    */
    'templates' => [
        [
            'key' => 'classic',
            'name' => 'قالب کلاسیک',
            'description' => 'قالب فروشگاهی مدرن، ساده و واکنش‌گرا با کروسل محصولات و دسته‌بندی‌ها.',
            'preview' => null,
        ],
    ],

];
