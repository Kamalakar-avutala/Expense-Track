// src/CustomToast.jsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Toast } from "primereact/toast";

const DEFAULT_LIFE = 3000;

const CustomToast = forwardRef((props, ref) => {
  const toastRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show: ({ severity, summary, detail, life }) => {
      if (!severity || !summary) {
        console.warn("Toast: severity and summary are required");
        return;
      }
      toastRef.current?.show({
        severity,
        summary,
        detail,
        life: life || DEFAULT_LIFE,
      });
    }
  }));

  return (
    <Toast
      ref={toastRef}
      position={props.position || "top-right"}
      // optionally appendTo to ensure it's visible above everything
      appendTo={props.appendTo ?? "self"}
    />
  );
});

export default CustomToast;
