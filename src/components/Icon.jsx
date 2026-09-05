const paths = {
  search:
    'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm10 2-5.6-5.6',

  heart:
    'M12 21s-7.5-4.6-10-9.3C.6 8.1 2.3 4.5 6 4c2-.3 3.7.7 6 3 2.3-2.3 4-3.3 6-3 3.7.5 5.4 4.1 4 7.7C19.5 16.4 12 21 12 21z',

  cart:
    'M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h7.2a2 2 0 0 0 2-1.6L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',

  user:
    'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM4 21a8 8 0 0 1 16 0',

  chevronDown:
    'M6 9l6 6 6-6',

  chevronRight:
    'M9 6l6 6-6 6',

  chevronLeft:
    'M15 6l-6 6 6 6',

  menu:
    'M3 6h18M3 12h18M3 18h18',

  close:
    'M6 6l12 12M18 6L6 18',

  star:
    'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1L12 2z',

  check:
    'M20 6L9 17l-5-5',

  trash:
    'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',

  minus:
    'M5 12h14',

  plus:
    'M12 5v14M5 12h14',

  truck:
    'M3 6h11v9H3zM14 10h4l3 3v2h-7v-5zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',

  shield:
    'M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z',

  bolt:
    'M13 2 3 14h7l-1 8 11-14h-7l1-6z',

  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2m12 0h2M12 4v2m0 12v2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18',

  droplet:
    'M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12z',

  hammer:
    'M14 6l4 4-2 2-4-4 2-2zM4 20l8-8m1-5 4 4-9 9-4-4 9-9z',

  cpu:
    'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M6 6h12v12H6z',

  wind:
    'M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h9',

  flame:
    'M12 2c2 3-1 4-1 7a3 3 0 1 0 6 0c0-1-1-2-1-2 2 1 3 4 3 6a7 7 0 1 1-14 0c0-4 3-6 7-11z',

  arrowRight:
    'M5 12h14M13 6l6 6-6 6',

  arrowLeft:
    'M19 12H5M11 6l-6 6 6 6',

  location:
    'M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',

  phone:
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z',

  mail:
    'M4 4h16v16H4zM4 6l8 7 8-7',

  clock:
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',

  eye:
    'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',

  eyeOff:
    'M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10 10 0 0 1 12 4c7 0 11 8 11 8a17 17 0 0 1-2.2 3.1M6.2 6.2C3.2 8.3 1 12 1 12s4 8 11 8a10 10 0 0 0 4-.8',

  package:
    'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',

  quote:
    'M7 7h4v4c0 3-2 5-4 5v-2c1 0 2-1 2-3H7V7zM15 7h4v4c0 3-2 5-4 5v-2c1 0 2-1 2-3h-2V7z',

  home:
    'M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z',

  dashboard:
    'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',

  orders:
    'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',

  filter:
    'M4 6h16M7 12h10M10 18h4',

  refresh:
    'M20 7v5h-5M4 17v-5h5M6.1 8A7 7 0 0 1 18 6M17.9 16A7 7 0 0 1 6 18',

  info:
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 10v6M12 7h.01',

  warning:
    'M12 3 2 21h20L12 3zM12 9v5M12 17h.01',

  edit:
    'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',

  upload:
    'M12 16V4M7 9l5-5 5 5M4 20h16',

  download:
    'M12 4v12M7 11l5 5 5-5M4 20h16',

  logout:
    'M10 17l5-5-5-5M15 12H3M14 4h6v16h-6',

  lock:
    'M6 10h12v10H6zM8 10V7a4 4 0 0 1 8 0v3',

  calendar:
    'M5 3v4M19 3v4M4 7h16v14H4zM4 11h16',

  utensils:
    'M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11M15 3v18M15 3c3 1 5 4 5 7h-5',

  bath:
    'M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3zM7 12V7a3 3 0 0 1 6 0',

  shirt:
    'M8 4 4 6 2 11h4v4h8v-4h4l-2-11-4-2a4 4 0 0 1-8 0z',
};


// ============================================================
// ICON ALIASES
// ============================================================

const aliases = {
  'map-pin':
    'location',

  'shopping-cart':
    'cart',

  'arrow-right':
    'arrowRight',

  'arrow-left':
    'arrowLeft',

  'chevron-down':
    'chevronDown',

  'chevron-right':
    'chevronRight',

  'chevron-left':
    'chevronLeft',

  'eye-off':
    'eyeOff',

  zap:
    'bolt',
};


// ============================================================
// ICON COMPONENT
// ============================================================

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className = '',
  fill = false,
  title = '',
  ...props
}) {

  const rawName =
    String(
      name ||
      ''
    ).trim();


  const resolvedName =
    aliases[rawName] ||
    rawName;


  const d =
    paths[resolvedName];


  if (
    !d
  ) {

    if (
      import.meta.env.DEV
    ) {

      console.warn(
        `[Icon] Unknown icon: "${rawName}"`
      );

    }

    return null;

  }


  const numericSize =
    Number(
      size
    ) ||
    20;


  const accessible =
    Boolean(
      title
    );


  return (

    <svg
      width={
        numericSize
      }

      height={
        numericSize
      }

      viewBox="0 0 24 24"

      fill={
        fill
          ? 'currentColor'
          : 'none'
      }

      stroke="currentColor"

      strokeWidth={
        strokeWidth
      }

      strokeLinecap="round"

      strokeLinejoin="round"

      className={
        className
      }

      aria-hidden={
        accessible
          ? undefined
          : true
      }

      role={
        accessible
          ? 'img'
          : undefined
      }

      aria-label={
        accessible
          ? title
          : undefined
      }

      focusable="false"

      {...props}
    >

      {
        accessible && (
          <title>
            {title}
          </title>
        )
      }

      <path
        d={
          d
        }
      />

    </svg>

  );

}