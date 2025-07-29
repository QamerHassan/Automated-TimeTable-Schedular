// "use client"

// import * as React from "react"

// const TOAST_LIMIT = 1
// const TOAST_REMOVE_DELAY = 1000000

// type ToasterToast = {
//   id: string
//   title?: React.ReactNode
//   description?: React.ReactNode
//   action?: React.ReactElement
//   variant?: "default" | "destructive"
// }

// const actionTypes = {
//   ADD_TOAST: "ADD_TOAST",
//   UPDATE_TOAST: "UPDATE_TOAST",
//   DISMISS_TOAST: "DISMISS_TOAST",
//   REMOVE_TOAST: "REMOVE_TOAST",
// } as const

// let count = 0

// function genId() {
//   count = (count + 1) % Number.MAX_SAFE_INTEGER
//   return count.toString()
// }

// type ActionType = typeof actionTypes

// type Action =
//   | {
//       type: ActionType["ADD_TOAST"]
//       toast: ToasterToast
//     }
//   | {
//       type: ActionType["UPDATE_TOAST"]
//       toast: Partial<ToasterToast>
//     }
//   | {
//       type: ActionType["DISMISS_TOAST"]
//       toastId?: ToasterToast["id"]
//     }
//   | {
//       type: ActionType["REMOVE_TOAST"]
//       toastId?: ToasterToast["id"]
//     }

// interface State {
//   toasts: ToasterToast[]
// }

// const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// const addToRemoveQueue = (toastId: string) => {
//   if (toastTimeouts.has(toastId)) {
//     return
//   }

//   const timeout = setTimeout(() => {
//     toastTimeouts.delete(toastId)
//     dispatch({
//       type: "REMOVE_TOAST",
//       toastId: toastId,
//     })
//   }, TOAST_REMOVE_DELAY)

//   toastTimeouts.set(toastId, timeout)
// }

// export const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "ADD_TOAST":
//       return {
//         ...state,
//         toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
//       }

//     case "UPDATE_TOAST":
//       return {
//         ...state,
//         toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
//       }

//     case "DISMISS_TOAST": {
//       const { toastId } = action

//       if (toastId) {
//         addToRemoveQueue(toastId)
//       } else {
//         state.toasts.forEach((toast) => {
//           addToRemoveQueue(toast.id)
//         })
//       }

//       return {
//         ...state,
//         toasts: state.toasts.map((t) =>
//           t.id === toastId || toastId === undefined
//             ? {
//                 ...t,
//                 open: false,
//               }
//             : t,
//         ),
//       }
//     }
//     case "REMOVE_TOAST":
//       if (action.toastId === undefined) {
//         return {
//           ...state,
//           toasts: [],
//         }
//       }
//       return {
//         ...state,
//         toasts: state.toasts.filter((t) => t.id !== action.toastId),
//       }
//   }
// }

// const listeners: Array<(state: State) => void> = []

// let memoryState: State = { toasts: [] }

// function dispatch(action: Action) {
//   memoryState = reducer(memoryState, action)
//   listeners.forEach((listener) => {
//     listener(memoryState)
//   })
// }

// type Toast = Omit<ToasterToast, "id">

// function toast({ ...props }: Toast) {
//   const id = genId()

//   const update = (props: ToasterToast) =>
//     dispatch({
//       type: "UPDATE_TOAST",
//       toast: { ...props, id },
//     })
//   const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

//   dispatch({
//     type: "ADD_TOAST",
//     toast: {
//       ...props,
//       id,
//       open: true,
//       onOpenChange: (open) => {
//         if (!open) dismiss()
//       },
//     },
//   })

//   return {
//     id: id,
//     dismiss,
//     update,
//   }
// }

// function useToast() {
//   const [state, setState] = React.useState<State>(memoryState)

//   React.useEffect(() => {
//     listeners.push(setState)
//     return () => {
//       const index = listeners.indexOf(setState)
//       if (index > -1) {
//         listeners.splice(index, 1)
//       }
//     }
//   }, [state])

//   return {
//     ...state,
//     toast,
//     dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
//   }
// }

























"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastVariant = "default" | "destructive";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toastWithId = { ...newToast, id };
    setToasts((prev) => [...prev, toastWithId]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`p-4 rounded-md shadow-lg max-w-sm cursor-pointer transition-all duration-300 ${
              toastItem.variant === "destructive"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-900 border border-gray-200"
            }`}
            onClick={() => dismiss(toastItem.id)}
          >
            {toastItem.title && (
              <div className="font-semibold text-sm mb-1">{toastItem.title}</div>
            )}
            {toastItem.description && (
              <div className="text-sm opacity-90">{toastItem.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Export the types for use in other components
export type { Toast, ToastVariant };