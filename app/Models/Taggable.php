<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphPivot;


/**
 * App\Models\Taggable
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Taggable newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Taggable newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Taggable query()
 * @mixin \Eloquent
 */
class Taggable extends MorphPivot
{

}
