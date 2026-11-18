interface SplashDevice {
  width: number;
  height: number;
  ratio: number;
}

export const SPLASH_DEVICES: readonly SplashDevice[] = [
  { width: 440, height: 956, ratio: 3 },
  { width: 420, height: 912, ratio: 3 },
  { width: 402, height: 874, ratio: 3 },
  { width: 430, height: 932, ratio: 3 },
  { width: 393, height: 852, ratio: 3 },
  { width: 428, height: 926, ratio: 3 },
  { width: 390, height: 844, ratio: 3 },
  { width: 414, height: 896, ratio: 3 },
  { width: 375, height: 812, ratio: 3 },
  { width: 414, height: 896, ratio: 2 },
  { width: 414, height: 736, ratio: 3 },
  { width: 375, height: 667, ratio: 2 },
  { width: 320, height: 568, ratio: 2 },
];

export const SPLASH_BACKGROUND = "#f2f4f6";

export const splashFileName = (device: SplashDevice) =>
  `apple-splash-${device.width * device.ratio}x${device.height * device.ratio}.png`;

export const appleStartupImages = () =>
  SPLASH_DEVICES.map((device) => ({
    url: `/splash/${splashFileName(device)}`,
    media: [
      "screen",
      `(device-width: ${device.width}px)`,
      `(device-height: ${device.height}px)`,
      `(-webkit-device-pixel-ratio: ${device.ratio})`,
      "(orientation: portrait)",
    ].join(" and "),
  }));
