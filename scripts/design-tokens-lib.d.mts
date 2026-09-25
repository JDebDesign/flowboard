export interface DesignToken {
  name: string;
  value: string;
  usage: string;
}

export interface ParsedDesignTokens {
  colors: DesignToken[];
  typography: DesignToken[];
  radii: DesignToken[];
  shadows: DesignToken[];
}

export function parseDesignSystemMarkdown(source: string): ParsedDesignTokens;
export function renderTokensCss(tokens: ParsedDesignTokens): string;
export function renderTokensTs(tokens: ParsedDesignTokens): string;
