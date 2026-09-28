/** Hand-drawn problem icons. Parts animate while the tile is hovered or selected (see .pi-* in globals.css). */

const common = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  width: 44,
  height: 44,
};

export function ProblemIcon({ id }: { id: string }) {
  switch (id) {
    case "burst":
      return (
        <svg {...common}>
          <path d="M4 28h14l2-3 3 5 2-4h19" />
          <path d="M4 34h40" />
          <g className="pi-spray">
            <path d="M22 22 18 12" />
            <path d="M24 21v-12" />
            <path d="M26 22l4-10" />
            <path d="M28 24l8-6" />
          </g>
        </svg>
      );
    case "leak":
      return (
        <svg {...common}>
          <path d="M6 12h22a6 6 0 0 1 6 6v4" />
          <path d="M6 18h20" />
          <path d="M31 22h6" />
          <path className="pi-drip" d="M34 28s-3 3.8-3 5.8a3 3 0 0 0 6 0c0-2-3-5.8-3-5.8Z" />
          <path d="M26 42h16" className="pi-puddle" />
        </svg>
      );
    case "clog":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="17" />
          <g className="pi-swirl" style={{ transformOrigin: "24px 24px" }}>
            <path d="M24 14a10 10 0 0 1 10 10" />
            <path d="M24 34a10 10 0 0 1-10-10" />
            <path d="M28 24a4 4 0 0 0-4-4" />
            <path d="M20 24a4 4 0 0 0 4 4" />
          </g>
        </svg>
      );
    case "hot":
      return (
        <svg {...common}>
          <path d="M20 30V9a4 4 0 0 1 8 0v21a8 8 0 1 1-8 0Z" />
          <circle cx="24" cy="36" r="3.5" fill="currentColor" />
          <path className="pi-level" d="M24 32V16" />
          <path d="M34 12h6M34 18h4M34 24h6" />
        </svg>
      );
    case "toilet":
      return (
        <svg {...common}>
          <path d="M12 6h14v14H12z" />
          <path d="M8 20h28a2 2 0 0 1 2 2 14 14 0 0 1-12 13.8V42H16v-6.4A14 14 0 0 1 6 22a2 2 0 0 1 2-2Z" />
          <g className="pi-wave">
            <path d="M38 8c2 1.5 2 3.5 0 5" />
            <path d="M42 6c3 2.5 3 6.5 0 9" />
          </g>
        </svg>
      );
    case "pressure":
      return (
        <svg {...common}>
          <path d="M8 32a16 16 0 1 1 32 0" />
          <path d="M8 32h4M36 32h4M24 16v4M13 21l3 3M35 21l-3 3" />
          <g className="pi-needle" style={{ transformOrigin: "24px 32px" }}>
            <path d="M24 32 14 26" />
          </g>
          <circle cx="24" cy="32" r="2.5" fill="currentColor" />
        </svg>
      );
    case "smell":
      return (
        <svg {...common}>
          <path d="M10 40h28" />
          <path d="M16 40v-4h16v4" />
          <g className="pi-waft">
            <path d="M18 30c-3-3 3-5 0-8s3-5 0-8" />
            <path d="M24 30c-3-3 3-5 0-8s3-5 0-8" />
            <path d="M30 30c-3-3 3-5 0-8s3-5 0-8" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}
