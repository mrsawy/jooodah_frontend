import * as yup from "yup";

export const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  fullPhone: yup
    .string()
    .required("Phone is required")
    .min(12, "Phone must be at least 11 numbers")
    .max(14, "Phone cannot exceed 13 number"),
  name: yup.string().required("Name is required"),
  nationality: yup.string().required("nationality is required"),
  gender: yup.string().required("gender is required"),
  academicSpecialization: yup.string().required("academic specialization is required"),
  countryOfResidence: yup.string().required("country of residence is required"),
  // relatedExperience: yup.string().required("related experience is required"),
//   nationality: yup.string().required("nationality is required"),
  lastName: yup
    .string()
    .required("last Name is required")
    .matches(/^[A-Za-z\u0600-\u06FF]+$/, "Name can only contain letters"),
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z\u0600-\u06FF]+$/, "Name can only contain letters"),
});
