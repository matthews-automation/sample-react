import ComponentMap from "@/core/component-map";

type ComponentMapProps = {
  data: Page;
  content?: any[];
  pagePath: string;
};

export default function ComponentMapper(props: ComponentMapProps) {
  const { data, content, pagePath } = props;
  const components = content
    ? content.map((module) => ComponentMap[module.acf_fc_layout])
    : [];
  return (
    <>
      {components.length ? (
        components.map((Component, i) =>
          Component ? (
            <Component key={i} {...data.acf.content![i]} isPageComponent={true} />
          ) : (
            <div key={i}>
              Component not found for key: {data.acf.content![i].acf_fc_layout}
            </div>
          )
        )
      ) : (
        <div className="container no-components">
          <div className="row justify-center align-center">
            <h1 className="display-4 text-center">
              No components on page:
              <br />
              {pagePath}
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
