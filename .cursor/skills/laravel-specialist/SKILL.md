---
name: laravel-specialist
description: Build and configure Laravel 13+ applications, including creating Eloquent models and relationships, implementing Fortify authentication, configuring Horizon queues, designing RESTful APIs with API resources, and building reactive interfaces with Inertia React v3. Use when creating Laravel models, setting up queue workers, implementing Fortify auth flows, building Inertia React components, optimising Eloquent queries, or configuring Laravel features.
license: MIT
metadata:
    author: https://github.com/Jeffallan
    version: "1.1.0"
    domain: backend
    triggers: Laravel, Eloquent, PHP framework, Laravel API, Artisan, Inertia.js, React v3, Laravel queues, Fortify, Horizon
    role: specialist
    scope: implementation
    output-format: code
    related-skills: fullstack-guardian, devops-engineer, security-reviewer
---

# Laravel Specialist

Senior Laravel specialist with deep expertise in Laravel 13+, Eloquent ORM, and modern PHP 8.5+ development.

## Core Workflow

1. **Analyse requirements** — Identify models, relationships, APIs, and queue needs
2. **Design architecture** — Plan database schema, service layers, and job queues
3. **Implement models** — Create Eloquent models with relationships, scopes, and casts; run `php artisan make:model` and verify with `php artisan migrate:status`
4. **Build features** — Develop controllers, services, API resources, and jobs; run `php artisan route:list` to verify routing
5. **Frontend Integration** — Develop reactive interfaces using Inertia React v3 and connect them with backend controllers.

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Eloquent ORM | `references/eloquent.md` | Models, relationships, scopes, query optimization |
| Routing & APIs | `references/routing.md` | Routes, controllers, middleware, API resources |
| Queue System | `references/queues.md` | Jobs, workers, Horizon, failed jobs, batching |
| Inertia React v3 | `references/inertia-react.md` | Components, hooks, props, shared data, routing |
| Authentication | `references/fortify.md` | Fortify configuration, actions, login, registration |

## Constraints

### MUST DO

- Use PHP 8.5+ features (readonly, enums, typed properties)
- Type hint all method parameters and return types
- Use Eloquent relationships properly (avoid N+1 with eager loading)
- Implement API resources for transforming data
- Queue long-running tasks
- Use service containers and dependency injection
- Follow PSR-12 coding standards
- Implement authentication using Laravel Fortify actions

### MUST NOT DO

- Use raw queries without protection (SQL injection)
- Skip eager loading (causes N+1 problems)
- Store sensitive data unencrypted
- Mix business logic in controllers
- Hardcode configuration values
- Skip validation on user input
- Use deprecated Laravel features
- Ignore queue failures

## Code Templates

Use these as starting points for every implementation.

### Eloquent Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

final class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'body', 'status', 'user_id'];

    protected $casts = [
        'status' => PostStatus::class, // backed enum
        'published_at' => 'immutable_datetime',
    ];

    // Relationships — always eager-load via ::with() at call site
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Local scope
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Published);
    }
}
```

### Migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

### API Resource

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'body'         => $this->body,
            'status'       => $this->status->value,
            'published_at' => $this->published_at?->toIso8601String(),
            'author'       => new UserResource($this->whenLoaded('author')),
            'comments'     => CommentResource::collection($this->whenLoaded('comments')),
        ];
    }
}
```

### Queued Job

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Post;
use App\Enums\PostStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class PublishPost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private readonly Post $post,
    ) {}

    public function handle(): void
    {
        $this->post->update([
            'status'       => PostStatus::Published,
            'published_at' => now(),
        ]);
    }

    public function failed(\Throwable $e): void
    {
        // Log or notify — never silently swallow failures
        logger()->error('PublishPost failed', ['post' => $this->post->id, 'error' => $e->getMessage()]);
    }
}
```

### Inertia React v3 Component

```tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    post: {
        id: number;
        title: string;
        body: string;
    };
}

export default function EditPost({ post }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: post.title,
        body: post.body,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/posts/${post.id}`);
    }

    return (
        <>
            <Head title="Edit Post" />
            <form onSubmit={submit}>
                <input 
                    value={data.title} 
                    onChange={e => setData('title', e.target.value)} 
                />
                {errors.title && <div>{errors.title}</div>}
                
                <textarea 
                    value={data.body} 
                    onChange={e => setData('body', e.target.value)} 
                />
                <button type="submit" disabled={processing}>Update</button>
            </form>
        </>
    );
}
```

## Validation Checkpoints

Run these at each workflow stage to confirm correctness before proceeding:

| Stage | Command | Expected Result |
|-------|---------|-----------------|
| After migration | `php artisan migrate:status` | All migrations show `Ran` |
| After routing | `php artisan route:list --path=api` | New routes appear with correct verbs |
| After job dispatch | `php artisan queue:work --once` | Job processes without exception |
| Auth Config | `php artisan fortify:publish` | Fortify actions and config are correctly set |
| Before PR | `./vendor/bin/pint --test` | PSR-12 linting passes |

## Knowledge Reference

Laravel 13+, Eloquent ORM, PHP 8.5+, API resources, Fortify, queues, Horizon, Inertia React v3, Octane, Redis, broadcasting, events/listeners, notifications, task scheduling

[Documentation](https://jeffallan.github.io/claude-skills/skills/backend/laravel-specialist/)
