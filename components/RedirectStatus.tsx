"use client";

import { useEffect, useState } from "react";

type RedirectStatusProps = {
  message: string;
  redirectUrl?: string;
  showStatus: boolean;
};

export default function RedirectStatus({
  message,
  redirectUrl,
  showStatus,
}: RedirectStatusProps) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!redirectUrl) {
      return undefined;
    }

    const interval = setInterval(() => {
      setDots((value) => (value.length === 3 ? "." : `${value}.`));
    }, 100);

    return () => clearInterval(interval);
  }, [redirectUrl]);

  useEffect(() => {
    if (!redirectUrl) {
      return undefined;
    }

    const timer = setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 0);

    return () => clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <>
      {showStatus && (
        <p>
          {message}&nbsp;
          {redirectUrl ? dots : ""}
        </p>
      )}
    </>
  );
}
