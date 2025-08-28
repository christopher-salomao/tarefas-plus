import { TextareaHTMLAttributes } from "react";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className=" w-full h-full resize-none bg-white border border-neutral-700 rounded-lg p-2 !text-black" {...props}></textarea>
  );
}
