---
name: inertia-react-development
description: Laravel + Inertia.js + React integration patterns. Use when building Inertia page components, handling forms with useForm, managing shared data, or implementing persistent layouts. Triggers on tasks involving Inertia.js, page props, form handling, or Laravel React integration.
license: MIT
metadata:
  author: AsyrafHussin
  version: "1.0.2"
  laravelVersion: "13.x"
  phpVersion: "8.5+"
---

# Laravel + Inertia.js + React

Comprehensive patterns for building modern monolithic applications with Laravel, Inertia.js, and React. Contains 30+ rules for seamless full-stack development.

## When to Apply

Reference these guidelines when:
- Creating Inertia page components
- Handling forms with useForm hook
- Managing shared data and authentication
- Implementing persistent layouts
- Navigating between pages
- Creating or modifying React page components for Inertia
- Working with forms in React (using `<Form>`, `useForm`, or `useHttp`)
- Implementing client-side navigation with `<Link>` or `router`
- Using v3 features: deferred props, prefetching, optimistic updates, instant visits, layout props, HTTP requests, WhenVisible, InfiniteScroll, once props, flash data, or polling
- Building React-specific features with the Inertia protocol

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Page Components | CRITICAL | `page-` |
| 2 | Forms & Validation | CRITICAL | `form-` |
| 3 | Navigation & Links | HIGH | `nav-` |
| 4 | Shared Data | HIGH | `shared-` |
| 5 | Layouts | MEDIUM | `layout-` |
| 6 | File Uploads | MEDIUM | `upload-` |
| 7 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

### 1. Page Components (CRITICAL)

- `page-props-typing` - Type page props from Laravel
- `page-component-structure` - Standard page component pattern
- `page-head-management` - Title and meta tags with Head
- `page-default-layout` - Assign layouts to pages

### 2. Forms & Validation (CRITICAL)

- `form-useform-basic` - Basic useForm usage
- `form-validation-errors` - Display Laravel validation errors
- `form-processing-state` - Handle form submission state
- `form-reset-preserve` - Reset vs preserve form data
- `form-nested-data` - Handle nested form data
- `form-transform` - Transform data before submit

### 3. Navigation & Links (HIGH)

- `nav-link-component` - Use Link for navigation
- `nav-preserve-state` - Preserve scroll and state
- `nav-partial-reloads` - Reload only what changed
- `nav-replace-history` - Replace vs push history

### 4. Shared Data (HIGH)

- `shared-auth-user` - Access authenticated user
- `shared-flash-messages` - Handle flash messages
- `shared-global-props` - Access global props
- `shared-typescript` - Type shared data

### 5. Layouts (MEDIUM)

- `layout-persistent` - Persistent layouts pattern
- `layout-nested` - Nested layouts
- `layout-default` - Default layout assignment
- `layout-conditional` - Conditional layouts

### 6. File Uploads (MEDIUM)

- `upload-basic` - Basic file upload
- `upload-progress` - Upload progress tracking
- `upload-multiple` - Multiple file uploads

### 7. Advanced Patterns (LOW)

- `advanced-polling` - Real-time polling
- `advanced-prefetch` - Prefetch pages
- `advanced-modal-pages` - Modal as pages
- `advanced-infinite-scroll` - Infinite scrolling

## Essential Patterns

### Page Component with TypeScript

```tsx
// resources/js/Pages/Posts/Index.tsx
import { Head, Link } from '@inertiajs/react'

interface Post {
  id: number
  title: string
  excerpt: string
  created_at: string
  author: {
    id: number
    name: string
  }
}

interface Props {
  posts: {
    data: Post[]
    links: { url: string | null; label: string; active: boolean }[]
  }
  filters: {
    search?: string
  }
}

export default function Index({ posts, filters }: Props) {
  return (
    <>
      <Head title="Posts" />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Posts</h1>

        <div className="space-y-4">
          {posts.data.map((post) => (
            <article key={post.id} className="p-4 bg-white rounded-lg shadow">
              <Link href={route('posts.show', post.id)}>
                <h2 className="text-xl font-semibold hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <p className="text-sm text-gray-400 mt-2">
                By {post.author.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
```

### Form with useForm

