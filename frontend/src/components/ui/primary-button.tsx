import { Children } from "react";
import { Button } from "./button";

export function PrimaryCardButton({ status }: { status?: string }) {
  return (
    <button
      disabled={status !== "AVAILABLE"}
      className={`${
        status === "AVAILABLE"
          ? "bg-navi text-navi-foreground"
          : "cursor-not-allowed border border-white/20 bg-white/40 text-slate-400"
      } ' flex w-full items-center justify-center gap-2 rounded-3xl py-5 font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95`}
    >
      {status === "AVAILABLE" ? (
        <>
          Request Borrow{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </>
      ) : (
        "Unavailable"
      )}
    </button>
  );
}

export const NormalButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button className="bg-navi text-navi-foreground hover:bg-navi/90">
      {children}
    </Button>
  );
};
