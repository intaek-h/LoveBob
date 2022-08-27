import "styled-components";
import { DefaultTheme } from "styled-components";
import { ThemeType } from "../themes/styleTheme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
