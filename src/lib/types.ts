export type CategoryType = 'agents' | 'plugins' | 'commands' | 'settings' | 'hooks' | 'integrations' | 'templates';

export interface CategoryInfo {
  name: string;
  slug: CategoryType;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Agents', slug: 'agents', emoji: '🤖', color: 'text-category-agents', bgColor: 'bg-blue-500/10', description: 'Autonomous AI agents for complex workflows' },
  { name: 'Plugins', slug: 'plugins', emoji: '🔌', color: 'text-category-plugins', bgColor: 'bg-purple-500/10', description: 'Extend Codex with powerful plugins' },
  { name: 'Commands', slug: 'commands', emoji: '⚡', color: 'text-category-commands', bgColor: 'bg-yellow-500/10', description: 'Custom CLI commands and shortcuts' },
  { name: 'Settings', slug: 'settings', emoji: '⚙️', color: 'text-category-settings', bgColor: 'bg-gray-500/10', description: 'Configuration presets and profiles' },
  { name: 'Hooks', slug: 'hooks', emoji: '🪝', color: 'text-category-hooks', bgColor: 'bg-orange-500/10', description: 'Lifecycle hooks and event handlers' },
  { name: 'Integrations', slug: 'integrations', emoji: '🔗', color: 'text-category-integrations', bgColor: 'bg-green-500/10', description: 'Connect with external services' },
  { name: 'Templates', slug: 'templates', emoji: '🎨', color: 'text-category-templates', bgColor: 'bg-pink-500/10', description: 'Project templates and scaffolding' },
];

export const getCategoryInfo = (slug: string): CategoryInfo | undefined =>
  CATEGORIES.find(c => c.slug === slug);

export type SortOption = 'downloads' | 'name' | 'newest';