```tsx
// resources/js/Pages/Posts/Create.tsx
import { Head, useForm, Link } from '@inertiajs/react'
import { FormEvent } from 'react'

interface Category {
  id: number
  name: string
}

interface Props {
  categories: Category[]
}

export default function Create({ categories }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    body: '',
    category_id: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('posts.store'), {
      onSuccess: () => reset(),
    })
  }

  return (
    <>
      <Head title="Create Post" />

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto py-8">
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            value={data.category_id}
            onChange={(e) => setData('category_id', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block font-medium mb-1">
            Content
          </label>
          <textarea
            id="body"
            value={data.body}
            onChange={(e) => setData('body', e.target.value)}
            rows={10}
            className="w-full border rounded px-3 py-2"
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {processing ? 'Creating...' : 'Create Post'}
          </button>

          <Link
            href={route('posts.index')}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
```

### Persistent Layout

```tsx
// resources/js/Layouts/AppLayout.tsx
import { Link, usePage } from '@inertiajs/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  const { auth } = usePage().props as { auth: { user: { name: string } } }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between">
          <Link href="/" className="font-bold">
            My App
          </Link>
          <span>Welcome, {auth.user.name}</span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

// resources/js/Pages/Dashboard.tsx
import AppLayout from '@/Layouts/AppLayout'

export default function Dashboard() {
  return <h1>Dashboard</h1>
}

// Assign persistent layout
Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
```

### Laravel Controller

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Posts/Index', [
            'posts' => Post::with('author:id,name')
                ->latest()
                ->paginate(10),
            'filters' => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Posts/Create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = Post::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return redirect()
            ->route('posts.show', $post)
            ->with('success', 'Post created successfully.');
    }

    public function show(Post $post): Response
    {
        return Inertia::render('Posts/Show', [
            'post' => $post->load('author', 'category'),
        ]);
    }
}
```

### Shared Data (HandleInertiaRequests)

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }
}
```

### Flash Messages Component

```tsx
// resources/js/Components/FlashMessages.tsx
import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function FlashMessages() {
  const { flash } = usePage().props as {
    flash: { success?: string; error?: string }
  }
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (flash.success || flash.error) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [flash])

  if (!visible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      {flash.success && (
        <div className="bg-green-500 text-white px-4 py-2 rounded shadow">
          {flash.success}
        </div>
      )}
      {flash.error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded shadow">
          {flash.error}
        </div>
      )}
    </div>
  )
}
```

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/form-useform-basic.md
rules/page-props-typing.md
rules/layout-persistent.md
```

## Project Structure

```
inertia-react-development/
├── SKILL.md                 # This file - overview and examples

├── README.md                # Quick reference guide

├── AGENTS.md                # Integration guide for AI agents

├── metadata.json            # Skill metadata and references

└── rules/
    ├── _sections.md         # Rule categories and priorities

    ├── _template.md         # Template for new rules

    ├── page-*.md            # Page component patterns (6 rules)

    ├── form-*.md            # Form handling patterns (8 rules)

    ├── nav-*.md             # Navigation patterns (5 rules)

    ├── shared-*.md          # Shared data patterns (4 rules)

    └── layout-*.md          # Layout patterns (1 rule)

```

## References

- [Inertia.js Documentation](https://inertiajs.com/) - Official Inertia.js docs
- [Laravel Documentation](https://laravel.com/docs) - Laravel framework docs
- [React Documentation](https://react.dev/) - Official React docs
- [Ziggy](https://github.com/tighten/ziggy) - Laravel route helper for JavaScript

## Documentation

Use `search-docs` for detailed Inertia v3 React patterns and documentation.

## Basic Usage

### Page Components Location

React page components should be placed in the `resources/js/pages` directory.

### Page Component Structure

<!-- Basic React Page Component -->
```react
export default function UsersIndex({ users }) {
    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
        </div>
    )
}
```

## Client-Side Navigation

### Basic Link Component

Use `<Link>` for client-side navigation instead of traditional `<a>` tags:

<!-- Inertia React Navigation -->
```react
import { Link, router } from '@inertiajs/react'

<Link href="/">Home</Link>
<Link href="/users">Users</Link>
<Link href={`/users/${user.id}`}>View User</Link>
```

### Link with Method

<!-- Link with POST Method -->
```react
import { Link } from '@inertiajs/react'

<Link href="/logout" method="post" as="button">
    Logout
</Link>
```

### Prefetching

Prefetch pages to improve perceived performance:

<!-- Prefetch on Hover -->
```react
import { Link } from '@inertiajs/react'

<Link href="/users" prefetch>
    Users
</Link>
```

### Programmatic Navigation

<!-- Router Visit -->
```react
import { router } from '@inertiajs/react'

function handleClick() {
    router.visit('/users')
}

