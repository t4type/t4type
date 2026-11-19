import React from 'react';

export type BrandLogoVariant = 'vertical' | 'horizontal' | 'compact' | 'symbol-only';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type BrandLogoTheme = 'auto' | 'dark' | 'light';

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  showText?: boolean;
  showDomain?: boolean;
  theme?: BrandLogoTheme;
  ariaLabel?: string;
}

// Canonical glyph vector paths (precision calibrated to reference image)
const GLYPH_T1 =
  'M 45.5 23 H 54.5 V 36 H 63 V 44.5 H 54.5 V 58 C 54.5 61 56.5 62.5 60 62.5 C 61.5 62.5 63 62 64 61.2 V 69 C 62.5 70 59.5 71 56.5 71 C 49.5 71 45.5 66.5 45.5 58 V 44.5 H 37 V 36 H 45.5 Z';

const GLYPH_4 =
  'M 153.5 23 H 162.5 V 52 H 168.5 V 60.5 H 162.5 V 70 H 153.5 V 60.5 H 136 V 53.5 L 153.5 23 Z M 153.5 52 V 36.5 L 142.5 52 H 153.5 Z';

const GLYPH_T2 =
  'M 245.5 23 H 254.5 V 36 H 263 V 44.5 H 254.5 V 58 C 254.5 61 256.5 62.5 260 62.5 C 261.5 62.5 263 62 264 61.2 V 69 C 262.5 70 259.5 71 256.5 71 C 249.5 71 245.5 66.5 245.5 58 V 44.5 H 237 V 36 H 245.5 Z';

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showText = true,
  showDomain,
  theme = 'auto',
  ariaLabel = 'T4Type logo',
  ...rest
}) => {
  // Determine effective variant
  const effectiveVariant: BrandLogoVariant = !showText ? 'symbol-only' : variant;
  const includeDomain = showDomain !== undefined ? showDomain : effectiveVariant === 'vertical';

  // Calculate dimensions based on variant and size preset
  let width: number | string = 'auto';
  let height: number | string = 'auto';

  if (typeof size === 'number') {
    height = size;
  } else {
    switch (size) {
      case 'xs':
        height = effectiveVariant === 'symbol-only' ? 16 : effectiveVariant === 'vertical' ? 36 : 20;
        break;
      case 'sm':
        height = effectiveVariant === 'symbol-only' ? 24 : effectiveVariant === 'vertical' ? 50 : 30;
        break;
      case 'md':
        height = effectiveVariant === 'symbol-only' ? 34 : effectiveVariant === 'vertical' ? 68 : 38;
        break;
      case 'lg':
        height = effectiveVariant === 'symbol-only' ? 48 : effectiveVariant === 'vertical' ? 96 : 52;
        break;
      case 'xl':
        height = effectiveVariant === 'symbol-only' ? 68 : effectiveVariant === 'vertical' ? 136 : 72;
        break;
    }
  }

  // Color variables according to theme
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  // Keycap 1 & 3 (White)
  const whiteKeyFace = '#FFFFFF';
  const whiteKeyExtrusion = isLight ? '#94A3B8' : isDark ? '#64748B' : '#718096';
  const whiteKeyBorder = isLight
    ? '#CBD5E1'
    : isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'var(--color-border, #CBD5E1)';

  // Keycap 2 (Yellow / Gold Accent)
  const goldKeyFace = isLight ? '#EAB308' : '#F5B915';
  const goldKeyExtrusion = '#CA8A04';

  // Glyphs & Cursor
  const glyphFill = '#0F172A';
  const cursorFill = goldKeyFace;

  // Text colors
  const textBrandColor = isLight
    ? '#0F172A'
    : isDark
    ? '#F1F5F9'
    : 'var(--color-primary, #F1F5F9)';
  const textAccentColor = isLight ? '#B45309' : '#F5B915';
  const textDomainColor = isLight
    ? '#64748B'
    : isDark
    ? '#94A3B8'
    : 'var(--color-secondary, #94A3B8)';

  // Reusable 3D Keycap Symbol (viewBox: 0 0 326 96)
  const renderSymbolGroup = () => (
    <g id="t4t-keycaps">
      {/* Key 1: 't' */}
      <g id="t4t-key-1">
        <rect x="8" y="16" width="84" height="80" rx="19" fill={whiteKeyExtrusion} />
        <rect
          x="8"
          y="4"
          width="84"
          height="80"
          rx="19"
          fill={whiteKeyFace}
          stroke={whiteKeyBorder}
          strokeWidth="1.2"
        />
        <path d={GLYPH_T1} fill={glyphFill} />
      </g>

      {/* Key 2: '4' */}
      <g id="t4t-key-2">
        <rect x="108" y="16" width="84" height="80" rx="19" fill={goldKeyExtrusion} />
        <rect x="108" y="4" width="84" height="80" rx="19" fill={goldKeyFace} />
        <path d={GLYPH_4} fill={glyphFill} />
      </g>

      {/* Key 3: 't' */}
      <g id="t4t-key-3">
        <rect x="208" y="16" width="84" height="80" rx="19" fill={whiteKeyExtrusion} />
        <rect
          x="208"
          y="4"
          width="84"
          height="80"
          rx="19"
          fill={whiteKeyFace}
          stroke={whiteKeyBorder}
          strokeWidth="1.2"
        />
        <path d={GLYPH_T2} fill={glyphFill} />
      </g>

      {/* Cursor: '|' */}
      <rect x="308" y="11" width="10" height="72" rx="5" fill={cursorFill} />
    </g>
  );

  // 1. SYMBOL ONLY
  if (effectiveVariant === 'symbol-only') {
    return (
      <svg
        viewBox="0 0 326 96"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={`inline-block select-none overflow-visible ${className}`}
        {...rest}
      >
        <title>{ariaLabel}</title>
        {renderSymbolGroup()}
      </svg>
    );
  }

  // 2. VERTICAL (Symbol on top, T4Type.com below)
  if (effectiveVariant === 'vertical') {
    return (
      <svg
        viewBox="0 0 326 138"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={`inline-block select-none overflow-visible ${className}`}
        {...rest}
      >
        <title>{ariaLabel}</title>
        {renderSymbolGroup()}
        <text
          x="163"
          y="131"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="700"
          letterSpacing="2.8"
        >
          <tspan fill={textBrandColor}>T4</tspan>
          <tspan fill={textAccentColor}>Type</tspan>
          {includeDomain && (
            <tspan fill={textDomainColor} fontWeight="500" letterSpacing="1">
              .com
            </tspan>
          )}
        </text>
      </svg>
    );
  }

  // 3. COMPACT (Tight horizontal lockup)
  if (effectiveVariant === 'compact') {
    return (
      <svg
        viewBox="0 0 375 74"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={`inline-block select-none overflow-visible ${className}`}
        {...rest}
      >
        <title>{ariaLabel}</title>
        <g transform="scale(0.72) translate(0, 4)">{renderSymbolGroup()}</g>
        <text
          x="250"
          y="50"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="36"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          <tspan fill={textBrandColor}>T4</tspan>
          <tspan fill={textAccentColor}>Type</tspan>
          {includeDomain && (
            <tspan fill={textDomainColor} fontSize="22" fontWeight="500" letterSpacing="0.5">
              .com
            </tspan>
          )}
        </text>
      </svg>
    );
  }

  // 4. HORIZONTAL (Standard horizontal lockup, optimal for headers/navbars)
  return (
    <svg
      viewBox={includeDomain ? '0 0 460 76' : '0 0 380 76'}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={`inline-block select-none overflow-visible ${className}`}
      {...rest}
    >
      <title>{ariaLabel}</title>
      <g transform="scale(0.74) translate(0, 4)">{renderSymbolGroup()}</g>
      <text
        x="256"
        y="51"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="36"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        <tspan fill={textBrandColor}>T4</tspan>
        <tspan fill={textAccentColor}>Type</tspan>
        {includeDomain && (
          <tspan fill={textDomainColor} fontSize="22" fontWeight="500" letterSpacing="0.5">
            .com
          </tspan>
        )}
      </text>
    </svg>
  );
};

export default BrandLogo;

