import type { CategoryType } from './types';

// Static mock data for development/demo (used when DB is not connected)
export interface MockComponent {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryType;
  installCommand: string;
  downloads: number;
  isFeatured: boolean;
  tags: string[];
  companyName?: string;
  sourceUrl?: string;
}

export interface MockCompany {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  websiteUrl?: string;
}

export interface MockFeaturedProject {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  sponsorName?: string;
  problemStatement?: string;
  features: string[];
  integrations: string[];
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MockBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  isFeatured: boolean;
  publishedAt: string;
}

export const companies: MockCompany[] = [
  { id: '1', name: 'Google', slug: 'google', description: 'Search, cloud, and AI infrastructure', icon: '🔍', websiteUrl: 'https://google.com' },
  { id: '2', name: 'Microsoft', slug: 'microsoft', description: 'Enterprise software and cloud computing', icon: '🪟', websiteUrl: 'https://microsoft.com' },
  { id: '3', name: 'Stripe', slug: 'stripe', description: 'Payment processing infrastructure', icon: '💳', websiteUrl: 'https://stripe.com' },
  { id: '4', name: 'Vercel', slug: 'vercel', description: 'Frontend cloud platform', icon: '▲', websiteUrl: 'https://vercel.com' },
  { id: '5', name: 'Supabase', slug: 'supabase', description: 'Open source Firebase alternative', icon: '⚡', websiteUrl: 'https://supabase.com' },
  { id: '6', name: 'AWS', slug: 'aws', description: 'Amazon Web Services cloud platform', icon: '☁️', websiteUrl: 'https://aws.amazon.com' },
  { id: '7', name: 'Cloudflare', slug: 'cloudflare', description: 'Web security and CDN services', icon: '🛡️', websiteUrl: 'https://cloudflare.com' },
  { id: '8', name: 'GitHub', slug: 'github', description: 'Code hosting and collaboration', icon: '🐙', websiteUrl: 'https://github.com' },
  { id: '9', name: 'GitLab', slug: 'gitlab', description: 'DevOps lifecycle platform', icon: '🦊', websiteUrl: 'https://gitlab.com' },
  { id: '10', name: 'Slack', slug: 'slack', description: 'Team communication platform', icon: '💬', websiteUrl: 'https://slack.com' },
  { id: '11', name: 'Notion', slug: 'notion', description: 'All-in-one workspace', icon: '📝', websiteUrl: 'https://notion.so' },
  { id: '12', name: 'Linear', slug: 'linear', description: 'Issue tracking for modern teams', icon: '📐', websiteUrl: 'https://linear.app' },
  { id: '13', name: 'Figma', slug: 'figma', description: 'Collaborative design tool', icon: '🎨', websiteUrl: 'https://figma.com' },
  { id: '14', name: 'Twilio', slug: 'twilio', description: 'Communications APIs', icon: '📱', websiteUrl: 'https://twilio.com' },
  { id: '15', name: 'SendGrid', slug: 'sendgrid', description: 'Email delivery service', icon: '📧', websiteUrl: 'https://sendgrid.com' },
  { id: '16', name: 'Datadog', slug: 'datadog', description: 'Monitoring and observability', icon: '📊', websiteUrl: 'https://datadoghq.com' },
  { id: '17', name: 'Sentry', slug: 'sentry', description: 'Error tracking and monitoring', icon: '🐛', websiteUrl: 'https://sentry.io' },
  { id: '18', name: 'PlanetScale', slug: 'planetscale', description: 'Serverless MySQL platform', icon: '🪐', websiteUrl: 'https://planetscale.com' },
  { id: '19', name: 'Neon', slug: 'neon', description: 'Serverless Postgres', icon: '🟢', websiteUrl: 'https://neon.tech' },
  { id: '20', name: 'Turso', slug: 'turso', description: 'Edge database platform', icon: '🏎️', websiteUrl: 'https://turso.tech' },
  { id: '21', name: 'Upstash', slug: 'upstash', description: 'Serverless Redis and Kafka', icon: '🔴', websiteUrl: 'https://upstash.com' },
  { id: '22', name: 'Railway', slug: 'railway', description: 'Infrastructure platform', icon: '🚂', websiteUrl: 'https://railway.app' },
  { id: '23', name: 'Fly.io', slug: 'fly-io', description: 'Run apps close to users', icon: '✈️', websiteUrl: 'https://fly.io' },
  { id: '24', name: 'Render', slug: 'render', description: 'Cloud application platform', icon: '🎬', websiteUrl: 'https://render.com' },
  { id: '25', name: 'Netlify', slug: 'netlify', description: 'Web development platform', icon: '🌐', websiteUrl: 'https://netlify.com' },
  { id: '26', name: 'DigitalOcean', slug: 'digitalocean', description: 'Cloud infrastructure provider', icon: '🌊', websiteUrl: 'https://digitalocean.com' },
  { id: '27', name: 'MongoDB', slug: 'mongodb', description: 'Document database platform', icon: '🍃', websiteUrl: 'https://mongodb.com' },
  { id: '28', name: 'Redis', slug: 'redis', description: 'In-memory data store', icon: '🔶', websiteUrl: 'https://redis.io' },
  { id: '29', name: 'Elastic', slug: 'elastic', description: 'Search and observability', icon: '🔎', websiteUrl: 'https://elastic.co' },
  { id: '30', name: 'Grafana', slug: 'grafana', description: 'Observability dashboards', icon: '📈', websiteUrl: 'https://grafana.com' },
  { id: '31', name: 'Docker', slug: 'docker', description: 'Container platform', icon: '🐳', websiteUrl: 'https://docker.com' },
  { id: '32', name: 'Kubernetes', slug: 'kubernetes', description: 'Container orchestration', icon: '☸️', websiteUrl: 'https://kubernetes.io' },
  { id: '33', name: 'Terraform', slug: 'terraform', description: 'Infrastructure as code', icon: '🏗️', websiteUrl: 'https://terraform.io' },
  { id: '34', name: 'Pulumi', slug: 'pulumi', description: 'Modern infrastructure as code', icon: '🧱', websiteUrl: 'https://pulumi.com' },
  { id: '35', name: 'OpenAI', slug: 'openai', description: 'AI research and deployment', icon: '🧠', websiteUrl: 'https://openai.com' },
];

