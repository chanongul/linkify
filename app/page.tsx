import { headers } from "next/headers";
import RedirectStatus from "@/components/RedirectStatus";

type HomeProps = {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
};

type DeviceType = "mobile" | "desktop";

const toString = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const detectDeviceType = (userAgent: string): DeviceType => {
  const normalized = userAgent.toLowerCase();
  if (/(ipad|iphone|ipod|android|mobile)/.test(normalized)) {
    return "mobile";
  }
  if (/(windows|macintosh|linux|x11|cros)/.test(normalized)) {
    return "desktop";
  }
  return "desktop";
};

const normalizeDeviceValue = (
  value: string | undefined
): DeviceType | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (
    ["ios", "ipad", "iphone", "ipod", "android", "mobile"].includes(normalized)
  ) {
    return "mobile";
  }
  if (["desktop", "macos", "windows", "pc", "linux"].includes(normalized)) {
    return "desktop";
  }
  return undefined;
};

export default async function Home(props: HomeProps) {
  const searchParams = (await props.searchParams) ?? {};

  const entriesSource: Record<string, string | string[] | undefined> = {
    ...searchParams,
  };
  const indices = Array.from(
    new Set(
      Object.keys(entriesSource)
        .map((key) => key.match(/(device|url)(\d+)/)?.[2])
        .filter((value): value is string => Boolean(value))
    )
  )
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  const deviceEntries = indices
    .map((index) => {
      const device = toString(entriesSource[`device${index}`]);
      const url = toString(entriesSource[`url${index}`]);

      if (!device || !url) {
        return null;
      }

      return { device, url };
    })
    .filter((entry): entry is { device: string; url: string } =>
      Boolean(entry)
    );

  const userAgent = (await headers()).get("user-agent") ?? "";
  const detectedDevice = detectDeviceType(userAgent);

  const match = deviceEntries.find((entry) => {
    const normalizedEntryDevice = normalizeDeviceValue(entry.device);
    return normalizedEntryDevice === detectedDevice;
  });

  const statusMessage = match
    ? `Device is ${detectedDevice}, redirecting to ${match.url}`
    : `No matching entry for detected device: ${detectedDevice}.`;

  const verboseParam = toString(searchParams["verbose"]);
  const verboseValue = verboseParam?.toLowerCase();
  const showStatus = verboseValue ? verboseValue !== "false" : true;

  return (
    <RedirectStatus
      message={statusMessage}
      redirectUrl={match?.url}
      showStatus={showStatus}
    />
  );
}
