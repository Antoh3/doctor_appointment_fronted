// import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";


// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// export const fontMono = FontMono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });
import "@fontsource/inter/variable.css";
import "@fontsource/fira-code/variable.css";


export const fontSans = {
  variable: "--font-sans",
  className: "font-sans",
};

export const fontMono = {
  variable: "--font-mono",
  className: "font-mono",
};
