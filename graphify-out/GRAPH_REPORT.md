# Graph Report - shopify  (2026-06-15)

## Corpus Check
- 306 files · ~74,268 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1501 nodes · 2791 edges · 146 communities (99 shown, 47 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `437a765c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 115|Community 115]]
- [[_COMMUNITY_Community 116|Community 116]]
- [[_COMMUNITY_Community 117|Community 117]]
- [[_COMMUNITY_Community 118|Community 118]]
- [[_COMMUNITY_Community 119|Community 119]]
- [[_COMMUNITY_Community 120|Community 120]]
- [[_COMMUNITY_Community 121|Community 121]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 139 edges
2. `QueryParams` - 76 edges
3. `RouteDefinition` - 73 edges
4. `RouteFormDefinition` - 73 edges
5. `RouteQueryOptions` - 73 edges
6. `applyUrlDefaults()` - 37 edges
7. `TestCase` - 35 edges
8. `WalletTransactionType` - 30 edges
9. `Button()` - 24 edges
10. `User` - 15 edges

## Surprising Connections (you probably didn't know these)
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/breadcrumb.tsx → resources/js/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dialog.tsx → resources/js/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dropdown-menu.tsx → resources/js/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dropdown-menu.tsx → resources/js/lib/utils.ts
- `DropdownMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dropdown-menu.tsx → resources/js/lib/utils.ts

## Import Cycles
- None detected.

## Communities (146 total, 47 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (31): Request, HasMany, BelongsTo, BelongsTo, HasMany, BelongsTo, HasMany, BelongsTo (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (8): UseTwoFactorAuthReturn, disable(), enable(), qrCode(), recoveryCodes(), regenerateRecoveryCodes(), secretKey(), twoFactor

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (23): AdjustWalletRequest, StorePlanRequest, UpdatePlanRequest, User, User, PasswordResetController, RedirectResponse, Request (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (15): SmsResult, SmsResult, static, static, PlanFactory, SubscriptionFactory, UserFactory, WalletFactory (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (20): AppHeader(), mainNavItems, Props, rightNavItems, UserInfo(), GetInitialsFn, Avatar(), AvatarFallback() (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (30): appearance, edit(), AppContent(), Props, AppShell(), Props, AppSidebar(), AppearanceToggleTab() (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (11): ConfirmedPasswordStatusController, ConfirmedTwoFactorAuthenticationController, EmailVerificationNotificationController, EmailVerificationPromptController, RegisteredUserController, TwoFactorAuthenticatedSessionController, TwoFactorQrCodeController, TwoFactorSecretKeyController (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (15): Props, Props, Props, Props, Props, Props, PageProps, Props (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (39): dependencies, class-variance-authority, clsx, concurrently, globals, @inertiajs/react, @inertiajs/vite, input-otp (+31 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (15): confirm, DumpController, HomeController, register, store(), wallet, edit(), security (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (32): PaginationNav(), PageProps, PERIOD_LABELS, PlansPage(), WalletPage(), formatDate(), formatDateTime(), formatToman() (+24 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (33): adminNavItems, financialNavItems, footerNavItems, mainNavItems, NavFooter(), NavUser(), useIsMobile(), DropdownMenuContent() (+25 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (7): EntriesController, MailEmlController, ModelsController, MonitoredTagController, QueueBatchesController, RecordingController, Controllers

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (11): Props, PageProps, QUICK_AMOUNTS, PageProps, Card(), CardContent(), CardDescription(), CardHeader() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (7): BelongsTo, User, PasswordResetCodeService, Facade, Sms, PasswordResetCode, SmsManagerTest

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (5): dashboard(), home(), login(), register(), AuthLayoutProps

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (24): InputError(), TextLink(), cn(), CardFooter(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuList(), navigationMenuTriggerStyle (+16 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (12): Props, CleanupFn, logout(), DropdownMenuCheckboxItem(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.11
Nodes (12): NavMain(), IsCurrentOrParentUrlFn, IsCurrentUrlFn, UseCurrentUrlReturn, WhenCurrentUrlFn, toUrl(), edit(), profile (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (3): AdminAccessTest, WalletServiceTest, WalletService

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (7): RedirectResponse, Request, Response, ProfileController, ProfileDeleteRequest, ProfileUpdateRequest, ProfileController

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (5): boost, local, login, storage, RouteQueryOptions

### Community 25 - "Community 25"
Cohesion: 0.20
Nodes (13): BILLING_PERIODS, PlanFormData, Props, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter() (+5 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (13): description, extra, laravel, post-create-project, keywords, dont-discover, installer, license (+5 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (15): devDependencies, babel-plugin-react-compiler, eslint, eslint-config-prettier, eslint-import-resolver-typescript, @eslint/js, eslint-plugin-import, eslint-plugin-react (+7 more)

### Community 28 - "Community 28"
Cohesion: 0.21
Nodes (6): Plan, RedirectResponse, Request, Response, SubscriptionPlanController, SubscriptionPlanController

### Community 29 - "Community 29"
Cohesion: 0.10
Nodes (4): PasskeyConfirmationController, PasskeyLoginController, PasskeyRegistrationController, Controllers

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 32 - "Community 32"
Cohesion: 0.36
Nodes (6): PlanController, Plan, RedirectResponse, Response, StorePlanRequest, UpdatePlanRequest

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (4): VerificationNotificationTest, BaseTestCase, ExampleTest, TestCase

### Community 36 - "Community 36"
Cohesion: 0.18
Nodes (11): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.18
Nodes (10): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc, private (+2 more)

### Community 38 - "Community 38"
Cohesion: 0.22
Nodes (10): Tabs(), TabsContent(), TabsContentProps, TabsContext, TabsContextValue, TabsList(), TabsProps, TabsTrigger() (+2 more)

### Community 40 - "Community 40"
Cohesion: 0.36
Nodes (6): RedirectResponse, Response, SecurityController, Controller, PasswordUpdateRequest, TwoFactorAuthenticationRequest

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (5): RedirectResponse, Request, Response, WalletController, ChargeWalletRequest

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (5): Request, Request, JsonResource, PlanResource, SubscriptionResource

### Community 44 - "Community 44"
Cohesion: 0.19
Nodes (6): Props, confirm(), InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 46 - "Community 46"
Cohesion: 0.20
Nodes (10): require, inertiajs/inertia-laravel, laravel/chisel, laravel/fortify, laravel/framework, laravel/telescope, laravel/tinker, laravel/wayfinder (+2 more)

### Community 47 - "Community 47"
Cohesion: 0.22
Nodes (9): scripts, build, build:ssr, dev, format, format:check, lint, lint:check (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.19
Nodes (9): Props, destroy(), Auth, Passkey, TwoFactorSecretKey, TwoFactorSetupData, User, InertiaConfig (+1 more)

### Community 49 - "Community 49"
Cohesion: 0.46
Nodes (4): UserController, Request, Response, User

### Community 52 - "Community 52"
Cohesion: 0.25
Nodes (4): Auth, Controllers, Settings, User

### Community 53 - "Community 53"
Cohesion: 0.32
Nodes (3): PasswordConfirmationTest, RefreshDatabase, ExampleTest

### Community 55 - "Community 55"
Cohesion: 0.36
Nodes (4): Database\\Seeders\\, Seeder, PlanSeeder, WithoutModelEvents

### Community 56 - "Community 56"
Cohesion: 0.43
Nodes (6): Content, Envelope, PasswordResetCodeMail, Mailable, Queueable, SerializesModels

### Community 57 - "Community 57"
Cohesion: 0.06
Nodes (7): CommandsController, ExceptionController, MailHtmlController, UserWalletController, verification, applyUrlDefaults(), UrlDefaults

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (8): Breadcrumbs(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarTrigger()

### Community 59 - "Community 59"
Cohesion: 0.25
Nodes (4): Fortify, Laravel, Passkeys, Telescope

### Community 61 - "Community 61"
Cohesion: 0.43
Nodes (4): AdjustWalletRequest, UserWalletController, RedirectResponse, User

### Community 62 - "Community 62"
Cohesion: 0.43
Nodes (3): Request, Middleware, HandleInertiaRequests

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 67 - "Community 67"
Cohesion: 0.48
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 69 - "Community 69"
Cohesion: 0.53
Nodes (4): Closure, Request, Response, EnsureUserIsAdmin

### Community 70 - "Community 70"
Cohesion: 0.53
Nodes (4): Closure, Request, Response, HandleAppearance

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (7): autoload, autoload-dev, psr-4, psr-4, App\\, Database\\Factories\\, Tests\\

### Community 89 - "Community 89"
Cohesion: 0.11
Nodes (7): login, wallet, show(), users, charge(), RouteDefinition, wellKnown

### Community 91 - "Community 91"
Cohesion: 0.60
Nodes (3): SmsResult, sendOtp(), sendPattern()

### Community 95 - "Community 95"
Cohesion: 0.83
Nodes (3): emailRules(), nameRules(), profileRules()

### Community 97 - "Community 97"
Cohesion: 0.83
Nodes (3): down(), getConnection(), up()

## Knowledge Gaps
- **267 isolated node(s):** `$schema`, `name`, `type`, `description`, `keywords` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WalletTransactionType` connect `Community 0` to `Community 2`, `Community 41`, `Community 10`, `Community 42`, `Community 49`, `Community 22`, `Community 28`, `Community 93`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `QueryParams` connect `Community 9` to `Community 1`, `Community 5`, `Community 6`, `Community 12`, `Community 13`, `Community 15`, `Community 17`, `Community 19`, `Community 21`, `Community 23`, `Community 24`, `Community 28`, `Community 29`, `Community 31`, `Community 34`, `Community 35`, `Community 39`, `Community 45`, `Community 54`, `Community 57`, `Community 60`, `Community 68`, `Community 71`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 77`, `Community 78`, `Community 79`, `Community 80`, `Community 81`, `Community 82`, `Community 83`, `Community 84`, `Community 85`, `Community 87`, `Community 89`, `Community 90`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `RouteDefinition` connect `Community 89` to `Community 1`, `Community 5`, `Community 6`, `Community 9`, `Community 12`, `Community 13`, `Community 15`, `Community 17`, `Community 19`, `Community 21`, `Community 23`, `Community 24`, `Community 28`, `Community 29`, `Community 31`, `Community 34`, `Community 35`, `Community 39`, `Community 45`, `Community 54`, `Community 57`, `Community 60`, `Community 68`, `Community 71`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 77`, `Community 78`, `Community 79`, `Community 80`, `Community 81`, `Community 82`, `Community 83`, `Community 84`, `Community 85`, `Community 87`, `Community 90`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `$schema`, `name`, `type` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05045045045045045 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._