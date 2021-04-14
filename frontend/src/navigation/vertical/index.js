export default [
    {
        title: 'داشبورد',
        route: 'dashboard',
        icon: 'HomeIcon',
        tag: 'پیام جدید',
        tagVariant: 'light-success',
    },
    {
        header: 'مدیریت بخش مقالات',
    },
    {
        title: 'مقالات',
        icon: 'FileIcon',
        children: [
            {
                title: 'ایجاد مقاله',
                route: 'articles-create',
                icon: 'FileIcon',
            },
            {
                title: 'مدیریت مقالات',
                route: 'articles',
                icon: 'FileIcon',
            },
        ],
    },
    {
        title: 'دسته بندی ها',
        route: 'categories',
        icon: 'FileIcon',
        children: [
            {
                title: 'ایجاد دسته بندی',
                route: 'categories-create',
                icon: 'FileIcon',
            },
            {
                title: 'مدیریت دسته بندی ها',
                route: 'categories',
                icon: 'FileIcon',
            },
        ],
    },
    {
        title: 'تگ ها',
        route: 'tags',
        icon: 'FileIcon',
        children: [
            {
                title: 'ایجاد تگ',
                route: 'tags-create',
                icon: 'FileIcon',
            },
            {
                title: 'مدیریت تگ ها',
                route: 'tags',
                icon: 'FileIcon',
            },
        ],
    },
    {
        header: 'مدیریت بخش محصولات',
    },
    {
        title: 'محصولات',
        route: 'products',
        icon: 'FileIcon',
        children: [
            {
                title: 'ایجاد محصول',
                route: 'products-create',
                icon: 'FileIcon',
            },
            {
                title: 'مدیریت محصولات',
                route: 'products',
                icon: 'FileIcon',
            },
        ],
    },
    {
        title: 'دسته بندی محصولات',
        route: 'product-categories',
        icon: 'FileIcon',
        children: [
            {
                title: 'ایجاد دسته بندی محصول',
                route: 'product-categories-create',
                icon: 'FileIcon',
            },
            {
                title: 'مدیریت دسته بندی محصولات',
                route: 'product-categories',
                icon: 'FileIcon',
            },
        ],
    },
]
