# Graph Report - shopify  (2026-06-15)

## Corpus Check
- 306 files · ~74,736 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1549 nodes · 2955 edges · 149 communities (99 shown, 50 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11b0c4fd`
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
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 116|Community 116]]
- [[_COMMUNITY_Community 117|Community 117]]
- [[_COMMUNITY_Community 118|Community 118]]
- [[_COMMUNITY_Community 119|Community 119]]
- [[_COMMUNITY_Community 120|Community 120]]
- [[_COMMUNITY_Community 121|Community 121]]
- [[_COMMUNITY_Community 122|Community 122]]
- [[_COMMUNITY_Community 148|Community 148]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 146 edges
2. `QueryParams` - 78 edges
3. `RouteDefinition` - 75 edges
4. `RouteFormDefinition` - 75 edges
5. `RouteQueryOptions` - 75 edges
6. `applyUrlDefaults()` - 38 edges
7. `TestCase` - 37 edges
8. `WalletTransactionType` - 31 edges
9. `Button()` - 24 edges
10. `User` - 16 edges

## Surprising Connections (you probably didn't know these)
- `InputError()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/input-error.tsx → resources/js/lib/utils.ts
- `TextLink()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/text-link.tsx → resources/js/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/breadcrumb.tsx → resources/js/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.tsx → resources/js/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/dialog.tsx → resources/js/lib/utils.ts

## Import Cycles
- 1-file cycle: `resources/js/pages/admin/plans/index.tsx -> resources/js/pages/admin/plans/index.tsx`
- 1-file cycle: `resources/js/pages/admin/users/index.tsx -> resources/js/pages/admin/users/index.tsx`

## Communities (149 total, 50 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (35): RedirectResponse, Request, Response, WalletController, Request, Request, Request, HasMany (+27 more)

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
Cohesion: 0.13
Nodes (18): AppHeader(), mainNavItems, Props, rightNavItems, UserInfo(), GetInitialsFn, useInitials(), Avatar() (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (8): AuthenticatedSessionController, ConfirmedPasswordStatusController, ConfirmedTwoFactorAuthenticationController, EmailVerificationNotificationController, EmailVerificationPromptController, RegisteredUserController, TwoFactorQrCodeController, Controllers

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (18): edit(), AppearanceToggleTab(), Appearance, applyTheme(), getStoredAppearance(), handleSystemThemeChange(), initializeTheme(), isDarkMode() (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (17): Props, NavMain(), Props, Props, TextLink(), IsCurrentOrParentUrlFn, IsCurrentUrlFn, useCurrentUrl() (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (36): dependencies, class-variance-authority, clsx, concurrently, globals, @inertiajs/react, @inertiajs/vite, input-otp (+28 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (11): boost, HomeController, UserWalletController, wallet, userPassword, addNestedParams(), clearParamFamily(), getValue() (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (6): EntriesController, ModelsController, NotificationsController, QueueBatchesController, ViewsController, Controllers

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (17): PlansPage(), WalletPage(), formatDate(), formatDateTime(), formatToman(), formatTomanLabel(), Table(), TableBody() (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (31): adminNavItems, financialNavItems, footerNavItems, mainNavItems, NavFooter(), Sidebar(), SidebarContent(), SidebarContext (+23 more)

### Community 14 - "Community 14"
Cohesion: 0.32
Nodes (8): Props, PageProps, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (9): MailHtmlController, QueriesController, local, storage, index(), show(), users, applyUrlDefaults() (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (7): BelongsTo, User, PasswordResetCodeService, Facade, Sms, PasswordResetCode, SmsManagerTest

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (10): AuthCardLayout(), AuthSimpleLayout(), AuthSplitLayout(), dashboard(), home(), login(), register(), AuthLayoutProps (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (14): BILLING_PERIODS, PlanFormData, PlanFormDialog(), Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.12
Nodes (5): MailEmlController, TwoFactorSecretKeyController, login, security, RouteQueryOptions

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (19): NavUser(), Props, UserMenuContent(), CleanupFn, useMobileNavigation(), useIsMobile(), logout(), DropdownMenu() (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.13
Nodes (21): cn(), Alert(), AlertDescription(), AlertTitle(), alertVariants, NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator() (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.19
Nodes (13): RedirectResponse, Request, Response, ProfileController, ProfileDeleteRequest, ProfileUpdateRequest, ProfileController, destroy() (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (5): confirm, VerifyEmailController, register, login, RouteFormDefinition

### Community 25 - "Community 25"
Cohesion: 0.14
Nodes (13): description, extra, laravel, post-create-project, keywords, dont-discover, installer, license (+5 more)

### Community 26 - "Community 26"
Cohesion: 0.13
Nodes (15): devDependencies, babel-plugin-react-compiler, eslint, eslint-config-prettier, eslint-import-resolver-typescript, @eslint/js, eslint-plugin-import, eslint-plugin-react (+7 more)

### Community 27 - "Community 27"
Cohesion: 0.07
Nodes (30): AdjustWalletRequest, PlanController, Plan, RedirectResponse, Response, UserController, Request, Response (+22 more)

### Community 28 - "Community 28"
Cohesion: 0.10
Nodes (4): PasskeyConfirmationController, PasskeyLoginController, PasskeyRegistrationController, Controllers

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (16): AppContent(), Props, AppShell(), Props, AppSidebar(), AppSidebarHeader(), Breadcrumbs(), PaginationNav() (+8 more)

### Community 32 - "Community 32"
Cohesion: 0.20
Nodes (4): VerificationNotificationTest, BaseTestCase, ExampleTest, TestCase

### Community 34 - "Community 34"
Cohesion: 0.18
Nodes (11): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.18
Nodes (10): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc, private (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.14
Nodes (15): Paginated, PaginationLink, Tabs(), TabsContent(), TabsContentProps, TabsContext, TabsContextValue, TabsList() (+7 more)

### Community 38 - "Community 38"
Cohesion: 0.12
Nodes (11): BelongsTo, HasMany, Authenticatable, HasOne, User, Notifiable, PasskeyAuthenticatable, PasskeyUser (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.16
Nodes (11): Props, Props, TransactionsTable(), PageProps, QUICK_AMOUNTS, edit(), store(), PageProps (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (5): appearance, DumpController, RecordingController, RouteDefinition, wellKnown

### Community 42 - "Community 42"
Cohesion: 0.27
Nodes (9): Props, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogOverlay(), DialogTitle() (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (7): Props, ManageTwoFactor(), Props, destroy(), useTwoFactorAuth(), edit(), Props

### Community 44 - "Community 44"
Cohesion: 0.22
Nodes (9): require, inertiajs/inertia-laravel, laravel/chisel, laravel/fortify, laravel/framework, laravel/telescope, laravel/tinker, laravel/wayfinder (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (9): scripts, build, build:ssr, dev, format, format:check, lint, lint:check (+1 more)

### Community 46 - "Community 46"
Cohesion: 0.28
Nodes (7): Auth, Passkey, TwoFactorSecretKey, TwoFactorSetupData, User, InertiaConfig, InputHTMLAttributes

### Community 47 - "Community 47"
Cohesion: 0.21
Nodes (6): TwoFactorChallengeTest, InputError(), InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (4): Auth, Controllers, Settings, User

### Community 51 - "Community 51"
Cohesion: 0.32
Nodes (3): PasswordConfirmationTest, RefreshDatabase, ExampleTest

### Community 53 - "Community 53"
Cohesion: 0.39
Nodes (5): Database\\Seeders\\, Seeder, DatabaseSeeder, PlanSeeder, WithoutModelEvents

### Community 54 - "Community 54"
Cohesion: 0.36
Nodes (6): Content, Envelope, PasswordResetCodeMail, Mailable, Queueable, SerializesModels

### Community 58 - "Community 58"
Cohesion: 0.25
Nodes (4): Fortify, Laravel, Passkeys, Telescope

### Community 60 - "Community 60"
Cohesion: 0.19
Nodes (8): Props, TwoFactorSetupStep(), CopiedValue, CopyFn, useClipboard(), UseClipboardReturn, confirm(), DialogHeader()

### Community 61 - "Community 61"
Cohesion: 0.43
Nodes (3): Request, Middleware, HandleInertiaRequests

### Community 63 - "Community 63"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 66 - "Community 66"
Cohesion: 0.21
Nodes (9): PageProps, PERIOD_LABELS, AdminUserRow, Plan, Subscription, WalletTransaction, WalletTransactionTypeValue, Badge() (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.53
Nodes (4): Closure, Request, Response, EnsureUserIsAdmin

### Community 69 - "Community 69"
Cohesion: 0.53
Nodes (4): Closure, Request, Response, HandleAppearance

### Community 78 - "Community 78"
Cohesion: 0.39
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 81 - "Community 81"
Cohesion: 0.33
Nodes (7): autoload, autoload-dev, psr-4, psr-4, App\\, Database\\Factories\\, Tests\\

### Community 86 - "Community 86"
Cohesion: 0.31
Nodes (3): DashboardTest, PlaceholderPattern(), PlaceholderPatternProps

### Community 91 - "Community 91"
Cohesion: 0.33
Nodes (3): wallet, charge(), index()

### Community 92 - "Community 92"
Cohesion: 0.60
Nodes (3): SmsResult, sendOtp(), sendPattern()

### Community 96 - "Community 96"
Cohesion: 0.83
Nodes (3): emailRules(), nameRules(), profileRules()

### Community 98 - "Community 98"
Cohesion: 0.83
Nodes (3): down(), getConnection(), up()

## Knowledge Gaps
- **263 isolated node(s):** `Controller`, `$schema`, `name`, `type`, `description` (+258 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WalletTransactionType` connect `Community 0` to `Community 2`, `Community 27`, `Community 66`, `Community 38`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `QueryParams` connect `Community 9` to `Community 1`, `Community 5`, `Community 10`, `Community 13`, `Community 15`, `Community 17`, `Community 19`, `Community 148`, `Community 23`, `Community 24`, `Community 27`, `Community 28`, `Community 30`, `Community 33`, `Community 37`, `Community 40`, `Community 52`, `Community 55`, `Community 56`, `Community 57`, `Community 59`, `Community 67`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 77`, `Community 79`, `Community 80`, `Community 82`, `Community 83`, `Community 84`, `Community 87`, `Community 89`, `Community 90`, `Community 91`, `Community 93`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `RouteDefinition` connect `Community 40` to `Community 1`, `Community 5`, `Community 9`, `Community 10`, `Community 13`, `Community 15`, `Community 17`, `Community 19`, `Community 148`, `Community 23`, `Community 24`, `Community 27`, `Community 28`, `Community 30`, `Community 33`, `Community 37`, `Community 52`, `Community 55`, `Community 56`, `Community 57`, `Community 59`, `Community 67`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 77`, `Community 79`, `Community 80`, `Community 82`, `Community 83`, `Community 84`, `Community 87`, `Community 89`, `Community 90`, `Community 91`, `Community 93`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `Controller`, `$schema`, `name` to the rest of the system?**
  _263 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05387861084063616 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._