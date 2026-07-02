import {
  Search, Eye, EyeOff, AlertCircle, Calendar,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Plus, Minus, X, Check,
  Copy, Edit2, Filter, Download, Upload,
  Percent, Coins, Wallet, CreditCard,
  MoreHorizontal, Phone, Lock,
  FileText, Link as LinkIcon,
} from 'lucide-react';

export const ICONS = {
  Search, 'search': Search,
  Eye, 'eye': Eye,
  EyeOff, 'eye-off': EyeOff,
  AlertCircle, 'alert-circle': AlertCircle,
  Calendar, 'calendar': Calendar,
  ChevronRight, 'chevron-right': ChevronRight,
  ChevronLeft,  'chevron-left':  ChevronLeft,
  ChevronUp,    'chevron-up':    ChevronUp,
  ChevronDown,  'chevron-down':  ChevronDown,
  ArrowRight, 'arrow-right': ArrowRight,
  ArrowLeft,  'arrow-left':  ArrowLeft,
  ArrowUp,    'arrow-up':    ArrowUp,
  ArrowDown,  'arrow-down':  ArrowDown,
  Plus, 'plus': Plus,
  Minus, 'minus': Minus,
  X, 'x': X,
  Check, 'check': Check,
  Copy, 'copy': Copy,
  Edit2, 'edit': Edit2,
  Filter, 'filter': Filter,
  Download, 'download': Download,
  Upload, 'upload': Upload,
  Percent, 'percent': Percent,
  Coins, 'coins': Coins,
  Wallet, 'wallet': Wallet,
  CreditCard, 'credit-card': CreditCard,
  MoreHorizontal, 'more': MoreHorizontal,
  Phone, 'phone': Phone,
  Lock, 'lock': Lock,
  FileText, 'file-text': FileText,
  LinkIcon, 'link': LinkIcon,
};

export function mergeRefs(...refs) {
  return (el) => refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });
}

const _injected = new Set();
export function injectStyles(id, css) {
  if (_injected.has(id) || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  _injected.add(id);
}