export const components: MockComponent[] = [
  // Agents (8)
  { id: 'a1', name: 'Code Review Agent', slug: 'code-review-agent', description: 'Automated code review with detailed feedback and suggestions for improvement', category: 'agents', installCommand: 'code-review-agent', downloads: 45200, isFeatured: true, tags: ['review', 'quality', 'automation'], companyName: 'GitHub' },
  { id: 'a2', name: 'PR Summarizer', slug: 'pr-summarizer', description: 'Generates concise summaries for pull requests with change analysis', category: 'agents', installCommand: 'pr-summarizer', downloads: 32100, isFeatured: false, tags: ['pr', 'summary', 'git'], companyName: 'GitLab' },
  { id: 'a3', name: 'Test Generator', slug: 'test-generator', description: 'Automatically generates unit tests based on your code structure', category: 'agents', installCommand: 'test-generator', downloads: 28900, isFeatured: true, tags: ['testing', 'unit-tests', 'automation'], companyName: 'Google' },
  { id: 'a4', name: 'Bug Hunter', slug: 'bug-hunter', description: 'Intelligent bug detection and root cause analysis agent', category: 'agents', installCommand: 'bug-hunter', downloads: 19800, isFeatured: false, tags: ['bugs', 'debugging', 'analysis'], companyName: 'Sentry' },
  { id: 'a5', name: 'Docs Writer', slug: 'docs-writer', description: 'Auto-generates documentation from code comments and structure', category: 'agents', installCommand: 'docs-writer', downloads: 15600, isFeatured: false, tags: ['docs', 'documentation', 'markdown'], companyName: 'Notion' },
  { id: 'a6', name: 'Migration Agent', slug: 'migration-agent', description: 'Assists with framework and library migration tasks', category: 'agents', installCommand: 'migration-agent', downloads: 12300, isFeatured: false, tags: ['migration', 'upgrade', 'refactor'], companyName: 'Vercel' },
  { id: 'a7', name: 'Security Scanner', slug: 'security-scanner', description: 'Scans code for security vulnerabilities and suggests fixes', category: 'agents', installCommand: 'security-scanner', downloads: 38700, isFeatured: true, tags: ['security', 'scanning', 'vulnerabilities'], companyName: 'Cloudflare' },
  { id: 'a8', name: 'Refactor Agent', slug: 'refactor-agent', description: 'Intelligent code refactoring with best practice suggestions', category: 'agents', installCommand: 'refactor-agent', downloads: 22400, isFeatured: false, tags: ['refactor', 'clean-code', 'patterns'], companyName: 'Microsoft' },

  // Plugins (8)
  { id: 'p1', name: 'Prettier Plugin', slug: 'prettier-plugin', description: 'Auto-format code on save with Prettier integration', category: 'plugins', installCommand: 'prettier-plugin', downloads: 48100, isFeatured: true, tags: ['formatting', 'prettier', 'style'], companyName: 'Vercel' },
  { id: 'p2', name: 'ESLint Plugin', slug: 'eslint-plugin', description: 'Real-time linting with custom Codex rules', category: 'plugins', installCommand: 'eslint-plugin', downloads: 42300, isFeatured: true, tags: ['linting', 'eslint', 'quality'], companyName: 'Google' },
  { id: 'p3', name: 'TypeScript Helper', slug: 'typescript-helper', description: 'Enhanced TypeScript support with type inference assistance', category: 'plugins', installCommand: 'typescript-helper', downloads: 35600, isFeatured: false, tags: ['typescript', 'types', 'inference'], companyName: 'Microsoft' },
  { id: 'p4', name: 'Git Lens', slug: 'git-lens', description: 'Enhanced git blame and history visualization', category: 'plugins', installCommand: 'git-lens', downloads: 29800, isFeatured: false, tags: ['git', 'blame', 'history'], companyName: 'GitHub' },
  { id: 'p5', name: 'Tailwind Assist', slug: 'tailwind-assist', description: 'Intelligent Tailwind CSS class suggestions and sorting', category: 'plugins', installCommand: 'tailwind-assist', downloads: 25400, isFeatured: false, tags: ['tailwind', 'css', 'styling'], companyName: 'Vercel' },
  { id: 'p6', name: 'Docker Compose', slug: 'docker-compose', description: 'Docker Compose file generation and management', category: 'plugins', installCommand: 'docker-compose', downloads: 18200, isFeatured: false, tags: ['docker', 'containers', 'devops'], companyName: 'Docker' },
  { id: 'p7', name: 'API Client', slug: 'api-client', description: 'Built-in API testing and request builder', category: 'plugins', installCommand: 'api-client', downloads: 21700, isFeatured: false, tags: ['api', 'rest', 'testing'], companyName: 'Stripe' },
  { id: 'p8', name: 'Database Explorer', slug: 'database-explorer', description: 'Visual database schema explorer and query builder', category: 'plugins', installCommand: 'database-explorer', downloads: 16900, isFeatured: false, tags: ['database', 'sql', 'schema'], companyName: 'PlanetScale' },

  // Commands (8)
  { id: 'c1', name: 'Quick Deploy', slug: 'quick-deploy', description: 'One-command deployment to any cloud provider', category: 'commands', installCommand: 'quick-deploy', downloads: 39500, isFeatured: true, tags: ['deploy', 'cloud', 'ci-cd'], companyName: 'Vercel' },
  { id: 'c2', name: 'Scaffold', slug: 'scaffold', description: 'Generate project scaffolding from templates', category: 'commands', installCommand: 'scaffold', downloads: 33200, isFeatured: false, tags: ['scaffold', 'boilerplate', 'generator'], companyName: 'Netlify' },
  { id: 'c3', name: 'DB Migrate', slug: 'db-migrate', description: 'Database migration management and execution', category: 'commands', installCommand: 'db-migrate', downloads: 27800, isFeatured: false, tags: ['database', 'migration', 'schema'], companyName: 'Neon' },
  { id: 'c4', name: 'Env Sync', slug: 'env-sync', description: 'Synchronize environment variables across environments', category: 'commands', installCommand: 'env-sync', downloads: 24100, isFeatured: false, tags: ['env', 'secrets', 'sync'], companyName: 'Railway' },
  { id: 'c5', name: 'Bundle Analyze', slug: 'bundle-analyze', description: 'Analyze and visualize JavaScript bundle sizes', category: 'commands', installCommand: 'bundle-analyze', downloads: 19600, isFeatured: false, tags: ['bundle', 'performance', 'webpack'], companyName: 'Vercel' },
  { id: 'c6', name: 'Generate Types', slug: 'generate-types', description: 'Generate TypeScript types from API schemas', category: 'commands', installCommand: 'generate-types', downloads: 31400, isFeatured: true, tags: ['types', 'typescript', 'codegen'], companyName: 'Microsoft' },
  { id: 'c7', name: 'Clean Cache', slug: 'clean-cache', description: 'Clean all project caches and temporary files', category: 'commands', installCommand: 'clean-cache', downloads: 14200, isFeatured: false, tags: ['cache', 'cleanup', 'performance'], companyName: 'Google' },
  { id: 'c8', name: 'Dependency Audit', slug: 'dependency-audit', description: 'Audit and update project dependencies', category: 'commands', installCommand: 'dependency-audit', downloads: 20800, isFeatured: false, tags: ['dependencies', 'audit', 'security'], companyName: 'GitHub' },

  // Settings (7)
  { id: 's1', name: 'Dark Mode Pro', slug: 'dark-mode-pro', description: 'Enhanced dark mode settings with custom color schemes', category: 'settings', installCommand: 'dark-mode-pro', downloads: 26300, isFeatured: false, tags: ['theme', 'dark-mode', 'ui'], companyName: 'Figma' },
  { id: 's2', name: 'Keybindings Pack', slug: 'keybindings-pack', description: 'Vim/Emacs-style keybindings preset', category: 'settings', installCommand: 'keybindings-pack', downloads: 18700, isFeatured: false, tags: ['keybindings', 'vim', 'shortcuts'], companyName: 'Microsoft' },
  { id: 's3', name: 'AI Model Config', slug: 'ai-model-config', description: 'Pre-configured AI model settings for optimal performance', category: 'settings', installCommand: 'ai-model-config', downloads: 34500, isFeatured: true, tags: ['ai', 'model', 'config'], companyName: 'OpenAI' },
  { id: 's4', name: 'Performance Preset', slug: 'performance-preset', description: 'Optimized settings for maximum performance', category: 'settings', installCommand: 'performance-preset', downloads: 15800, isFeatured: false, tags: ['performance', 'optimization', 'speed'], companyName: 'Cloudflare' },
  { id: 's5', name: 'Privacy Shield', slug: 'privacy-shield', description: 'Privacy-focused configuration with data controls', category: 'settings', installCommand: 'privacy-shield', downloads: 12100, isFeatured: false, tags: ['privacy', 'security', 'data'], companyName: 'Cloudflare' },
  { id: 's6', name: 'Team Settings', slug: 'team-settings', description: 'Shared settings profiles for development teams', category: 'settings', installCommand: 'team-settings', downloads: 9800, isFeatured: false, tags: ['team', 'collaboration', 'shared'], companyName: 'Slack' },
  { id: 's7', name: 'Workspace Layout', slug: 'workspace-layout', description: 'Custom workspace layouts and panel arrangements', category: 'settings', installCommand: 'workspace-layout', downloads: 11400, isFeatured: false, tags: ['workspace', 'layout', 'panels'], companyName: 'Linear' },

  // Hooks (8)
  { id: 'h1', name: 'Pre-commit Hook', slug: 'pre-commit-hook', description: 'Run linting and formatting before every commit', category: 'hooks', installCommand: 'pre-commit-hook', downloads: 41200, isFeatured: true, tags: ['git', 'commit', 'lint'], companyName: 'GitHub' },
  { id: 'h2', name: 'Auto-save Hook', slug: 'auto-save-hook', description: 'Intelligent auto-save with conflict detection', category: 'hooks', installCommand: 'auto-save-hook', downloads: 23400, isFeatured: false, tags: ['save', 'auto', 'files'], companyName: 'Google' },
  { id: 'h3', name: 'Build Watcher', slug: 'build-watcher', description: 'Watch for changes and trigger incremental builds', category: 'hooks', installCommand: 'build-watcher', downloads: 19800, isFeatured: false, tags: ['build', 'watch', 'hot-reload'], companyName: 'Vercel' },
  { id: 'h4', name: 'Test Runner Hook', slug: 'test-runner-hook', description: 'Automatically run relevant tests on file save', category: 'hooks', installCommand: 'test-runner-hook', downloads: 28600, isFeatured: true, tags: ['testing', 'auto-run', 'tdd'], companyName: 'Google' },
  { id: 'h5', name: 'Deploy Trigger', slug: 'deploy-trigger', description: 'Trigger deployments on branch push events', category: 'hooks', installCommand: 'deploy-trigger', downloads: 16700, isFeatured: false, tags: ['deploy', 'ci-cd', 'automation'], companyName: 'Railway' },
  { id: 'h6', name: 'Error Reporter', slug: 'error-reporter', description: 'Auto-report errors to monitoring services', category: 'hooks', installCommand: 'error-reporter', downloads: 21300, isFeatured: false, tags: ['errors', 'monitoring', 'reporting'], companyName: 'Sentry' },
  { id: 'h7', name: 'Changelog Gen', slug: 'changelog-gen', description: 'Generate changelogs from commit messages', category: 'hooks', installCommand: 'changelog-gen', downloads: 14500, isFeatured: false, tags: ['changelog', 'git', 'docs'], companyName: 'GitHub' },
  { id: 'h8', name: 'Notification Hook', slug: 'notification-hook', description: 'Send notifications on build and deploy events', category: 'hooks', installCommand: 'notification-hook', downloads: 10200, isFeatured: false, tags: ['notifications', 'alerts', 'slack'], companyName: 'Slack' },

  // Integrations (8)
  { id: 'i1', name: 'GitHub Actions', slug: 'github-actions', description: 'Deep integration with GitHub Actions CI/CD workflows', category: 'integrations', installCommand: 'github-actions', downloads: 47800, isFeatured: true, tags: ['github', 'ci-cd', 'actions'], companyName: 'GitHub' },
  { id: 'i2', name: 'Slack Notify', slug: 'slack-notify', description: 'Send Codex updates and alerts to Slack channels', category: 'integrations', installCommand: 'slack-notify', downloads: 36200, isFeatured: true, tags: ['slack', 'notifications', 'chat'], companyName: 'Slack' },
  { id: 'i3', name: 'Jira Sync', slug: 'jira-sync', description: 'Sync code changes with Jira issues and epics', category: 'integrations', installCommand: 'jira-sync', downloads: 29400, isFeatured: false, tags: ['jira', 'issues', 'tracking'], companyName: 'Linear' },
  { id: 'i4', name: 'Vercel Deploy', slug: 'vercel-deploy', description: 'One-click deployment to Vercel from Codex', category: 'integrations', installCommand: 'vercel-deploy', downloads: 42100, isFeatured: true, tags: ['vercel', 'deploy', 'hosting'], companyName: 'Vercel' },
  { id: 'i5', name: 'AWS Lambda', slug: 'aws-lambda', description: 'Deploy and manage Lambda functions directly', category: 'integrations', installCommand: 'aws-lambda', downloads: 25700, isFeatured: false, tags: ['aws', 'lambda', 'serverless'], companyName: 'AWS' },
  { id: 'i6', name: 'Supabase Auth', slug: 'supabase-auth', description: 'Supabase authentication integration', category: 'integrations', installCommand: 'supabase-auth', downloads: 31800, isFeatured: false, tags: ['supabase', 'auth', 'database'], companyName: 'Supabase' },
  { id: 'i7', name: 'Stripe Payments', slug: 'stripe-payments', description: 'Integrate Stripe payment processing', category: 'integrations', installCommand: 'stripe-payments', downloads: 27900, isFeatured: false, tags: ['stripe', 'payments', 'billing'], companyName: 'Stripe' },
  { id: 'i8', name: 'Datadog Monitor', slug: 'datadog-monitor', description: 'Send metrics and traces to Datadog', category: 'integrations', installCommand: 'datadog-monitor', downloads: 18600, isFeatured: false, tags: ['datadog', 'monitoring', 'apm'], companyName: 'Datadog' },

  // Templates (8)
  { id: 't1', name: 'Next.js Starter', slug: 'nextjs-starter', description: 'Full-stack Next.js starter with auth, database, and styling', category: 'templates', installCommand: 'nextjs-starter', downloads: 49800, isFeatured: true, tags: ['nextjs', 'react', 'fullstack'], companyName: 'Vercel' },
  { id: 't2', name: 'Express API', slug: 'express-api', description: 'Production-ready Express API template with validation', category: 'templates', installCommand: 'express-api', downloads: 37400, isFeatured: true, tags: ['express', 'api', 'nodejs'], companyName: 'Google' },
  { id: 't3', name: 'Python FastAPI', slug: 'python-fastapi', description: 'FastAPI template with SQLAlchemy and Pydantic', category: 'templates', installCommand: 'python-fastapi', downloads: 28900, isFeatured: false, tags: ['python', 'fastapi', 'api'], companyName: 'Google' },
  { id: 't4', name: 'React Native App', slug: 'react-native-app', description: 'Cross-platform mobile app template', category: 'templates', installCommand: 'react-native-app', downloads: 33100, isFeatured: false, tags: ['react-native', 'mobile', 'ios'], companyName: 'Microsoft' },
  { id: 't5', name: 'Turborepo Mono', slug: 'turborepo-mono', description: 'Monorepo template with Turborepo and shared packages', category: 'templates', installCommand: 'turborepo-mono', downloads: 24600, isFeatured: false, tags: ['monorepo', 'turborepo', 'packages'], companyName: 'Vercel' },
  { id: 't6', name: 'Electron Desktop', slug: 'electron-desktop', description: 'Desktop application template with Electron and React', category: 'templates', installCommand: 'electron-desktop', downloads: 17800, isFeatured: false, tags: ['electron', 'desktop', 'react'], companyName: 'Microsoft' },
  { id: 't7', name: 'CLI Tool Kit', slug: 'cli-tool-kit', description: 'Build powerful CLI tools with argument parsing and colors', category: 'templates', installCommand: 'cli-tool-kit', downloads: 14200, isFeatured: false, tags: ['cli', 'terminal', 'tools'], companyName: 'GitHub' },
  { id: 't8', name: 'Chrome Extension', slug: 'chrome-extension', description: 'Chrome extension template with manifest v3', category: 'templates', installCommand: 'chrome-extension', downloads: 21500, isFeatured: false, tags: ['chrome', 'extension', 'browser'], companyName: 'Google' },
];

