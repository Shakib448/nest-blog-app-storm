import * as yup from "yup";

export const signUpSchema = yup
  .object({
    username: yup.string().required().label("Username"),
    email: yup.string().email().required().label("Email"),
    password: yup.string().min(8).label("Password").required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null as any], "Passwords must match")
      .required()
      .label("Confirm Password"),
  })
  .required();