// Or with options
router.visit('/users', {
    method: 'post',
    data: { name: 'John' },
    onSuccess: () => console.log('Success!'),
})
```

## Form Handling

### Form Component (Recommended)

The recommended way to build forms is with the `<Form>` component:

<!-- Form Component Example -->
```react
import { Form } from '@inertiajs/react'

export default function CreateUser() {
    return (
        <Form action="/users" method="post">
            {({ errors, processing, wasSuccessful }) => (
                <>
                    <input type="text" name="name" />
                    {errors.name && <div>{errors.name}</div>}

                    <input type="email" name="email" />
                    {errors.email && <div>{errors.email}</div>}

                    <button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create User'}
                    </button>

                    {wasSuccessful && <div>User created!</div>}
                </>
            )}
        </Form>
    )
}
```

### Form Component With All Props

<!-- Form Component Full Example -->
```react
import { Form } from '@inertiajs/react'

<Form action="/users" method="post">
    {({
        errors,
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        recentlySuccessful,
        clearErrors,
        resetAndClearErrors,
        defaults,
        isDirty,
        reset,
        submit
    }) => (
        <>
            <input type="text" name="name" defaultValue={defaults.name} />
            {errors.name && <div>{errors.name}</div>}

            <button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
            </button>

            {progress && (
                <progress value={progress.percentage} max="100">
                    {progress.percentage}%
                </progress>
            )}

            {wasSuccessful && <div>Saved!</div>}
        </>
    )}
</Form>
```

### Form Component Reset Props

The `<Form>` component supports automatic resetting:

- `resetOnError` - Reset form data when the request fails
- `resetOnSuccess` - Reset form data when the request succeeds
- `setDefaultsOnSuccess` - Update default values on success

Use the `search-docs` tool with a query of `form component resetting` for detailed guidance.

<!-- Form with Reset Props -->
```react
import { Form } from '@inertiajs/react'

<Form
    action="/users"
    method="post"
    resetOnSuccess
    setDefaultsOnSuccess
>
    {({ errors, processing, wasSuccessful }) => (
        <>
            <input type="text" name="name" />
            {errors.name && <div>{errors.name}</div>}

            <button type="submit" disabled={processing}>
                Submit
            </button>
        </>
    )}
</Form>
```

Forms can also be built using the `useForm` helper for more programmatic control. Use the `search-docs` tool with a query of `useForm helper` for guidance.

### `useForm` Hook

For more programmatic control or to follow existing conventions, use the `useForm` hook:

<!-- useForm Hook Example -->
```react
import { useForm } from '@inertiajs/react'

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    })

    function submit(e) {
        e.preventDefault()
        post('/users', {
            onSuccess: () => reset('password'),
        })
    }

    return (
        <form onSubmit={submit}>
            <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <div>{errors.name}</div>}

            <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
            />
            {errors.email && <div>{errors.email}</div>}

            <input
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
            />
            {errors.password && <div>{errors.password}</div>}

            <button type="submit" disabled={processing}>
                Create User
            </button>
        </form>
    )
}
```

## Inertia v3 Features

### HTTP Requests

Use the `useHttp` hook for standalone HTTP requests that do not trigger Inertia page visits. It provides the same developer experience as `useForm`, but for plain JSON endpoints.

<!-- useHttp Example -->
```react
import { useHttp } from '@inertiajs/react'

export default function Search() {
    const { data, setData, get, processing } = useHttp({
        query: '',
    })

    function search(e) {
        setData('query', e.target.value)
        get('/api/search', {
            onSuccess: (response) => {
                console.log(response)
            },
        })
    }

    return (
        <>
            <input value={data.query} onChange={search} />
            {processing && <div>Searching...</div>}
        </>
    )
}
```

### Optimistic Updates

Apply data changes instantly before the server responds, with automatic rollback on failure:

<!-- Optimistic Update with Router -->
```react
import { router } from '@inertiajs/react'

function like(post) {
    router.optimistic((props) => ({
        post: {
            ...props.post,
            likes: props.post.likes + 1,
        },
    })).post(`/posts/${post.id}/like`)
}
```

Optimistic updates also work with `useForm` and the `<Form>` component:

<!-- Optimistic Update with Form Component -->
```react
import { Form } from '@inertiajs/react'

<Form
    action="/todos"
    method="post"
    optimistic={(props, data) => ({
        todos: [...props.todos, { id: Date.now(), name: data.name, done: false }],
    })}
>
    <input type="text" name="name" />
    <button type="submit">Add Todo</button>