export const featuredProjects: MockFeaturedProject[] = [
  {
    id: 'fp1',
    name: 'Codex Enterprise',
    slug: 'codex-enterprise',
    tagline: 'AI-powered development for enterprise teams',
    description: 'Codex Enterprise brings the power of AI-assisted development to large organizations with advanced security, compliance, and team management features. Built for teams that need to move fast while maintaining enterprise-grade standards.',
    sponsorName: 'OpenAI',
    problemStatement: 'Enterprise teams struggle with maintaining consistent code quality, security compliance, and development velocity across hundreds of developers. Traditional tools fail to scale with the complexity of modern codebases.',
    features: ['SSO & SAML Authentication', 'Role-based Access Control', 'Audit Logging & Compliance', 'Custom AI Model Fine-tuning', 'Team Analytics Dashboard', 'Priority Support'],
    integrations: ['GitHub Enterprise', 'Azure DevOps', 'Jira', 'Slack', 'Okta', 'Datadog'],
    ctaText: 'Request Demo',
    ctaUrl: '#',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'fp2',
    name: 'Codex for DevOps',
    slug: 'codex-devops',
    tagline: 'Streamline your infrastructure with AI',
    description: 'Codex for DevOps automates infrastructure management, deployment pipelines, and monitoring. From Terraform to Kubernetes, let AI handle the repetitive work while you focus on architecture.',
    sponsorName: 'AWS',
    problemStatement: 'DevOps engineers spend 60% of their time on repetitive tasks: writing Terraform configs, debugging Kubernetes manifests, and managing CI/CD pipelines. This leaves little time for strategic infrastructure improvements.',
    features: ['IaC Generation & Review', 'K8s Manifest Automation', 'CI/CD Pipeline Builder', 'Multi-cloud Support', 'Cost Optimization', 'Incident Response'],
    integrations: ['AWS', 'GCP', 'Azure', 'Terraform', 'Kubernetes', 'Docker'],
    ctaText: 'Get Started',
    ctaUrl: '#',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'fp3',
    name: 'Codex AI Workflows',
    slug: 'codex-ai-workflows',
    tagline: 'Build intelligent automation pipelines',
    description: 'Create sophisticated AI workflows that chain together multiple agents, plugins, and integrations. Design visual workflows that automate complex development tasks from issue triage to deployment.',
    sponsorName: 'Vercel',
    problemStatement: 'Developers need to automate multi-step workflows that span code review, testing, documentation, and deployment. Current CI/CD tools lack AI intelligence to make contextual decisions at each step.',
    features: ['Visual Workflow Builder', 'Agent Chaining', 'Conditional Logic', 'Parallel Execution', 'Workflow Templates', 'Real-time Monitoring'],
    integrations: ['GitHub Actions', 'Vercel', 'Linear', 'Slack', 'Notion', 'Sentry'],
    ctaText: 'Try Free',
    ctaUrl: '#',
    isActive: true,
    sortOrder: 3,
  },
];

