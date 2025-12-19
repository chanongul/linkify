"use client";

import { useEffect, useState } from "react";

type RedirectStatusProps = {
  message: string;
  redirectUrl?: string;
};

export default function RedirectStatus({
  message,
  redirectUrl,
}: RedirectStatusProps) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!redirectUrl) {
      return undefined;
    }

    const interval = setInterval(() => {
      setDots((value) => (value.length === 3 ? "." : `${value}.`));
    }, 500);

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
    <p>
      {message}&nbsp;
      {redirectUrl ? dots : ""}
    </p>
  );
}
