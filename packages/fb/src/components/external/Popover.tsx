import * as React from "react";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { createContext } from "@tw-material/react-utils";
import { useSafeLayoutEffect } from "@nextui-org/use-safe-layout-effect";
import type { OffsetOptions } from "@floating-ui/react-dom";

export interface UsePopoverProps {
  keepMounted?: boolean;

  placement?: Placement;

  strategy?: "absolute" | "fixed";

  triggerReference?: "triggerEl" | "virtualEl";

  triggerPosition?: { left: number; top: number };
  offset?: OffsetOptions;

  isOpen?: boolean;

  initialOpen?: boolean;

  onClose: () => void;

  modal?: boolean;

  onOpenChange?: (open: boolean) => void;
}

export interface PopoverProps extends UsePopoverProps {
  children: React.ReactNode;
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface PopoverContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function usePopover({
  initialOpen = false,
  placement = "top",
  modal,
  isOpen: controlledOpen,
  onOpenChange: setControlledOpen,
  triggerPosition,
  triggerReference,
  onClose,
  offset: offsetProp,
}: UsePopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState();
  const [descriptionId, setDescriptionId] = React.useState();

  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement: triggerReference === "triggerEl" ? placement : "right-start",
    open,
    onOpenChange: (open) => {
      onClose?.();
      setOpen(open);
    },
    whileElementsMounted: autoUpdate,
    transform: false,
    middleware: [offset(offsetProp ?? 0), flip(), shift()],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  const transition = useTransitionStyles(context, {
    duration: {
      open: 200,
      close: 0,
    },
  });

  useSafeLayoutEffect(() => {
    if (triggerReference === "virtualEl" && controlledOpen) {
      const x = triggerPosition?.left ?? 0;
      const y = triggerPosition?.top ?? 0;
      data.refs.setReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x,
            y,
            top: y,
            left: x,
            right: x,
            bottom: y,
          };
        },
      });
    }
  }, [triggerReference, triggerPosition, controlledOpen]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      ...transition,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      arrowRef,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      modal,
      labelId,
      descriptionId,
      transition,
    ],
  );
}

export type PopoverContext = ReturnType<typeof usePopover>;

export const [PopoverProvider, usePopoverContext] =
  createContext<PopoverContext>({
    name: "PopoverContext",
  });

export function Popover({
  children,
  modal = false,
  ...restOptions
}: PopoverProps) {
  const popover = usePopover({ modal, ...restOptions });
  return <PopoverProvider value={popover}>{children}</PopoverProvider>;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const ref = useMergeRefs([context.refs.setReference, propRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed",
      }),
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(props, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          className="focus:!outline-none z-50"
          style={{
            position: context.strategy,
            top: context.y ?? 0,
            left: context.x ?? 0,
            width: "max-content",
            ...props.style,
            ...context.styles,
          }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});