</Form>
```

### Instant Visits

Navigate to a new page immediately without waiting for the server response. The target component renders right away with shared props, while page-specific props load in the background.

<!-- Instant Visit with Link -->
```react
import { Link } from '@inertiajs/react'

<Link href="/dashboard" component="Dashboard">Dashboard</Link>

<Link
    href="/posts/1"
    component="Posts/Show"
    pageProps={{ post: { id: 1, title: 'My Post' } }}
>
    View Post
</Link>
```

### Layout Props

Share dynamic data between pages and persistent layouts:

<!-- Layout Props in Layout -->
```react
export default function Layout({ title = 'My App', showSidebar = true, children }) {
    return (
        <>
            <header>{title}</header>
            {showSidebar && <aside>Sidebar</aside>}
            <main>{children}</main>
        </>
    )
}
```

<!-- Setting Layout Props from Page -->
```react
import { setLayoutProps } from '@inertiajs/react'

export default function Dashboard() {
    setLayoutProps({
        title: 'Dashboard',
        showSidebar: false,
    })

    return <h1>Dashboard</h1>
}
```

### Deferred Props

Use deferred props to load data after initial page render:

<!-- Deferred Props with Empty State -->
```react
export default function UsersIndex({ users }) {
    return (
        <div>
            <h1>Users</h1>
            {!users ? (
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
```

### Polling

Use the `usePoll` hook to automatically refresh data at intervals. It handles cleanup on unmount and throttles polling when the tab is inactive.

<!-- Basic Polling -->
```react
import { usePoll } from '@inertiajs/react'

export default function Dashboard({ stats }) {
    usePoll(5000)

    return (
        <div>
            <h1>Dashboard</h1>
            <div>Active Users: {stats.activeUsers}</div>
        </div>
    )
}
```

<!-- Polling With Request Options and Manual Control -->
```react
import { usePoll } from '@inertiajs/react'

export default function Dashboard({ stats }) {
    const { start, stop } = usePoll(5000, {
        only: ['stats'],
        onStart() {
            console.log('Polling request started')
        },
        onFinish() {
            console.log('Polling request finished')
        },
    }, {
        autoStart: false,
        keepAlive: true,
    })

    return (
        <div>
            <h1>Dashboard</h1>
            <div>Active Users: {stats.activeUsers}</div>
            <button onClick={start}>Start Polling</button>
            <button onClick={stop}>Stop Polling</button>
        </div>
    )
}
```

- `autoStart` (default `true`) - set to `false` to start polling manually via the returned `start()` function
- `keepAlive` (default `false`) - set to `true` to prevent throttling when the browser tab is inactive

### WhenVisible

Lazy-load a prop when an element scrolls into view. Useful for deferring expensive data that sits below the fold:

<!-- WhenVisible Example -->
```react
import { WhenVisible } from '@inertiajs/react'

export default function Dashboard({ stats }) {
    return (
        <div>
            <h1>Dashboard</h1>

            <WhenVisible data="stats" buffer={200} fallback={<div className="animate-pulse">Loading stats...</div>}>
                {({ fetching }) => (
                    <div>
                        <p>Total Users: {stats.total_users}</p>
                        <p>Revenue: {stats.revenue}</p>
                        {fetching && <span>Refreshing...</span>}
                    </div>
                )}
            </WhenVisible>
        </div>
    )
}
```

### InfiniteScroll

Automatically load additional pages of paginated data as users scroll:

<!-- InfiniteScroll Example -->
```react
import { InfiniteScroll } from '@inertiajs/react'

export default function Users({ users }) {
    return (
        <InfiniteScroll data="users">
            {users.data.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </InfiniteScroll>
    )
}
```

The server must use `Inertia::scroll()` to configure the paginated data. Use the `search-docs` tool with a query of `infinite scroll` for detailed guidance on buffers, manual loading, reverse mode, and custom trigger elements.

## Server-Side Patterns

Server-side patterns (Inertia::render, props, middleware) are covered in inertia-laravel guidelines.

## Common Pitfalls

- Using traditional `<a>` links instead of Inertia's `<Link>` component (breaks SPA behavior)
- Forgetting to add loading states (skeleton screens) when using deferred props
- Not handling the `undefined` state of deferred props before data loads
- Using `<form>` without preventing default submission (use `<Form>` component or `e.preventDefault()`)
- Forgetting to check if `<Form>` component is available in your Inertia version
- Using `router.cancel()` instead of `router.cancelAll()` (v3 breaking change)
- Using `router.on('invalid', ...)` or `router.on('exception', ...)` instead of the renamed `httpException` and `networkError` events