export const blogPosts: MockBlogPost[] = [
  {
    id: 'bp1',
    title: 'Getting Started with Codex Templates',
    slug: 'getting-started-with-codex-templates',
    excerpt: 'Learn how to install, configure, and use Codex Templates to supercharge your development workflow.',
    difficulty: 'basic',
    isFeatured: true,
    publishedAt: '2026-02-10',
    content: `# Getting Started with Codex Templates

Welcome to Codex Templates! This guide will walk you through the basics of setting up and using templates in your development workflow.

## Installation

First, make sure you have Node.js 18+ installed, then run:

\`\`\`bash
npm install -g codex-templates
\`\`\`

## Your First Template

Let's install a simple Next.js starter template:

\`\`\`bash
npx codex-templates@latest add nextjs-starter
\`\`\`

This will scaffold a complete Next.js application with TypeScript, Tailwind CSS, and authentication already configured.

## Browsing Templates

You can browse available templates in several ways:

- Visit the marketplace at codextemplates.dev
- Use the CLI: \`codex-templates list --category templates\`
- Search: \`codex-templates search "react native"\`

## Configuration

Create a \`.codexrc\` file in your project root to customize behavior:

\`\`\`json
{
  "defaultCategory": "templates",
  "autoUpdate": true,
  "telemetry": false
}
\`\`\`

## Next Steps

Check out our other guides for more advanced usage, or browse the template marketplace to find tools for your specific needs.`,
  },
  {
    id: 'bp2',
    title: 'Building Custom Agents for Codex',
    slug: 'building-custom-agents',
    excerpt: 'A deep dive into creating your own AI agents that integrate with the Codex ecosystem.',
    difficulty: 'advanced',
    isFeatured: true,
    publishedAt: '2026-02-08',
    content: `# Building Custom Agents for Codex

Agents are the most powerful feature of Codex Templates. They allow you to create autonomous AI-powered tools that can perform complex tasks.

## Agent Architecture

Every Codex agent follows a simple architecture:

\`\`\`typescript
import { defineAgent } from 'codex-templates/agent';

export default defineAgent({
  name: 'my-custom-agent',
  description: 'Performs custom analysis',

  async execute(context) {
    const files = await context.getFiles('**/*.ts');
    const analysis = await context.ai.analyze(files);
    return analysis;
  }
});
\`\`\`

## Context API

The context object gives your agent access to the codebase, AI capabilities, and user configuration. Key methods include:

- \`context.getFiles(glob)\` - Read files matching a pattern
- \`context.ai.analyze(input)\` - Run AI analysis
- \`context.ai.generate(prompt)\` - Generate code or text
- \`context.emit(event, data)\` - Emit lifecycle events

## Testing Agents

Use the built-in test framework:

\`\`\`typescript
import { testAgent } from 'codex-templates/testing';
import myAgent from './my-agent';

describe('My Agent', () => {
  it('should analyze TypeScript files', async () => {
    const result = await testAgent(myAgent, {
      files: { 'index.ts': 'const x = 1;' }
    });
    expect(result.issues).toHaveLength(0);
  });
});
\`\`\`

## Publishing

When you are ready, publish your agent to the marketplace:

\`\`\`bash
codex-templates publish --category agents
\`\`\`

Your agent will be reviewed and made available to the community within 24 hours.`,
  },
  {
    id: 'bp3',
    title: 'Top 10 Codex Plugins for 2026',
    slug: 'top-10-plugins-2026',
    excerpt: 'Our curated list of the most useful Codex plugins that every developer should know about.',
    difficulty: 'basic',
    isFeatured: false,
    publishedAt: '2026-02-05',
    content: `# Top 10 Codex Plugins for 2026

The Codex plugin ecosystem has grown tremendously. Here are our top picks for plugins every developer should try.

## 1. Prettier Plugin
Auto-format your code on save with zero configuration.

\`\`\`bash
npx codex-templates@latest add prettier-plugin
\`\`\`

## 2. ESLint Plugin
Real-time linting with custom Codex-specific rules that catch common AI-assisted coding mistakes.

## 3. TypeScript Helper
Enhanced type inference that works with Codex to provide better suggestions.

## 4. Git Lens
See git blame and history directly in your editor with rich annotations.

## 5. Tailwind Assist
Intelligent class sorting and suggestions for Tailwind CSS.

## 6. Docker Compose
Generate and manage Docker Compose files with AI assistance.

## 7. API Client
Test API endpoints without leaving your editor.

## 8. Database Explorer
Visual schema exploration and query building.

## 9. Code Review Agent
While technically an agent, this plugin-like tool provides real-time code quality feedback.

## 10. Bundle Analyze
Keep your bundles lean with visual size analysis.

Each of these plugins integrates seamlessly with Codex and can be installed with a single command.`,
  },
  {
    id: 'bp4',
    title: 'Setting Up CI/CD with Codex Hooks',
    slug: 'cicd-with-codex-hooks',
    excerpt: 'Learn how to create powerful CI/CD pipelines using Codex hooks and integrations.',
    difficulty: 'intermediate',
    isFeatured: false,
    publishedAt: '2026-02-01',
    content: `# Setting Up CI/CD with Codex Hooks

Hooks are lifecycle events that let you run custom code at specific points in your workflow.

## Available Hook Points

\`\`\`typescript
// .codex/hooks.ts
export default {
  'pre-commit': async (ctx) => {
    await ctx.run('npm run lint');
    await ctx.run('npm run test');
  },
  'post-push': async (ctx) => {
    await ctx.notify('slack', 'New push to ' + ctx.branch);
  },
  'pre-deploy': async (ctx) => {
    const tests = await ctx.run('npm run test:e2e');
    if (!tests.success) throw new Error('E2E tests failed');
  }
};
\`\`\`

## Chaining Hooks

You can chain multiple hooks together for complex workflows:

\`\`\`bash
npx codex-templates@latest add pre-commit-hook test-runner-hook deploy-trigger
\`\`\`

## Integration with GitHub Actions

Codex hooks work seamlessly with GitHub Actions. Add the Codex action to your workflow:

\`\`\`yaml
- name: Run Codex Hooks
  uses: codex-templates/action@v1
  with:
    hook: pre-deploy
    token: \${{ secrets.CODEX_TOKEN }}
\`\`\`

This gives you the best of both worlds: CI/CD automation powered by AI-assisted hooks.`,
  },
  {
    id: 'bp5',
    title: 'Codex Templates Security Best Practices',
    slug: 'security-best-practices',
    excerpt: 'Essential security practices when using AI-powered development tools and templates.',
    difficulty: 'intermediate',
    isFeatured: false,
    publishedAt: '2026-01-28',
    content: `# Security Best Practices for Codex Templates

Security should be a top priority when using AI-assisted development tools.

## Scanning Templates Before Use

Always scan templates before installing them:

\`\`\`bash
codex-templates scan security-scanner
# Output: No vulnerabilities found
\`\`\`

## Environment Variables

Never hardcode secrets. Use the env-sync command to manage them:

\`\`\`bash
npx codex-templates@latest add env-sync
codex-templates env-sync pull --from=production
\`\`\`

## Code Review Automation

Set up the security scanner agent to run on every PR:

\`\`\`typescript
// .codex/security.config.ts
export default {
  scan: ['dependencies', 'code', 'secrets'],
  severity: 'medium',
  autoFix: true
};
\`\`\`

## Dependency Auditing

Regular dependency audits help catch vulnerabilities early:

\`\`\`bash
npx codex-templates@latest add dependency-audit
codex-templates audit --fix
\`\`\`

Following these practices ensures your Codex-powered development workflow remains secure and compliant.`,
  },
  {
    id: 'bp6',
    title: 'Building a Full-Stack App with Codex',
    slug: 'fullstack-app-with-codex',
    excerpt: 'Step-by-step guide to building a complete application using Codex templates and agents.',
    difficulty: 'intermediate',
    isFeatured: true,
    publishedAt: '2026-01-25',
    content: `# Building a Full-Stack App with Codex

Let's build a complete task management application using Codex templates.

## Step 1: Scaffold the Project

\`\`\`bash
npx codex-templates@latest add nextjs-starter supabase-auth stripe-payments
\`\`\`

This gives us a Next.js app with authentication and payment processing.

## Step 2: Set Up the Database

\`\`\`bash
npx codex-templates@latest add db-migrate
codex-templates db init --provider=supabase
\`\`\`

## Step 3: Add Real-time Features

\`\`\`typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Subscribe to task changes
supabase
  .channel('tasks')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
\`\`\`

## Step 4: Deploy

\`\`\`bash
npx codex-templates@latest add vercel-deploy
codex-templates deploy --prod
\`\`\`

Your full-stack app is now live with authentication, real-time updates, and payment processing.`,
  },
  {
    id: 'bp7',
    title: 'Advanced Agent Patterns',
    slug: 'advanced-agent-patterns',
    excerpt: 'Master advanced patterns for building sophisticated multi-step AI agents.',
    difficulty: 'advanced',
    isFeatured: false,
    publishedAt: '2026-01-20',
    content: `# Advanced Agent Patterns

Take your Codex agents to the next level with these advanced patterns.

## Chain of Thought

Break complex tasks into reasoning steps:

\`\`\`typescript
const agent = defineAgent({
  name: 'reasoning-agent',
  async execute(ctx) {
    const step1 = await ctx.ai.analyze(ctx.input);
    const step2 = await ctx.ai.reason(step1.findings);
    const step3 = await ctx.ai.generate(step2.conclusions);
    return step3;
  }
});
\`\`\`

## Multi-Agent Orchestration

Coordinate multiple agents for complex workflows:

\`\`\`typescript
const orchestrator = defineAgent({
  name: 'orchestrator',
  agents: ['code-review-agent', 'test-generator', 'docs-writer'],
  async execute(ctx) {
    const review = await ctx.delegate('code-review-agent', ctx.files);
    const tests = await ctx.delegate('test-generator', review.suggestions);
    const docs = await ctx.delegate('docs-writer', ctx.files);
    return { review, tests, docs };
  }
});
\`\`\`

## Error Recovery

Build resilient agents with retry logic:

\`\`\`typescript
const resilientAgent = defineAgent({
  name: 'resilient-agent',
  retries: 3,
  backoff: 'exponential',
  async execute(ctx) {
    try {
      return await ctx.ai.generate(ctx.prompt);
    } catch (error) {
      ctx.log.warn('Retrying with simpler prompt...');
      return await ctx.ai.generate(ctx.simplifiedPrompt);
    }
  }
});
\`\`\`

These patterns form the foundation of production-grade AI agents in the Codex ecosystem.`,
  },
  {
    id: 'bp8',
    title: 'Migrating from VS Code Extensions to Codex',
    slug: 'migrating-from-vscode',
    excerpt: 'A practical guide for teams transitioning from VS Code extensions to Codex plugins.',
    difficulty: 'basic',
    isFeatured: false,
    publishedAt: '2026-01-15',
    content: `# Migrating from VS Code Extensions to Codex

Many teams are moving from VS Code to Codex. Here is how to bring your favorite extensions along.

## Extension Equivalents

Most popular VS Code extensions have Codex equivalents:

| VS Code Extension | Codex Plugin |
|---|---|
| Prettier | prettier-plugin |
| ESLint | eslint-plugin |
| GitLens | git-lens |
| Tailwind IntelliSense | tailwind-assist |

## Migration Steps

1. Export your VS Code settings:
\`\`\`bash
codex-templates migrate --from=vscode
\`\`\`

2. Install equivalent plugins:
\`\`\`bash
npx codex-templates@latest add prettier-plugin eslint-plugin git-lens
\`\`\`

3. Import keybindings:
\`\`\`bash
npx codex-templates@latest add keybindings-pack
\`\`\`

## What is Different

Codex plugins are AI-native, meaning they can leverage the AI context to provide smarter suggestions. For example, the Codex ESLint plugin can understand your coding patterns and suggest rules accordingly.

## Getting Help

Join our Discord community for migration support and tips from other developers who have made the switch.`,
  },
];

// Trending data generation
export function generateTrendingData(range: 'today' | 'week' | 'month') {
  const points: { date: string; downloads: number }[] = [];
  const now = new Date();
  const days = range === 'today' ? 24 : range === 'week' ? 7 : 30;

  let cumulative = 1000;
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    if (range === 'today') {
      date.setHours(date.getHours() - i);
      points.push({
        date: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        downloads: cumulative += Math.floor(Math.random() * 50 + 10),
      });
    } else {
      date.setDate(date.getDate() - i);
      points.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        downloads: cumulative += Math.floor(Math.random() * 500 + 100),
      });
    }
  }
  return points;
}

export const topCountries = [
  { country: 'United States', code: 'US', downloads: 145200, flag: '🇺🇸' },
  { country: 'Germany', code: 'DE', downloads: 52300, flag: '🇩🇪' },
  { country: 'United Kingdom', code: 'UK', downloads: 48100, flag: '🇬🇧' },
  { country: 'Japan', code: 'JP', downloads: 35600, flag: '🇯🇵' },
  { country: 'Brazil', code: 'BR', downloads: 28900, flag: '🇧🇷' },
];
