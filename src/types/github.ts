export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  language: string | null;
  fork: boolean;
  archived: boolean;
}

export interface GitHubLanguages {
  [language: string]: number;
}
