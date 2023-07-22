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

export const UpdateCredentials = yup
  .object({
    currentPassword: yup.string().required().label("Current Password"),
    newPassword: yup.string().min(8).label("newPassword").required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null as any], "Passwords must match")
      .required()
      .label("Confirm Password"),
  })
  .required();
