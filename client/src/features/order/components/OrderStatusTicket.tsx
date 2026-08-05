import { Check } from "lucide-react";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/utils/constants";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/cn";

const OrderStatusTicket: React.FC<{
  orderNumber: string;
  tableNumber: string;
  status: OrderStatus;
}> = ({ orderNumber, tableNumber, status }) => {
  const currentIdx = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="ticket-edge rounded-box bg-base-100 border border-base-300 shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-base-content/50">Order</p>
          <p className="font-mono text-xl font-semibold">{orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-base-content/50">Table</p>
          <p className="font-mono text-xl font-semibold">{tableNumber}</p>
        </div>
      </div>

      <div className="ticket-perforation" />

      <div className="px-6 py-6">
        <div className="flex items-start">
          {ORDER_STATUS_FLOW.map((s, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            const isLast = idx === ORDER_STATUS_FLOW.length - 1;

            return (
              <div key={s} className={cn("flex items-center", !isLast && "flex-1")}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors",
                      done && "bg-primary border-primary text-primary-content",
                      active && "border-primary text-primary bg-primary/10",
                      !done && !active && "border-base-300 text-base-content/30"
                    )}
                  >
                    {done ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium text-center leading-tight w-16",
                      active ? "text-primary" : done ? "text-base-content" : "text-base-content/40"
                    )}
                  >
                    {ORDER_STATUS_LABEL[s]}
                  </span>
                </div>
                {!isLast && (
                  <div className={cn("h-0.5 flex-1 mx-1 mb-5", done ? "bg-primary" : "bg-base-300")} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTicket;
