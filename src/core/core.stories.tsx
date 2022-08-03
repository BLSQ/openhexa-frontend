import ButtonComponent from "./components/Button";
import { Story } from "@ladle/react";

export const Button: Story<{
  text: string;
  variant: "primary" | "secondary" | "white" | "outlined" | "custom";
  size: "sm" | "md" | "lg" | "xl" | "xxl";
}> = ({ text, variant, size }) => {
  return (
    <ButtonComponent size={size} variant={variant}>
      {text}
    </ButtonComponent>
  );
};
Button.storyName = "Button";

Button.args = {
  text: "Hello world",
};
Button.argTypes = {
  variants: {
    options: ["primary", "secondary", "white", "outlined", "custom"],
    control: { type: "radio" },
    defaultValue: "primary",
  },
  size: {
    options: ["sm", "md", "lg", "xl", "xxl"],
    control: { type: "select" },
  },
};
