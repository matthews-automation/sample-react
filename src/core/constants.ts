
export const RT_COOKIE = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}-rt`;

export const DIVISON_COOKIE = "preselect_division";

export const PRODUCT_COOKIE = "preselect_product";

export const COOKIE_EXPIRATION = 60 * 60 * 1000; // 1 hour

export const API_BASE_URL = process.env.NEXT_PUBLIC_FE_URL;

export const CACHE_OPTIONS: RequestInit = { cache: "force-cache" };

export const HEADER_HEIGHT = 80;

export const BASE_FORM_FIELDS = [
  { name: "first_name", type: "text", label: "", required: true, width: "half" },
  { name: "last_name", type: "text", label: "", required: true, width: "half" },
  { name: "email", type: "email", label: "", required: true, width: "half" },
  { name: "phone", type: "tel", label: "", required: true, width: "half" },
];
export const FORMS: { [key: string]: FormField[] } = {
  email: [
    ...BASE_FORM_FIELDS,
    { name: "your_message", type: "textarea", placeholder: "your_message_placeholder", label: "", required: true, width: "full" },
  ],
  quote: [
    ...BASE_FORM_FIELDS,
    { name: "company", type: "text", label: "", placeholder: "company_placeholder", required: true, width: "full" },
    { name: "country", type: "select", label: "", required: true, width: "full" },
    { name: "address", type: "text", label: "", required: true, width: "half" },
    { name: "address_2", type: "text", label: "", required: true, width: "half" },
    { name: "city", type: "text", label: "", required: true, width: "half" },
    { name: "zip_postal_code", type: "text", label: "", required: true, width: "half" },
    { name: "state_province", type: "select", depends_on: "country", label: "", required: true, width: "half" },
    { name: "division", type: "select", placeholder: "select_a_division", label: "", required: true, width: "half" },
    { name: "product_specialization", depends_on: "division", type: "select", placeholder: "select_product_specialization", label: "", required: true, width: "half" },
    { name: "project", type: "textarea", label: "", placeholder: "project_placeholder", required: true, width: "full" },
  ],
  support: [
    ...BASE_FORM_FIELDS,
    { name: "company", type: "text", label: "", placeholder: "company_placeholder", required: true, width: "full" },
    { name: "country", type: "select", label: "", required: true, width: "full" },
    { name: "address", type: "text", label: "", required: true, width: "half" },
    { name: "address_2", type: "text", label: "", required: true, width: "half" },
    { name: "city", type: "text", label: "", required: true, width: "half" },
    { name: "zip_postal_code", type: "text", label: "", required: true, width: "half" },
    { name: "state_province", depends_on: "country", type: "select", label: "", required: true, width: "half" },
    { name: "division", type: "select", placeholder: "select_a_division", label: "", required: true, width: "half" },
    { name: "product_type", depends_on: "division", type: "select", label: "", required: true, width: "half" },
    { name: "maintenance_contract", depends_on: "division", type: "radio", label: "", required: true, width: "half" },
    { name: "request_type", type: "select", label: "", required: true, width: "half" },
    { name: "project", type: "textarea", label: "", placeholder: "project_placeholder", required: true, width: "full" },
  ]
}