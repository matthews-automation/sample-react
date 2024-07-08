import Form from "../Form";
import Tabs from "../Tabs";
import { getFormFields } from "@/core/utils";
import api from "@/core/api";
import Countries from "@/core/countries";
import { DIVISON_COOKIE, PRODUCT_COOKIE } from "@/core/constants";
import { getCookie } from "@/actions/cookies";
import Section from "../Section";

import "./index.scss";

export default async function Contact(props: ContactPage) {
  const { acf, locale } = props;
  const divisionCookie = await getCookie(DIVISON_COOKIE);
  const productCookie = await getCookie(PRODUCT_COOKIE);
  const { headline, form_tab_labels, form_labels, request_types } = acf;
  const tabOrder = ["email_us", "get_a_quote", "request_support", "find_us"];
  const tabs = tabOrder.map(
    (tab) => ({ desktop: form_tab_labels[tab as keyof typeof form_tab_labels], mobile: form_tab_labels[`${tab}_mobile` as keyof typeof form_tab_labels] })
  );
  const emailForm = getFormFields("email", form_labels);
  const quoteForm = getFormFields("quote", form_labels);
  const supportForm = getFormFields("support", form_labels);
  const divisions = await api.getDivisions(locale);
  let productOptions: Option[] = [];
  const defaultValues: { [key: string]: string } = {};
  if (divisionCookie) {
    defaultValues.division = divisionCookie;
    const products = await api.getProducts(locale, divisionCookie);
    productOptions = products.map((product) => ({
      value: `${product.ID}`,
      label: product.post_title,
    }));
  }
  if (productCookie) defaultValues.product_specialization = productCookie;
  
  const divisionOptions = divisions.map((division) => ({
    value: `${division.ID}`,
    label: division.post_title,
  }));
  const options: { [key: string]: Option[] } = {
    division: divisionOptions,
    country: Countries,
    request_type: request_types,
    maintenance_contract: [
      { value: "yes", label: form_labels.yes },
      { value: "no", label: form_labels.no },
    ],
  };
  if (productOptions.length) {
    options.product_specialization = productOptions;
    options.product_type = productOptions;
  }
  return (
    <div className="contact">
      <div className="container">
        <div className="row justify-center">
          <div className="col-lg-8">
            <h1
              className="display-5"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <Tabs tabs={tabs}>
              <Form
                messages={acf.form_mesages}
                fields={emailForm}
                submitLabel={form_labels.send_email}
              />
              <Form
                messages={acf.form_mesages}
                defaultValues={defaultValues}
                fields={quoteForm}
                submitLabel={form_labels.submit_request}
                options={options}
              />
              <Form
                messages={acf.form_mesages}
                defaultValues={defaultValues}
                fields={supportForm}
                submitLabel={form_labels.submit_request}
                options={options}
              />
              <div className="contact__wysiwiyg">
                <Section
                  section_content={acf.form_wysiwyg_tab}
                  expandable_content={false}
                  section_title=""
                />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
