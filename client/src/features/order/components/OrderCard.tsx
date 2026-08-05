"use client";

import { ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PriceTag } from "@/components/common/Logo";
import { ORDER_STATUS_BADGE, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/utils/constants";
import { formatSmartDate } from "@/utils/helper";
import type { Order } from "@/types";
import { useUpdateOrderStatus } from "@/features/order/services/order.service";

const OrderCard: React.FC<{
  order: Order;
  canAdvance?: boolean;
  acceptLabel?: string;
}> = ({ order, canAdvance = true, acceptLabel }) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus = currentIdx >= 0 ? ORDER_STATUS_FLOW[currentIdx + 1] : undefined;
  const isPendingOrder = order.status === "PENDING";

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono font-semibold">{order.orderNumber}</p>
          <p className="text-xs text-base-content/50">
            Table {order.tableNumber} · {formatSmartDate(order.createdAt)}
          </p>
        </div>
        <Badge variant="outline" className={ORDER_STATUS_BADGE[order.status]}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="dashed-divider pt-3 space-y-1">
        {order.items.map((item) => (
          <div key={item.itemId} className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">
              {item.qty} × {item.name}
            </span>
            <PriceTag amount={item.price * item.qty} className="text-base-content/70" />
          </div>
        ))}
      </div>

      <div className="dashed-divider pt-3 flex items-center justify-between">
        <span className="text-sm font-medium">Total</span>
        <PriceTag amount={order.grandTotal} className="font-semibold" />
      </div>

      {canAdvance && nextStatus && (
        <Button
          size="sm"
          isLoading={isPending}
          onClick={() => updateStatus({ id: order.id, status: nextStatus })}
          icon={<ChevronRight className="size-3.5" />}
        >
          {isPendingOrder && acceptLabel ? acceptLabel : `Mark as ${ORDER_STATUS_LABEL[nextStatus]}`}
        </Button>
      )}
    </Card>
  );
};

export default OrderCard;
