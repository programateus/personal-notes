import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";

export const Editor = () => {
  useEditor((root) => {
    return new Crepe({ root });
  });

  return <Milkdown />;
};
