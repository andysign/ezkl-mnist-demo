"use client";

export function Button({
  text = "",
  className = "",
  onClick = (e) => {},
  disabled = false,
  type = "button",
  loading = false,
  loadingText = "",
  ...props
}: {
  text?: string | null;
  className?: string;
  onClick?: (e: any) => any;
  disabled?: boolean;
  type?: "button" | "submit";
  loading?: boolean;
  loadingText?: string | null;
}) {
  return (
    <>
      {(
        <button
          type={type}
          onClick={onClick}
          disabled={disabled || loading}
          className={className}
          {...props}
        >
          <p className={''}>{loading ? loadingText : text}</p>
        </button>
      )}
    </>
  );
}
