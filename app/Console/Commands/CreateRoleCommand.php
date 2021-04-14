<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateRoleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:role';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $article_writer_r = Role::create(['name' => 'article_writer']);
        $create_article_p = Permission::create(['name' => 'create_article']);
        $edit_article_p = Permission::create(['name' => 'edit_article']);
        $delete_article_p = Permission::create(['name' => 'delete_article']);
        $article_writer_r->syncPermissions([$create_article_p, $edit_article_p, $delete_article_p]);

        $page_creator_r = Role::create(['name' => 'page_creator']);
        $create_page_p = Permission::create(['name' => 'create_page']);
        $edit_page_p = Permission::create(['name' => 'edit_page']);
        $delete_page_p = Permission::create(['name' => 'delete_page']);
        $page_creator_r->syncPermissions([$create_page_p, $edit_page_p, $delete_page_p]);

        $category_creator_r = Role::create(['name' => 'category_creator']);
        $create_category_p = Permission::create(['name' => 'create_category']);
        $edit_category_p = Permission::create(['name' => 'edit_category']);
        $delete_category_p = Permission::create(['name' => 'delete_category']);
        $category_creator_r->syncPermissions([$create_category_p, $edit_category_p, $delete_category_p]);


        $tag_creator_r = Role::create(['name' => 'tag_creator']);
        $create_tag_p = Permission::create(['name' => 'create_tag']);
        $edit_tag_p = Permission::create(['name' => 'edit_tag']);
        $delete_tag_p = Permission::create(['name' => 'delete_tag']);
        $tag_creator_r->syncPermissions([$create_tag_p, $edit_tag_p, $delete_tag_p]);


        $admin = Role::create(['name' => 'super_admin']);

//        $admin = Role::query()->where('name', 'super_admin')->first();
        $user_admin = User::query()->create([
            'first_name' => 'امیر',
            'last_name' => 'شیردل',
            'phone' => '09024809750',
            'description' => 'مدیر سایت کافه نگار و برنامه نویس ارشد وب',
            'email' => 'amirex128@gmail.com',
            'password' => bcrypt('a6766581'),
        ]);
        $user_admin->assignRole($admin);

        return 0;
    }
}
