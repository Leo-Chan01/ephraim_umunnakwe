import {
  Smartphone,
  Globe,
  Zap,
  ShoppingCart,
  Lightbulb,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  RefreshCw,
  Check,
  ArrowRight
} from 'lucide-react';

export {
  Smartphone,
  Globe,
  Zap,
  ShoppingCart,
  Lightbulb,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  RefreshCw,
  Check,
  ArrowRight
};

export function getPlatformIcon(platform: string) {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case 'github':
      return <Github className="w-5 h-5" />;
    case 'linkedin':
      return <Linkedin className="w-5 h-5" />;
    case 'twitter':
      return <Twitter className="w-5 h-5" />;
    default:
      return <ExternalLink className="w-5 h-5" />;
  }
}

export const serviceIcons = {
  web: Globe,
  mobile: Smartphone,
  api: Zap,
  ecommerce: ShoppingCart,
  consulting: Lightbulb,
  maintenance: Wrench
};
