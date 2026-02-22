import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Companies
  const companies = [
    { name: 'Google', slug: 'google', description: 'Search, cloud computing, and AI technologies', icon: '🔍', websiteUrl: 'https://google.com' },
    { name: 'Microsoft', slug: 'microsoft', description: 'Software, cloud services, and enterprise solutions', icon: '🪟', websiteUrl: 'https://microsoft.com' },
    { name: 'Stripe', slug: 'stripe', description: 'Payment processing and financial infrastructure', icon: '💳', websiteUrl: 'https://stripe.com' },
    { name: 'Vercel', slug: 'vercel', description: 'Frontend cloud platform for modern web applications', icon: '▲', websiteUrl: 'https://vercel.com' },
    { name: 'Supabase', slug: 'supabase', description: 'Open source Firebase alternative with PostgreSQL', icon: '⚡', websiteUrl: 'https://supabase.com' },
    { name: 'AWS', slug: 'aws', description: 'Comprehensive cloud computing platform', icon: '☁️', websiteUrl: 'https://aws.amazon.com' },
    { name: 'Cloudflare', slug: 'cloudflare', description: 'Content delivery network and DDoS mitigation', icon: '🛡️', websiteUrl: 'https://cloudflare.com' },
    { name: 'GitHub', slug: 'github', description: 'Code hosting and collaboration platform', icon: '🐙', websiteUrl: 'https://github.com' },
    { name: 'GitLab', slug: 'gitlab', description: 'DevOps lifecycle tool and Git repository manager', icon: '🦊', websiteUrl: 'https://gitlab.com' },
    { name: 'Slack', slug: 'slack', description: 'Team communication and collaboration platform', icon: '💬', websiteUrl: 'https://slack.com' },
    { name: 'Notion', slug: 'notion', description: 'All-in-one workspace for notes and collaboration', icon: '📝', websiteUrl: 'https://notion.so' },
    { name: 'Linear', slug: 'linear', description: 'Issue tracking and project management tool', icon: '📊', websiteUrl: 'https://linear.app' },
    { name: 'Figma', slug: 'figma', description: 'Collaborative interface design tool', icon: '🎨', websiteUrl: 'https://figma.com' },
    { name: 'Twilio', slug: 'twilio', description: 'Customer engagement platform with SMS and voice APIs', icon: '📱', websiteUrl: 'https://twilio.com' },
    { name: 'SendGrid', slug: 'sendgrid', description: 'Email delivery and marketing platform', icon: '📧', websiteUrl: 'https://sendgrid.com' },
    { name: 'Datadog', slug: 'datadog', description: 'Monitoring and analytics platform', icon: '📈', websiteUrl: 'https://datadoghq.com' },
    { name: 'Sentry', slug: 'sentry', description: 'Application monitoring and error tracking', icon: '🐛', websiteUrl: 'https://sentry.io' },
    { name: 'PlanetScale', slug: 'planetscale', description: 'MySQL-compatible serverless database platform', icon: '🌍', websiteUrl: 'https://planetscale.com' },
    { name: 'Neon', slug: 'neon', description: 'Serverless Postgres with autoscaling', icon: '🔮', websiteUrl: 'https://neon.tech' },
    { name: 'Turso', slug: 'turso', description: 'SQLite for the edge with global replication', icon: '🚀', websiteUrl: 'https://turso.tech' },
    { name: 'Upstash', slug: 'upstash', description: 'Serverless data platform for Redis and Kafka', icon: '⚙️', websiteUrl: 'https://upstash.com' },
    { name: 'Railway', slug: 'railway', description: 'Infrastructure platform for instant deployments', icon: '🚂', websiteUrl: 'https://railway.app' },
    { name: 'Fly.io', slug: 'fly-io', description: 'Deploy apps globally on edge infrastructure', icon: '🪰', websiteUrl: 'https://fly.io' },
    { name: 'Render', slug: 'render', description: 'Cloud platform for hosting web services', icon: '🎯', websiteUrl: 'https://render.com' },
    { name: 'Netlify', slug: 'netlify', description: 'Platform for modern web projects and Jamstack', icon: '🌐', websiteUrl: 'https://netlify.com' },
    { name: 'DigitalOcean', slug: 'digitalocean', description: 'Cloud infrastructure provider for developers', icon: '🌊', websiteUrl: 'https://digitalocean.com' },
    { name: 'Heroku', slug: 'heroku', description: 'Platform as a service for building and running apps', icon: '💜', websiteUrl: 'https://heroku.com' },
    { name: 'MongoDB', slug: 'mongodb', description: 'NoSQL document database platform', icon: '🍃', websiteUrl: 'https://mongodb.com' },
    { name: 'Redis', slug: 'redis', description: 'In-memory data structure store and cache', icon: '🔴', websiteUrl: 'https://redis.io' },
    { name: 'Elastic', slug: 'elastic', description: 'Search and analytics engine', icon: '🔎', websiteUrl: 'https://elastic.co' },
    { name: 'Grafana', slug: 'grafana', description: 'Observability and monitoring platform', icon: '📉', websiteUrl: 'https://grafana.com' },
    { name: 'Docker', slug: 'docker', description: 'Container platform for application development', icon: '🐳', websiteUrl: 'https://docker.com' },
    { name: 'Kubernetes', slug: 'kubernetes', description: 'Container orchestration platform', icon: '☸️', websiteUrl: 'https://kubernetes.io' },
    { name: 'Terraform', slug: 'terraform', description: 'Infrastructure as code software tool', icon: '🏗️', websiteUrl: 'https://terraform.io' },
    { name: 'Pulumi', slug: 'pulumi', description: 'Modern infrastructure as code platform', icon: '🔧', websiteUrl: 'https://pulumi.com' },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: company,
      create: company,
    });
  }

  console.log('Companies seeded');

  // Seed Components
  const components = [
    // Agents
    { name: 'OpenAI Assistant Agent', slug: 'openai-assistant-agent', description: 'AI agent powered by OpenAI GPT-4 for intelligent automation', category: 'agents', installCommand: 'codex-agent-openai-assistant', downloads: 45230, isFeatured: true, companySlug: 'google', tags: ['ai', 'gpt-4', 'automation', 'nlp'], sourceUrl: 'https://github.com/openai/assistant' },
    { name: 'Code Review Agent', slug: 'code-review-agent', description: 'Automated code review and analysis agent with best practices', category: 'agents', installCommand: 'codex-agent-code-review', downloads: 32150, isFeatured: true, companySlug: 'github', tags: ['code-quality', 'review', 'automation'], sourceUrl: 'https://github.com/github/code-review' },
    { name: 'Security Scanner Agent', slug: 'security-scanner-agent', description: 'Continuous security scanning and vulnerability detection', category: 'agents', installCommand: 'codex-agent-security-scanner', downloads: 28900, isFeatured: false, companySlug: 'sentry', tags: ['security', 'scanning', 'vulnerabilities'], sourceUrl: 'https://github.com/sentry/scanner' },
    { name: 'Database Migration Agent', slug: 'database-migration-agent', description: 'Automated database schema migrations and rollbacks', category: 'agents', installCommand: 'codex-agent-db-migration', downloads: 21400, isFeatured: false, companySlug: 'planetscale', tags: ['database', 'migrations', 'automation'], sourceUrl: 'https://github.com/planetscale/migrate' },
    { name: 'CI/CD Pipeline Agent', slug: 'cicd-pipeline-agent', description: 'Intelligent CI/CD pipeline orchestration and optimization', category: 'agents', installCommand: 'codex-agent-cicd-pipeline', downloads: 19800, isFeatured: false, companySlug: 'gitlab', tags: ['cicd', 'automation', 'deployment'], sourceUrl: 'https://github.com/gitlab/cicd-agent' },
    { name: 'Monitoring Agent', slug: 'monitoring-agent', description: 'Real-time application monitoring and alerting agent', category: 'agents', installCommand: 'codex-agent-monitoring', downloads: 17650, isFeatured: false, companySlug: 'datadog', tags: ['monitoring', 'alerts', 'observability'], sourceUrl: 'https://github.com/datadog/monitor' },
    { name: 'Backup Agent', slug: 'backup-agent', description: 'Automated backup and disaster recovery agent', category: 'agents', installCommand: 'codex-agent-backup', downloads: 14320, isFeatured: false, companySlug: 'aws', tags: ['backup', 'recovery', 'automation'], sourceUrl: 'https://github.com/aws/backup-agent' },
    { name: 'Performance Optimizer Agent', slug: 'performance-optimizer-agent', description: 'Automated performance analysis and optimization suggestions', category: 'agents', installCommand: 'codex-agent-performance-optimizer', downloads: 12890, isFeatured: false, companySlug: 'vercel', tags: ['performance', 'optimization', 'analytics'], sourceUrl: 'https://github.com/vercel/optimizer' },

    // Plugins
    { name: 'Stripe Payment Plugin', slug: 'stripe-payment-plugin', description: 'Seamless Stripe payment integration for your applications', category: 'plugins', installCommand: 'codex-plugin-stripe-payment', downloads: 38900, isFeatured: true, companySlug: 'stripe', tags: ['payments', 'stripe', 'ecommerce'], sourceUrl: 'https://github.com/stripe/plugin' },
    { name: 'Auth0 Authentication Plugin', slug: 'auth0-authentication-plugin', description: 'Complete authentication solution with Auth0 integration', category: 'plugins', installCommand: 'codex-plugin-auth0', downloads: 35670, isFeatured: false, companySlug: 'microsoft', tags: ['authentication', 'auth0', 'security'], sourceUrl: 'https://github.com/auth0/plugin' },
    { name: 'Slack Notifications Plugin', slug: 'slack-notifications-plugin', description: 'Send rich notifications to Slack channels', category: 'plugins', installCommand: 'codex-plugin-slack-notifications', downloads: 29400, isFeatured: false, companySlug: 'slack', tags: ['notifications', 'slack', 'messaging'], sourceUrl: 'https://github.com/slack/notifications' },
    { name: 'S3 Storage Plugin', slug: 's3-storage-plugin', description: 'AWS S3 file storage and management plugin', category: 'plugins', installCommand: 'codex-plugin-s3-storage', downloads: 27100, isFeatured: false, companySlug: 'aws', tags: ['storage', 's3', 'files'], sourceUrl: 'https://github.com/aws/s3-plugin' },
    { name: 'SendGrid Email Plugin', slug: 'sendgrid-email-plugin', description: 'Email sending and templating with SendGrid', category: 'plugins', installCommand: 'codex-plugin-sendgrid-email', downloads: 24500, isFeatured: false, companySlug: 'sendgrid', tags: ['email', 'sendgrid', 'notifications'], sourceUrl: 'https://github.com/sendgrid/plugin' },
    { name: 'Redis Cache Plugin', slug: 'redis-cache-plugin', description: 'High-performance caching with Redis integration', category: 'plugins', installCommand: 'codex-plugin-redis-cache', downloads: 22300, isFeatured: true, companySlug: 'redis', tags: ['cache', 'redis', 'performance'], sourceUrl: 'https://github.com/redis/cache-plugin' },
    { name: 'Twilio SMS Plugin', slug: 'twilio-sms-plugin', description: 'Send SMS messages via Twilio API', category: 'plugins', installCommand: 'codex-plugin-twilio-sms', downloads: 18700, isFeatured: false, companySlug: 'twilio', tags: ['sms', 'twilio', 'messaging'], sourceUrl: 'https://github.com/twilio/sms-plugin' },
    { name: 'GraphQL API Plugin', slug: 'graphql-api-plugin', description: 'Powerful GraphQL API layer for your applications', category: 'plugins', installCommand: 'codex-plugin-graphql-api', downloads: 16900, isFeatured: false, companySlug: 'github', tags: ['graphql', 'api', 'queries'], sourceUrl: 'https://github.com/graphql/plugin' },

    // Commands
    { name: 'Deploy Command', slug: 'deploy-command', description: 'One-command deployment to multiple cloud providers', category: 'commands', installCommand: 'codex-command-deploy', downloads: 41200, isFeatured: true, companySlug: 'vercel', tags: ['deployment', 'cli', 'automation'], sourceUrl: 'https://github.com/vercel/deploy-cmd' },
    { name: 'Database Seed Command', slug: 'database-seed-command', description: 'Seed your database with realistic test data', category: 'commands', installCommand: 'codex-command-db-seed', downloads: 33800, isFeatured: false, companySlug: 'supabase', tags: ['database', 'seeding', 'testing'], sourceUrl: 'https://github.com/supabase/seed-cmd' },
    { name: 'Generate API Command', slug: 'generate-api-command', description: 'Scaffold REST APIs from schema definitions', category: 'commands', installCommand: 'codex-command-generate-api', downloads: 28650, isFeatured: false, companySlug: 'google', tags: ['api', 'generation', 'scaffolding'], sourceUrl: 'https://github.com/google/api-gen' },
    { name: 'Test Runner Command', slug: 'test-runner-command', description: 'Advanced test execution with parallel processing', category: 'commands', installCommand: 'codex-command-test-runner', downloads: 25400, isFeatured: false, companySlug: 'github', tags: ['testing', 'automation', 'ci'], sourceUrl: 'https://github.com/github/test-runner' },
    { name: 'Docker Build Command', slug: 'docker-build-command', description: 'Optimized Docker image building and multi-stage builds', category: 'commands', installCommand: 'codex-command-docker-build', downloads: 22900, isFeatured: false, companySlug: 'docker', tags: ['docker', 'containers', 'build'], sourceUrl: 'https://github.com/docker/build-cmd' },
    { name: 'Migrate Command', slug: 'migrate-command', description: 'Database migration management and version control', category: 'commands', installCommand: 'codex-command-migrate', downloads: 20100, isFeatured: false, companySlug: 'planetscale', tags: ['database', 'migrations', 'versioning'], sourceUrl: 'https://github.com/planetscale/migrate-cmd' },
    { name: 'Lint & Format Command', slug: 'lint-format-command', description: 'Code linting and formatting with auto-fix', category: 'commands', installCommand: 'codex-command-lint-format', downloads: 18500, isFeatured: false, companySlug: 'microsoft', tags: ['linting', 'formatting', 'code-quality'], sourceUrl: 'https://github.com/microsoft/lint-cmd' },
    { name: 'Backup Command', slug: 'backup-command', description: 'Create and restore database and file backups', category: 'commands', installCommand: 'codex-command-backup', downloads: 15800, isFeatured: false, companySlug: 'aws', tags: ['backup', 'restore', 'data'], sourceUrl: 'https://github.com/aws/backup-cmd' },

    // Settings
    { name: 'Environment Manager', slug: 'environment-manager', description: 'Manage environment variables across multiple environments', category: 'settings', installCommand: 'codex-settings-env-manager', downloads: 36700, isFeatured: false, companySlug: 'vercel', tags: ['environment', 'config', 'variables'], sourceUrl: 'https://github.com/vercel/env-manager' },
    { name: 'Database Configurator', slug: 'database-configurator', description: 'Visual database connection and configuration manager', category: 'settings', installCommand: 'codex-settings-db-config', downloads: 31200, isFeatured: false, companySlug: 'supabase', tags: ['database', 'configuration', 'connections'], sourceUrl: 'https://github.com/supabase/db-config' },
    { name: 'API Keys Vault', slug: 'api-keys-vault', description: 'Secure storage and management of API keys and secrets', category: 'settings', installCommand: 'codex-settings-api-vault', downloads: 27850, isFeatured: true, companySlug: 'aws', tags: ['security', 'api-keys', 'secrets'], sourceUrl: 'https://github.com/aws/api-vault' },
    { name: 'Feature Flags Manager', slug: 'feature-flags-manager', description: 'Control feature rollouts with dynamic flags', category: 'settings', installCommand: 'codex-settings-feature-flags', downloads: 24300, isFeatured: false, companySlug: 'cloudflare', tags: ['feature-flags', 'rollouts', 'toggles'], sourceUrl: 'https://github.com/cloudflare/flags' },
    { name: 'Theme Customizer', slug: 'theme-customizer', description: 'Customize application themes and branding', category: 'settings', installCommand: 'codex-settings-theme-customizer', downloads: 21600, isFeatured: false, companySlug: 'figma', tags: ['themes', 'ui', 'customization'], sourceUrl: 'https://github.com/figma/theme-customizer' },
    { name: 'Logging Configuration', slug: 'logging-configuration', description: 'Configure application logging levels and outputs', category: 'settings', installCommand: 'codex-settings-logging-config', downloads: 19400, isFeatured: false, companySlug: 'datadog', tags: ['logging', 'configuration', 'monitoring'], sourceUrl: 'https://github.com/datadog/logging-config' },
    { name: 'Rate Limiter Settings', slug: 'rate-limiter-settings', description: 'Configure API rate limiting and throttling', category: 'settings', installCommand: 'codex-settings-rate-limiter', downloads: 17200, isFeatured: false, companySlug: 'cloudflare', tags: ['rate-limiting', 'throttling', 'api'], sourceUrl: 'https://github.com/cloudflare/rate-limiter' },
    { name: 'CORS Configuration', slug: 'cors-configuration', description: 'Manage Cross-Origin Resource Sharing policies', category: 'settings', installCommand: 'codex-settings-cors-config', downloads: 14900, isFeatured: false, companySlug: 'netlify', tags: ['cors', 'security', 'api'], sourceUrl: 'https://github.com/netlify/cors-config' },

    // Hooks
    { name: 'Pre-Commit Hook', slug: 'pre-commit-hook', description: 'Run linting and tests before every commit', category: 'hooks', installCommand: 'codex-hook-pre-commit', downloads: 39500, isFeatured: false, companySlug: 'github', tags: ['git', 'hooks', 'automation'], sourceUrl: 'https://github.com/github/pre-commit' },
    { name: 'Post-Deploy Hook', slug: 'post-deploy-hook', description: 'Execute tasks after successful deployments', category: 'hooks', installCommand: 'codex-hook-post-deploy', downloads: 34200, isFeatured: false, companySlug: 'vercel', tags: ['deployment', 'hooks', 'automation'], sourceUrl: 'https://github.com/vercel/post-deploy' },
    { name: 'Database Change Hook', slug: 'database-change-hook', description: 'Trigger actions on database schema changes', category: 'hooks', installCommand: 'codex-hook-db-change', downloads: 28700, isFeatured: false, companySlug: 'supabase', tags: ['database', 'hooks', 'events'], sourceUrl: 'https://github.com/supabase/db-hook' },
    { name: 'Authentication Hook', slug: 'authentication-hook', description: 'Custom logic for user authentication events', category: 'hooks', installCommand: 'codex-hook-authentication', downloads: 26100, isFeatured: false, companySlug: 'microsoft', tags: ['authentication', 'hooks', 'security'], sourceUrl: 'https://github.com/microsoft/auth-hook' },
    { name: 'API Request Hook', slug: 'api-request-hook', description: 'Intercept and modify API requests and responses', category: 'hooks', installCommand: 'codex-hook-api-request', downloads: 23800, isFeatured: true, companySlug: 'cloudflare', tags: ['api', 'hooks', 'middleware'], sourceUrl: 'https://github.com/cloudflare/api-hook' },
    { name: 'File Upload Hook', slug: 'file-upload-hook', description: 'Process files before and after upload', category: 'hooks', installCommand: 'codex-hook-file-upload', downloads: 21300, isFeatured: false, companySlug: 'aws', tags: ['files', 'hooks', 'upload'], sourceUrl: 'https://github.com/aws/upload-hook' },
    { name: 'Error Handler Hook', slug: 'error-handler-hook', description: 'Global error handling and reporting', category: 'hooks', installCommand: 'codex-hook-error-handler', downloads: 19700, isFeatured: false, companySlug: 'sentry', tags: ['errors', 'hooks', 'monitoring'], sourceUrl: 'https://github.com/sentry/error-hook' },
    { name: 'Cache Invalidation Hook', slug: 'cache-invalidation-hook', description: 'Automatically invalidate cache on data changes', category: 'hooks', installCommand: 'codex-hook-cache-invalidation', downloads: 16500, isFeatured: false, companySlug: 'redis', tags: ['cache', 'hooks', 'invalidation'], sourceUrl: 'https://github.com/redis/cache-hook' },

    // Integrations
    { name: 'GitHub Integration', slug: 'github-integration', description: 'Connect with GitHub repositories, issues, and pull requests', category: 'integrations', installCommand: 'codex-integration-github', downloads: 47800, isFeatured: true, companySlug: 'github', tags: ['github', 'git', 'version-control'], sourceUrl: 'https://github.com/github/integration' },
    { name: 'Slack Integration', slug: 'slack-integration', description: 'Full Slack workspace integration with bot support', category: 'integrations', installCommand: 'codex-integration-slack', downloads: 42300, isFeatured: true, companySlug: 'slack', tags: ['slack', 'messaging', 'collaboration'], sourceUrl: 'https://github.com/slack/integration' },
    { name: 'Notion Integration', slug: 'notion-integration', description: 'Sync data with Notion databases and pages', category: 'integrations', installCommand: 'codex-integration-notion', downloads: 37600, isFeatured: false, companySlug: 'notion', tags: ['notion', 'documentation', 'collaboration'], sourceUrl: 'https://github.com/notion/integration' },
    { name: 'Linear Integration', slug: 'linear-integration', description: 'Issue tracking and project management with Linear', category: 'integrations', installCommand: 'codex-integration-linear', downloads: 32900, isFeatured: false, companySlug: 'linear', tags: ['linear', 'project-management', 'issues'], sourceUrl: 'https://github.com/linear/integration' },
    { name: 'Vercel Integration', slug: 'vercel-integration', description: 'Deploy and manage Vercel projects', category: 'integrations', installCommand: 'codex-integration-vercel', downloads: 29800, isFeatured: false, companySlug: 'vercel', tags: ['vercel', 'deployment', 'hosting'], sourceUrl: 'https://github.com/vercel/integration' },
    { name: 'Stripe Integration', slug: 'stripe-integration', description: 'Complete Stripe payments and subscription management', category: 'integrations', installCommand: 'codex-integration-stripe', downloads: 28200, isFeatured: false, companySlug: 'stripe', tags: ['stripe', 'payments', 'billing'], sourceUrl: 'https://github.com/stripe/integration' },
    { name: 'Supabase Integration', slug: 'supabase-integration', description: 'Connect to Supabase database and authentication', category: 'integrations', installCommand: 'codex-integration-supabase', downloads: 25600, isFeatured: false, companySlug: 'supabase', tags: ['supabase', 'database', 'auth'], sourceUrl: 'https://github.com/supabase/integration' },
    { name: 'Datadog Integration', slug: 'datadog-integration', description: 'Application monitoring and metrics with Datadog', category: 'integrations', installCommand: 'codex-integration-datadog', downloads: 23100, isFeatured: false, companySlug: 'datadog', tags: ['datadog', 'monitoring', 'metrics'], sourceUrl: 'https://github.com/datadog/integration' },

    // Templates
    { name: 'Next.js SaaS Template', slug: 'nextjs-saas-template', description: 'Complete SaaS starter with authentication and payments', category: 'templates', installCommand: 'codex-template-nextjs-saas', downloads: 49600, isFeatured: true, companySlug: 'vercel', tags: ['nextjs', 'saas', 'template', 'starter'], sourceUrl: 'https://github.com/vercel/saas-template' },
    { name: 'GraphQL API Template', slug: 'graphql-api-template', description: 'Production-ready GraphQL API with authentication', category: 'templates', installCommand: 'codex-template-graphql-api', downloads: 41200, isFeatured: false, companySlug: 'github', tags: ['graphql', 'api', 'template'], sourceUrl: 'https://github.com/github/graphql-template' },
    { name: 'E-commerce Template', slug: 'ecommerce-template', description: 'Full-featured e-commerce store with Stripe integration', category: 'templates', installCommand: 'codex-template-ecommerce', downloads: 38900, isFeatured: true, companySlug: 'stripe', tags: ['ecommerce', 'template', 'stripe'], sourceUrl: 'https://github.com/stripe/ecommerce-template' },
    { name: 'Dashboard Template', slug: 'dashboard-template', description: 'Admin dashboard with charts and data visualization', category: 'templates', installCommand: 'codex-template-dashboard', downloads: 35700, isFeatured: false, companySlug: 'grafana', tags: ['dashboard', 'admin', 'template'], sourceUrl: 'https://github.com/grafana/dashboard-template' },
    { name: 'Mobile App Template', slug: 'mobile-app-template', description: 'React Native cross-platform mobile app starter', category: 'templates', installCommand: 'codex-template-mobile-app', downloads: 32400, isFeatured: false, companySlug: 'microsoft', tags: ['mobile', 'react-native', 'template'], sourceUrl: 'https://github.com/microsoft/mobile-template' },
    { name: 'Microservices Template', slug: 'microservices-template', description: 'Kubernetes-ready microservices architecture', category: 'templates', installCommand: 'codex-template-microservices', downloads: 28800, isFeatured: false, companySlug: 'kubernetes', tags: ['microservices', 'kubernetes', 'template'], sourceUrl: 'https://github.com/kubernetes/microservices-template' },
    { name: 'Landing Page Template', slug: 'landing-page-template', description: 'High-converting landing page with SEO optimization', category: 'templates', installCommand: 'codex-template-landing-page', downloads: 26500, isFeatured: false, companySlug: 'netlify', tags: ['landing-page', 'marketing', 'template'], sourceUrl: 'https://github.com/netlify/landing-template' },
    { name: 'Blog Template', slug: 'blog-template', description: 'Modern blog with markdown support and CMS integration', category: 'templates', installCommand: 'codex-template-blog', downloads: 24100, isFeatured: false, companySlug: 'notion', tags: ['blog', 'cms', 'template'], sourceUrl: 'https://github.com/notion/blog-template' },
    { name: 'API Documentation Template', slug: 'api-docs-template', description: 'Interactive API documentation with code examples', category: 'templates', installCommand: 'codex-template-api-docs', downloads: 21900, isFeatured: false, companySlug: 'github', tags: ['documentation', 'api', 'template'], sourceUrl: 'https://github.com/github/docs-template' },
  ];

  const createdComponents = [];
  for (const component of components) {
    const { companySlug, ...componentData } = component;
    const company = await prisma.company.findUnique({ where: { slug: companySlug } });

    const createdComponent = await prisma.component.upsert({
      where: { slug: component.slug },
      update: { ...componentData, companyId: company!.id },
      create: { ...componentData, companyId: company!.id },
    });
    createdComponents.push(createdComponent);
  }

  console.log('Components seeded');

  // Seed Featured Projects
  const featuredProjects = [
    {
      name: 'Codex Enterprise',
      slug: 'codex-enterprise',
      tagline: 'Enterprise-grade development platform for Fortune 500 companies',
      description: 'Codex Enterprise provides a comprehensive suite of tools and integrations designed specifically for large-scale organizations. With advanced security features, compliance tools, and dedicated support, it empowers teams to build faster while maintaining the highest standards of security and reliability.',
      logoUrl: 'https://cdn.codex.dev/logos/enterprise.png',
      websiteUrl: 'https://codex.dev/enterprise',
      sponsorName: 'Microsoft',
      problemStatement: 'Large enterprises struggle with fragmented development tools, inconsistent security policies, and difficulty maintaining compliance across distributed teams. Development velocity suffers while security and compliance overhead increases exponentially.',
      features: JSON.stringify([
        { title: 'Advanced Security', description: 'SOC 2 Type II compliance, SSO integration, and enterprise-grade encryption' },
        { title: 'Audit Logging', description: 'Comprehensive audit trails for all actions and changes across your organization' },
        { title: 'Custom Integrations', description: 'Connect with your existing enterprise tools and workflows seamlessly' },
        { title: 'Priority Support', description: '24/7 dedicated support with guaranteed response times and dedicated Slack channel' },
      ]),
      integrations: JSON.stringify([
        { name: 'Okta', icon: '🔐', description: 'Single Sign-On and identity management' },
        { name: 'Active Directory', icon: '🏢', description: 'Enterprise directory integration' },
        { name: 'Jira', icon: '📊', description: 'Issue tracking and project management' },
        { name: 'ServiceNow', icon: '🎫', description: 'IT service management integration' },
      ]),
      ctaText: 'Contact Sales',
      ctaUrl: 'https://codex.dev/enterprise/contact',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Codex for DevOps',
      slug: 'codex-devops',
      tagline: 'Streamline your entire DevOps pipeline with intelligent automation',
      description: 'Codex for DevOps brings AI-powered automation to every stage of your deployment pipeline. From code review to production monitoring, our integrated suite of tools helps DevOps teams ship faster with confidence. Reduce deployment time by 60% while improving reliability and security.',
      logoUrl: 'https://cdn.codex.dev/logos/devops.png',
      websiteUrl: 'https://codex.dev/devops',
      sponsorName: 'GitLab',
      problemStatement: 'DevOps teams spend countless hours on repetitive tasks, managing complex pipelines, and firefighting production issues. Manual processes lead to errors, slow deployments, and burnout. Teams need intelligent automation that learns from their workflows.',
      features: JSON.stringify([
        { title: 'Intelligent CI/CD', description: 'AI-powered pipeline optimization that learns from your deployment patterns' },
        { title: 'Automated Rollbacks', description: 'Detect issues and automatically rollback to the last stable version' },
        { title: 'Infrastructure as Code', description: 'Manage all infrastructure with version-controlled code and automated provisioning' },
        { title: 'Observability Suite', description: 'Unified monitoring, logging, and tracing across your entire infrastructure' },
      ]),
      integrations: JSON.stringify([
        { name: 'Kubernetes', icon: '☸️', description: 'Container orchestration and deployment' },
        { name: 'Terraform', icon: '🏗️', description: 'Infrastructure provisioning and management' },
        { name: 'Datadog', icon: '📈', description: 'Application performance monitoring' },
        { name: 'PagerDuty', icon: '🚨', description: 'Incident management and alerting' },
      ]),
      ctaText: 'Start Free Trial',
      ctaUrl: 'https://codex.dev/devops/trial',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Codex AI Workflows',
      slug: 'codex-ai-workflows',
      tagline: 'Build powerful AI-driven automation workflows without code',
      description: 'Codex AI Workflows empowers teams to create sophisticated automation using natural language and visual tools. No coding required. Connect AI models, APIs, databases, and third-party services to automate complex business processes. From customer support to data analysis, build workflows that scale.',
      logoUrl: 'https://cdn.codex.dev/logos/ai-workflows.png',
      websiteUrl: 'https://codex.dev/ai-workflows',
      sponsorName: 'Google',
      problemStatement: 'Building AI-powered automation requires specialized ML expertise and engineering resources most teams lack. Business users have the domain knowledge but depend on engineering for every workflow change. This creates bottlenecks and limits innovation.',
      features: JSON.stringify([
        { title: 'Visual Workflow Builder', description: 'Drag-and-drop interface to create complex AI workflows in minutes' },
        { title: 'Pre-trained Models', description: 'Access to GPT-4, Claude, and other leading AI models out of the box' },
        { title: 'Custom Training', description: 'Fine-tune models on your own data for domain-specific tasks' },
        { title: 'Real-time Analytics', description: 'Monitor workflow performance, costs, and outputs with detailed dashboards' },
      ]),
      integrations: JSON.stringify([
        { name: 'OpenAI', icon: '🤖', description: 'GPT-4 and DALL-E integration' },
        { name: 'Anthropic', icon: '🧠', description: 'Claude AI models and APIs' },
        { name: 'Zapier', icon: '⚡', description: 'Connect to 5000+ apps and services' },
        { name: 'HuggingFace', icon: '🤗', description: 'Access to open source AI models' },
      ]),
      ctaText: 'Build Your First Workflow',
      ctaUrl: 'https://codex.dev/ai-workflows/start',
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const project of featuredProjects) {
    await prisma.featuredProject.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log('Featured projects seeded');

  // Seed Blog Posts
  const blogPosts = [
    {
      title: 'Getting Started with Codex: A Complete Beginner\'s Guide',
      slug: 'getting-started-with-codex',
      excerpt: 'Learn how to set up Codex and build your first automation in under 10 minutes. Perfect for developers new to the platform.',
      difficulty: 'basic',
      isFeatured: true,
      content: `# Getting Started with Codex: A Complete Beginner's Guide

Welcome to Codex! Whether you're building your first automation or migrating from another platform, this guide will help you get up and running quickly.

## What is Codex?

Codex is a modern development platform that brings together AI-powered agents, plugins, and integrations to streamline your development workflow. Think of it as your development command center where everything just works together.

## Installation

Getting started is simple. Install the Codex CLI with a single command:

\`\`\`bash
npm install -g @codex/cli
# or
yarn global add @codex/cli
\`\`\`

Verify the installation:

\`\`\`bash
codex --version
\`\`\`

## Your First Project

Initialize a new Codex project in your current directory:

\`\`\`bash
codex init my-first-project
cd my-first-project
\`\`\`

This creates a basic project structure with sensible defaults. The wizard will ask you a few questions about your project setup.

## Installing Your First Component

Let's install a component from the marketplace. We'll use the Deploy Command as an example:

\`\`\`bash
codex install codex-command-deploy
\`\`\`

That's it! The component is now available in your project. You can verify it by running:

\`\`\`bash
codex list
\`\`\`

## Running Your First Automation

Create a simple automation that deploys your application:

\`\`\`typescript
// codex.config.ts
import { defineConfig } from '@codex/core';

export default defineConfig({
  commands: {
    deploy: {
      provider: 'vercel',
      environment: 'production',
      notifications: true
    }
  }
});
\`\`\`

Run the deployment:

\`\`\`bash
codex deploy
\`\`\`

## Next Steps

Now that you have the basics down, explore these resources:

- Browse the **Marketplace** to discover more components
- Read the **API Documentation** to build custom integrations
- Join our **Discord Community** to connect with other developers

Happy coding!`,
    },
    {
      title: 'Building Secure APIs with Codex: Best Practices',
      slug: 'building-secure-apis-best-practices',
      excerpt: 'Comprehensive guide to implementing authentication, rate limiting, and security headers in your Codex-powered APIs.',
      difficulty: 'intermediate',
      isFeatured: true,
      content: `# Building Secure APIs with Codex: Best Practices

Security should never be an afterthought. In this guide, we'll explore how to build production-ready, secure APIs using Codex's built-in security features.

## Authentication & Authorization

Start with proper authentication. Codex makes it easy to integrate industry-standard auth providers:

\`\`\`typescript
// Install the Auth0 plugin
codex install codex-plugin-auth0

// Configure authentication
import { defineAuth } from '@codex/auth';

export const auth = defineAuth({
  provider: 'auth0',
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  audience: process.env.AUTH0_AUDIENCE,
  scopes: ['read:users', 'write:users']
});
\`\`\`

## Rate Limiting

Protect your API from abuse with rate limiting:

\`\`\`typescript
import { rateLimit } from '@codex/middleware';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
\`\`\`

Apply it to your routes:

\`\`\`typescript
app.get('/api/users', limiter, async (req, res) => {
  // Your route logic
});
\`\`\`

## Input Validation

Never trust user input. Use schema validation:

\`\`\`typescript
import { z } from 'zod';
import { validate } from '@codex/validation';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50)
});

app.post('/api/users', validate(userSchema), async (req, res) => {
  // req.body is now type-safe and validated
});
\`\`\`

## Security Headers

Add essential security headers to all responses:

\`\`\`typescript
import { securityHeaders } from '@codex/middleware';

app.use(securityHeaders({
  contentSecurityPolicy: true,
  hsts: true,
  noSniff: true,
  xssProtection: true
}));
\`\`\`

## API Key Management

Store API keys securely using the API Keys Vault:

\`\`\`bash
codex install codex-settings-api-vault
\`\`\`

Access keys in your code:

\`\`\`typescript
import { getSecret } from '@codex/vault';

const stripeKey = await getSecret('STRIPE_SECRET_KEY');
\`\`\`

Keys are encrypted at rest and never logged.

## Monitoring & Alerts

Set up monitoring to detect suspicious activity:

\`\`\`typescript
import { monitor } from '@codex/monitoring';

monitor.alert({
  name: 'high-failed-auth',
  condition: 'failed_auth_attempts > 10',
  window: '5m',
  action: 'notify-slack'
});
\`\`\`

## Conclusion

Security is a journey, not a destination. Regularly review your security posture, keep dependencies updated, and stay informed about new threats. Codex provides the tools—use them wisely.`,
    },
    {
      title: 'Optimizing Database Queries for High-Traffic Applications',
      slug: 'optimizing-database-queries',
      excerpt: 'Learn advanced techniques for database optimization, indexing strategies, and query performance tuning.',
      difficulty: 'advanced',
      isFeatured: false,
      content: `# Optimizing Database Queries for High-Traffic Applications

As your application scales, database performance becomes critical. Let's explore advanced optimization techniques using Codex and modern database tools.

## Understanding Query Performance

Before optimizing, measure. Use Codex's built-in query analyzer:

\`\`\`typescript
import { queryAnalyzer } from '@codex/database';

const results = await queryAnalyzer.analyze(\`
  SELECT users.*, posts.title
  FROM users
  LEFT JOIN posts ON users.id = posts.user_id
  WHERE users.status = 'active'
\`);

console.log(results.explain);
\`\`\`

## Strategic Indexing

Indexes are powerful but not free. Create indexes on:
- Foreign keys
- Columns in WHERE clauses
- Columns in ORDER BY clauses
- Frequently joined columns

\`\`\`sql
-- Create composite index
CREATE INDEX idx_user_status_created
ON users(status, created_at DESC);

-- Partial index for active users only
CREATE INDEX idx_active_users
ON users(email)
WHERE status = 'active';
\`\`\`

## Query Optimization Patterns

### N+1 Query Problem

Bad approach:

\`\`\`typescript
const users = await db.user.findMany();
for (const user of users) {
  user.posts = await db.post.findMany({
    where: { userId: user.id }
  });
}
\`\`\`

Optimized with eager loading:

\`\`\`typescript
const users = await db.user.findMany({
  include: { posts: true }
});
\`\`\`

## Connection Pooling

Configure connection pools for optimal performance:

\`\`\`typescript
import { createPool } from '@codex/database';

const pool = createPool({
  min: 10,
  max: 100,
  acquireTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
\`\`\`

## Caching Strategies

Implement multi-layer caching:

\`\`\`typescript
import { cache } from '@codex/cache';

async function getUser(id: string) {
  // L1: In-memory cache
  const cached = cache.memory.get(\`user:\${id}\`);
  if (cached) return cached;

  // L2: Redis cache
  const redisCached = await cache.redis.get(\`user:\${id}\`);
  if (redisCached) {
    cache.memory.set(\`user:\${id}\`, redisCached);
    return redisCached;
  }

  // L3: Database
  const user = await db.user.findUnique({ where: { id } });

  await cache.redis.set(\`user:\${id}\`, user, { ttl: 3600 });
  cache.memory.set(\`user:\${id}\`, user);

  return user;
}
\`\`\`

## Read Replicas

Scale reads with replicas:

\`\`\`typescript
import { db } from '@codex/database';

// Write to primary
await db.primary.user.create({ data: newUser });

// Read from replica
const users = await db.replica.user.findMany();
\`\`\`

## Monitoring

Set up continuous monitoring:

\`\`\`typescript
codex install codex-integration-datadog

import { monitor } from '@codex/monitoring';

monitor.query({
  slowQueryThreshold: 1000, // ms
  onSlowQuery: async (query) => {
    console.warn('Slow query detected:', query);
    // Send to your monitoring service
  }
});
\`\`\`

## Conclusion

Database optimization is iterative. Measure, optimize, and repeat. Use Codex's built-in tools to identify bottlenecks and track improvements over time.`,
    },
    {
      title: 'Microservices Architecture with Codex: A Practical Guide',
      slug: 'microservices-architecture-guide',
      excerpt: 'Design and implement scalable microservices using Codex templates and integrations.',
      difficulty: 'advanced',
      isFeatured: true,
      content: `# Microservices Architecture with Codex: A Practical Guide

Microservices offer scalability and flexibility, but they come with complexity. Codex simplifies microservices architecture with purpose-built tools and templates.

## Service Design Principles

Follow these principles when designing services:

1. **Single Responsibility**: Each service owns one business capability
2. **Loose Coupling**: Services communicate via well-defined APIs
3. **High Cohesion**: Related functionality stays together
4. **Autonomous**: Services can be deployed independently

## Getting Started

Use the microservices template:

\`\`\`bash
codex install codex-template-microservices
codex create service user-service
codex create service order-service
codex create service payment-service
\`\`\`

This scaffolds a complete service with:
- REST/GraphQL API
- Database migrations
- Docker configuration
- Kubernetes manifests
- CI/CD pipeline

## Service Communication

### Synchronous (REST/GraphQL)

\`\`\`typescript
// user-service/src/api.ts
import { createApi } from '@codex/api';

export const api = createApi({
  routes: {
    'GET /users/:id': async (req) => {
      return await db.user.findUnique({
        where: { id: req.params.id }
      });
    }
  }
});
\`\`\`

Call from another service:

\`\`\`typescript
// order-service/src/clients/user.ts
import { createClient } from '@codex/client';

const userService = createClient({
  baseUrl: process.env.USER_SERVICE_URL,
  timeout: 5000,
  retry: { attempts: 3, delay: 1000 }
});

const user = await userService.get(\`/users/\${userId}\`);
\`\`\`

### Asynchronous (Events)

\`\`\`typescript
// payment-service/src/events.ts
import { EventBus } from '@codex/events';

const events = new EventBus({
  provider: 'kafka',
  brokers: process.env.KAFKA_BROKERS.split(',')
});

// Publish event
await events.publish('payment.completed', {
  orderId: '123',
  amount: 99.99,
  currency: 'USD'
});

// Subscribe to events
events.subscribe('order.created', async (event) => {
  console.log('New order:', event.data);
  // Process payment
});
\`\`\`

## Service Discovery

Configure service discovery with Kubernetes:

\`\`\`yaml
# k8s/user-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
\`\`\`

Services can now discover each other by DNS name:

\`\`\`typescript
const userServiceUrl = 'http://user-service';
\`\`\`

## API Gateway

Set up an API gateway as the single entry point:

\`\`\`typescript
// gateway/src/index.ts
import { createGateway } from '@codex/gateway';

const gateway = createGateway({
  routes: {
    '/api/users/*': {
      target: 'http://user-service',
      auth: true
    },
    '/api/orders/*': {
      target: 'http://order-service',
      auth: true,
      rateLimit: { max: 100, window: '1m' }
    },
    '/api/payments/*': {
      target: 'http://payment-service',
      auth: true,
      rateLimit: { max: 50, window: '1m' }
    }
  }
});
\`\`\`

## Distributed Tracing

Track requests across services:

\`\`\`typescript
import { tracing } from '@codex/tracing';

tracing.init({
  serviceName: 'user-service',
  endpoint: process.env.JAEGER_ENDPOINT
});

// Automatic instrumentation for HTTP, gRPC, and DB calls
\`\`\`

## Deployment

Deploy all services with one command:

\`\`\`bash
codex deploy --environment production
\`\`\`

This:
1. Builds Docker images
2. Pushes to container registry
3. Updates Kubernetes manifests
4. Performs rolling updates
5. Runs health checks

## Monitoring

Set up comprehensive monitoring:

\`\`\`typescript
codex install codex-integration-datadog

import { monitor } from '@codex/monitoring';

monitor.service({
  metrics: ['requests', 'latency', 'errors'],
  alerts: {
    highErrorRate: {
      condition: 'error_rate > 5%',
      action: 'page-oncall'
    }
  }
});
\`\`\`

## Conclusion

Microservices are powerful but complex. Codex provides the guardrails and automation to make them manageable. Start small, iterate, and scale gradually.`,
    },
    {
      title: 'Building Real-time Applications with WebSockets',
      slug: 'building-realtime-applications-websockets',
      excerpt: 'Create scalable real-time features using WebSockets, Server-Sent Events, and Codex integrations.',
      difficulty: 'intermediate',
      isFeatured: false,
      content: `# Building Real-time Applications with WebSockets

Real-time features are no longer a nice-to-have—they're expected. Learn how to build scalable real-time applications with Codex.

## When to Use Real-time

Consider real-time communication for:
- Chat and messaging
- Live notifications
- Collaborative editing
- Real-time dashboards
- Gaming and live updates

## Setting Up WebSockets

Install the WebSocket plugin:

\`\`\`bash
codex install codex-plugin-websockets
\`\`\`

Create a WebSocket server:

\`\`\`typescript
import { createWebSocketServer } from '@codex/websockets';

const wss = createWebSocketServer({
  port: 3001,
  path: '/ws',
  cors: {
    origin: process.env.CLIENT_URL
  }
});

wss.on('connection', (socket, req) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Received:', data);
    // Broadcast to all clients
    wss.broadcast(data);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});
\`\`\`

## Client Implementation

Connect from your frontend:

\`\`\`typescript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.onopen = () => {
  console.log('Connected to server');
  ws.send(JSON.stringify({ type: 'ping' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from server');
  // Implement reconnection logic
};
\`\`\`

## Room-based Communication

Organize connections into rooms:

\`\`\`typescript
import { RoomManager } from '@codex/websockets';

const rooms = new RoomManager();

wss.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId }) => {
    rooms.join(roomId, socket, { userId });

    // Notify others in the room
    rooms.broadcast(roomId, {
      type: 'user-joined',
      userId
    }, socket);
  });

  socket.on('message', ({ roomId, message }) => {
    rooms.broadcast(roomId, {
      type: 'message',
      message
    });
  });
});
\`\`\`

## Scaling WebSockets

Use Redis for horizontal scaling:

\`\`\`typescript
import { createAdapter } from '@codex/websockets-redis';

const adapter = createAdapter({
  host: process.env.REDIS_HOST,
  port: 6379
});

wss.adapter(adapter);

// Messages now sync across all server instances
\`\`\`

## Authentication

Secure WebSocket connections:

\`\`\`typescript
import { verifyToken } from '@codex/auth';

wss.on('connection', async (socket, req) => {
  const token = req.url.split('token=')[1];

  try {
    const user = await verifyToken(token);
    socket.userId = user.id;
  } catch (error) {
    socket.close(4001, 'Unauthorized');
    return;
  }

  // Connection is authenticated
});
\`\`\`

## Monitoring

Track WebSocket metrics:

\`\`\`typescript
import { monitor } from '@codex/monitoring';

monitor.websockets({
  metrics: ['connections', 'messages', 'latency'],
  interval: 60000 // 1 minute
});
\`\`\`

## Best Practices

1. **Heartbeat**: Send periodic pings to detect dead connections
2. **Reconnection**: Implement exponential backoff
3. **Message Queue**: Buffer messages during disconnections
4. **Compression**: Enable compression for large payloads
5. **Error Handling**: Gracefully handle connection errors

## Conclusion

WebSockets enable powerful real-time features. With Codex, you get production-ready WebSocket support with built-in scaling, monitoring, and security.`,
    },
    {
      title: 'Implementing CI/CD Pipelines with Codex',
      slug: 'implementing-cicd-pipelines',
      excerpt: 'Automate your deployment workflow with GitHub Actions, GitLab CI, and Codex integrations.',
      difficulty: 'intermediate',
      isFeatured: false,
      content: `# Implementing CI/CD Pipelines with Codex

Continuous Integration and Deployment shouldn't be painful. Learn how to build robust CI/CD pipelines with Codex.

## Pipeline Overview

A typical pipeline includes:
1. Code checkout
2. Dependency installation
3. Linting and formatting
4. Unit tests
5. Integration tests
6. Build
7. Deploy to staging
8. Run smoke tests
9. Deploy to production

## GitHub Actions Setup

Create \`.github/workflows/deploy.yml\`:

\`\`\`yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy with Codex
        run: npx codex deploy --environment production
        env:
          CODEX_TOKEN: \${{ secrets.CODEX_TOKEN }}
\`\`\`

## Codex CI/CD Agent

Use the Codex CI/CD agent for intelligent deployments:

\`\`\`bash
codex install codex-agent-cicd-pipeline
\`\`\`

Configure in \`codex.config.ts\`:

\`\`\`typescript
export default {
  cicd: {
    stages: {
      test: {
        commands: ['npm test', 'npm run test:e2e'],
        parallel: true
      },
      build: {
        commands: ['npm run build'],
        artifacts: ['dist/**']
      },
      deploy: {
        provider: 'vercel',
        environment: process.env.DEPLOY_ENV,
        onSuccess: {
          notify: ['slack', 'email']
        },
        onFailure: {
          rollback: true,
          notify: ['slack', 'pagerduty']
        }
      }
    }
  }
};
\`\`\`

## Environment Management

Manage environments securely:

\`\`\`typescript
import { env } from '@codex/env';

// Load environment-specific config
const config = env.load({
  environment: process.env.NODE_ENV,
  required: ['DATABASE_URL', 'API_KEY'],
  validate: true
});
\`\`\`

## Database Migrations

Run migrations safely in CI/CD:

\`\`\`yaml
- name: Run migrations
  run: |
    npx codex migrate --environment \${{ env.DEPLOY_ENV }}
    npx codex migrate --verify
\`\`\`

## Smoke Tests

Verify deployments:

\`\`\`typescript
// tests/smoke.test.ts
import { test, expect } from '@codex/testing';

test('health check', async () => {
  const response = await fetch('https://api.example.com/health');
  expect(response.status).toBe(200);
});

test('database connection', async () => {
  const result = await db.$queryRaw\`SELECT 1\`;
  expect(result).toBeDefined();
});
\`\`\`

## Rollback Strategy

Configure automatic rollbacks:

\`\`\`typescript
export default {
  deployment: {
    strategy: 'rolling',
    healthCheck: {
      endpoint: '/health',
      interval: 10000,
      timeout: 60000,
      successThreshold: 3
    },
    rollback: {
      onHealthCheckFail: true,
      onErrorRateThreshold: 0.05
    }
  }
};
\`\`\`

## Monitoring Deployments

Track deployment metrics:

\`\`\`typescript
import { deployment } from '@codex/deployment';

deployment.track({
  version: process.env.GIT_SHA,
  environment: 'production',
  deployer: process.env.GITHUB_ACTOR,
  notify: ['slack']
});
\`\`\`

## Conclusion

Good CI/CD pipelines give you confidence to ship often. Codex provides the tools to make deployments fast, safe, and automatic.`,
    },
    {
      title: 'Error Handling and Logging Best Practices',
      slug: 'error-handling-logging-best-practices',
      excerpt: 'Master error handling strategies, structured logging, and monitoring in production applications.',
      difficulty: 'intermediate',
      isFeatured: false,
      content: `# Error Handling and Logging Best Practices

Good error handling and logging are crucial for maintainable applications. Learn how to implement production-ready error handling with Codex.

## Error Types

Classify errors appropriately:

\`\`\`typescript
// Custom error classes
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
\`\`\`

## Global Error Handler

Implement a centralized error handler:

\`\`\`typescript
import { errorHandler } from '@codex/errors';

app.use(errorHandler({
  logErrors: true,
  includeStackTrace: process.env.NODE_ENV === 'development',
  handlers: {
    ValidationError: (err, req, res) => {
      res.status(400).json({
        error: 'Validation failed',
        message: err.message,
        field: err.field
      });
    },
    NotFoundError: (err, req, res) => {
      res.status(404).json({
        error: 'Not found',
        message: err.message
      });
    },
    AuthenticationError: (err, req, res) => {
      res.status(401).json({
        error: 'Authentication failed',
        message: err.message
      });
    }
  }
}));
\`\`\`

## Structured Logging

Use structured logging for better analysis:

\`\`\`typescript
import { logger } from '@codex/logging';

logger.configure({
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  destinations: [
    { type: 'console' },
    { type: 'file', path: './logs/app.log' },
    { type: 'datadog', apiKey: process.env.DATADOG_API_KEY }
  ]
});

// Log with context
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  timestamp: new Date().toISOString()
});

// Log errors with full context
logger.error('Payment processing failed', {
  error: err.message,
  stack: err.stack,
  orderId: order.id,
  amount: order.amount,
  userId: user.id
});
\`\`\`

## Error Tracking

Integrate with Sentry for error tracking:

\`\`\`bash
codex install codex-integration-sentry
\`\`\`

Configure Sentry:

\`\`\`typescript
import { initSentry } from '@codex/sentry';

initSentry({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
    }
    return event;
  }
});
\`\`\`

## Async Error Handling

Handle async errors properly:

\`\`\`typescript
import { asyncHandler } from '@codex/async';

// Wrap async route handlers
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.user.findUnique({
    where: { id: req.params.id }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
}));

// Or use try-catch with proper logging
app.post('/orders', async (req, res, next) => {
  try {
    const order = await processOrder(req.body);
    res.json(order);
  } catch (error) {
    logger.error('Order processing failed', {
      error: error.message,
      data: req.body
    });
    next(error);
  }
});
\`\`\`

## Monitoring & Alerts

Set up alerts for critical errors:

\`\`\`typescript
import { alerts } from '@codex/monitoring';

alerts.configure({
  rules: [
    {
      name: 'high-error-rate',
      condition: 'error_count > 100',
      window: '5m',
      channels: ['slack', 'pagerduty']
    },
    {
      name: 'critical-error',
      condition: 'error.level === "critical"',
      channels: ['pagerduty', 'sms']
    }
  ]
});
\`\`\`

## Best Practices

1. **Never swallow errors**: Always log or handle them
2. **Provide context**: Include relevant data with errors
3. **Use error codes**: Help debugging with unique codes
4. **Sanitize logs**: Never log sensitive data (passwords, tokens)
5. **Set up alerts**: Know when things break
6. **Monitor trends**: Track error rates over time

## Conclusion

Good error handling separates amateur code from production-ready systems. Invest time in proper logging and monitoring—your future self will thank you.`,
    },
    {
      title: 'Building GraphQL APIs: A Complete Tutorial',
      slug: 'building-graphql-apis-tutorial',
      excerpt: 'Learn to build scalable GraphQL APIs with type safety, authentication, and performance optimization.',
      difficulty: 'basic',
      isFeatured: false,
      content: `# Building GraphQL APIs: A Complete Tutorial

GraphQL offers a better way to build APIs. This tutorial will guide you through building a production-ready GraphQL API with Codex.

## Why GraphQL?

GraphQL solves common REST API problems:
- **No over-fetching**: Request exactly what you need
- **No under-fetching**: Get related data in one request
- **Type safety**: Strong typing catches errors early
- **Self-documenting**: Schema serves as documentation
- **Versioning**: No need for versioned endpoints

## Getting Started

Install the GraphQL template:

\`\`\`bash
codex install codex-template-graphql-api
\`\`\`

This creates a complete GraphQL server with:
- Type-safe schema
- Authentication middleware
- Database integration
- Query optimization

## Define Your Schema

Create your GraphQL schema:

\`\`\`graphql
# schema.graphql
type User {
  id: ID!
  email: String!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  posts: [Post!]!
}

type Mutation {
  createUser(email: String!, name: String!): User!
  createPost(title: String!, content: String!): Post!
  publishPost(id: ID!): Post!
}
\`\`\`

## Implement Resolvers

Create type-safe resolvers:

\`\`\`typescript
import { Resolvers } from './generated/graphql';
import { db } from './database';

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }) => {
      return await db.user.findUnique({
        where: { id }
      });
    },
    users: async () => {
      return await db.user.findMany();
    },
    post: async (_, { id }) => {
      return await db.post.findUnique({
        where: { id }
      });
    },
    posts: async () => {
      return await db.post.findMany();
    }
  },
  Mutation: {
    createUser: async (_, { email, name }) => {
      return await db.user.create({
        data: { email, name }
      });
    },
    createPost: async (_, { title, content }, { userId }) => {
      return await db.post.create({
        data: {
          title,
          content,
          authorId: userId
        }
      });
    },
    publishPost: async (_, { id }) => {
      return await db.post.update({
        where: { id },
        data: { published: true }
      });
    }
  },
  User: {
    posts: async (user) => {
      return await db.post.findMany({
        where: { authorId: user.id }
      });
    }
  },
  Post: {
    author: async (post) => {
      return await db.user.findUnique({
        where: { id: post.authorId }
      });
    }
  }
};
\`\`\`

## Authentication

Add authentication to your API:

\`\`\`typescript
import { auth } from '@codex/graphql-auth';

const server = createGraphQLServer({
  schema,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = await auth.verifyToken(token);

    return {
      userId: user?.id,
      isAuthenticated: !!user
    };
  },
  plugins: [
    auth.plugin({
      required: true,
      exclude: ['login', 'signup']
    })
  ]
});
\`\`\`

## Query Client

Query your API from the frontend:

\`\`\`typescript
import { GraphQLClient } from '@codex/graphql-client';

const client = new GraphQLClient({
  url: 'http://localhost:4000/graphql',
  headers: {
    authorization: \`Bearer \${token}\`
  }
});

// Type-safe queries
const { user } = await client.query({
  user: {
    __args: { id: '123' },
    id: true,
    name: true,
    posts: {
      id: true,
      title: true
    }
  }
});
\`\`\`

## Performance Optimization

Solve the N+1 query problem with DataLoader:

\`\`\`typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids: string[]) => {
  const users = await db.user.findMany({
    where: { id: { in: ids } }
  });
  return ids.map(id => users.find(u => u.id === id));
});

// Use in resolvers
Post: {
  author: async (post, _, { loaders }) => {
    return await loaders.user.load(post.authorId);
  }
}
\`\`\`

## Testing

Test your GraphQL API:

\`\`\`typescript
import { createTestClient } from '@codex/graphql-testing';

describe('User queries', () => {
  it('fetches user by id', async () => {
    const { query } = createTestClient(schema, resolvers);

    const result = await query({
      query: \`
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            email
            name
          }
        }
      \`,
      variables: { id: '123' }
    });

    expect(result.data.user).toMatchObject({
      id: '123',
      email: 'user@example.com'
    });
  });
});
\`\`\`

## Conclusion

GraphQL is powerful and developer-friendly. With Codex, you get type safety, authentication, and performance optimization out of the box. Start building better APIs today!`,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log('Blog posts seeded');

  // Seed Download Events
  const countries = ['US', 'UK', 'DE', 'JP', 'BR', 'IN', 'CA', 'FR', 'AU', 'KR'];
  const now = new Date();
  const downloadEvents = [];

  // Generate 250 download events
  for (let i = 0; i < 250; i++) {
    const component = createdComponents[Math.floor(Math.random() * createdComponents.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];

    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);

    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    createdAt.setMinutes(createdAt.getMinutes() - minutesAgo);

    downloadEvents.push({
      componentId: component.id,
      country,
      createdAt,
    });
  }

  // Insert download events
  for (const event of downloadEvents) {
    await prisma.downloadEvent.create({
      data: event,
    });
  }

  console.log('Download events seeded');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
