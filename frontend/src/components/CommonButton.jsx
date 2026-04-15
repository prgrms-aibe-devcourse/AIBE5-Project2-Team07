import React from 'react';
import { Link } from 'react-router-dom';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-deep shadow-md shadow-primary/10',
  outline: 'bg-white border border-outline text-on-surface hover:border-primary hover:bg-primary-soft',
  subtle: 'bg-gray-100 text-on-surface hover:bg-gray-200',
  dark: 'bg-on-surface text-white hover:bg-black',
  soft: 'bg-primary-soft text-primary border border-primary/10 hover:bg-primary/15',
  toggle: 'border border-transparent text-on-surface-variant hover:text-primary',
  pagination: 'bg-white border border-outline text-on-surface-variant hover:bg-primary-soft hover:border-primary/30 hover:text-primary',
  fab: 'bg-primary text-white shadow-xl hover:bg-primary-deep',
};

const activeVariantClasses = {
  toggle: 'bg-primary-soft text-primary shadow-sm',
  pagination: 'bg-primary text-white border-primary shadow-md shadow-primary/20',
};

const sizeClasses = {
  sm: 'px-4 py-2 rounded-lg text-sm',
  md: 'px-6 py-3 rounded-lg text-sm',
  lg: 'px-8 py-3 rounded-xl text-base',
  xl: 'px-12 py-4 rounded-xl text-sm',
  tab: 'px-6 py-3 rounded-xl text-sm',
  full: 'w-full py-4 rounded-xl text-sm',
  fullLg: 'w-full py-5 rounded-2xl text-lg',
  square: 'w-10 h-10 rounded-lg text-sm',
  squareLg: 'w-12 h-12 rounded-xl text-sm',
  fab: 'w-16 h-16 rounded-full text-base',
};

export default function CommonButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  active = false,
  activeClassName = '',
  inactiveClassName = '',
  disabled = false,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:shadow-none',
    variantClasses[variant],
    sizeClasses[size],
    active && activeVariantClasses[variant],
    active ? activeClassName : inactiveClassName,
    fullWidth && 'w-full',
    disabled && 'opacity-60 hover:bg-inherit',
    className,
  );

  const content = (
    <>
      {icon && iconPosition === 'left' ? icon : null}
      {children}
      {icon && iconPosition === 'right' ? icon : null}
    </>
  );

  if (to && !disabled) {
    return (
      <Link className={classes} to={to} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a className={classes} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {content}
    </button>
  );
}

