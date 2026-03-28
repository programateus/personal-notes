export type Dropzone = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Dropzone = ({ children, ...props }: Dropzone) => {
  return (
    <button
      {...props}
      className="mx-2 mt-2 w-[calc(100%-16px)] cursor-pointer rounded
           border border-dashed border-base-content/20
           px-3 py-4 text-center text-xs text-base-content/40
           hover:border-base-content/45 hover:text-base-content/70"
    >
      {children}
    </button>
  );
};
