import type { ComponentType, SVGProps } from "react";
import {
  Users,
  Handshake,
  ListChecks,
  Megaphone,
  CalendarCheck,
  Headset,
  ShieldCheck,
  DollarSign,
  Rocket,
  Database,
  Building2,
  BarChart3,
  Bot,
  Target,
  Layers,
  Settings2,
  TrendingUp,
  UserCheck,
  Calculator,
  Gift,
  Radar,
  Linkedin,
  Youtube,
  Facebook,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

/** Every icon gets its own signature motion. */
const FX = new Map<unknown, string>([
  [Users, "hop"], // people hop one after another
  [Handshake, "shake"], // handshake wiggle
  [ListChecks, "nudge"], // checklist ticks sideways
  [Megaphone, "blast"], // megaphone punches out
  [CalendarCheck, "flip"], // calendar flips over
  [Headset, "tilt"], // headset listens, head tilt
  [ShieldCheck, "glow"], // shield pulses with a glow
  [DollarSign, "coin"], // coin spins on its axis
  [Rocket, "launch"], // rocket lifts off
  [Database, "squash"], // data stack squashes
  [Building2, "rise"], // building grows
  [BarChart3, "grow"], // chart bars grow
  [Bot, "blink"], // bot blinks and nods
  [Target, "zoom"], // target locks on
  [Layers, "float"], // layers drift
  [Settings2, "spin"], // gear turns
  [TrendingUp, "climb"], // arrow climbs
  [UserCheck, "pop"], // pop of approval
  [Calculator, "wobble"],
  [Gift, "wobble"],
  [Radar, "spin"],
  [Linkedin, "pop"],
  [Youtube, "pop"],
  [Facebook, "pop"],
  [MapPin, "drop"],
  [Phone, "ring"],
  [Mail, "nudge"],
]);

/**
 * Drop-in replacement for a lucide icon: `<FxIcon icon={Users} className="h-6 w-6" />`.
 * Pops in when its section scrolls into view, then loops its own signature animation
 * (and speeds up when the card it sits in is hovered).
 */
export function FxIcon({
  icon: Icon,
  className = "",
  fx,
  ...rest
}: { icon: IconType; className?: string; fx?: string } & SVGProps<SVGSVGElement>) {
  const name = fx ?? FX.get(Icon) ?? "float";
  return <Icon className={`fx fx-${name} ${className}`} aria-hidden="true" {...rest} />;
}
