export const Colors = { background: "#0B0F0D", surface: "#141B16", surfaceRaised: "#1A241C", border: "#263128", foreground: "#F4F7F2", muted: "#8F9B91", accent: "#B9F06B", cyan: "#6EE7F2", orange: "#F7B267", lilac: "#C4B5FD", danger: "#F87171", success: "#B9F06B", white: "#FFFFFF" } as const;
export type ColorName = keyof typeof Colors;
