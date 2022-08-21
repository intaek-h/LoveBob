import "styled-components";
import { DefaultTheme } from "styled-components";
import { ThemeType } from "../constants/styleTheme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
