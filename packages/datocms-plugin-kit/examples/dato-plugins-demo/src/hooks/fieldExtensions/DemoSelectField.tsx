import type { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type DemoSelectFieldProps = {
  ctx: RenderFieldExtensionCtx;
};

export function DemoSelectField({ ctx }: DemoSelectFieldProps) {
  const options = [
    { label: 'DEMO 01', value: 'demo-01' },
    { label: 'DEMO 02', value: 'demo-02' },
  ];

  return (
    <Canvas ctx={ctx}>
      <div className="flex flex-col gap-2 p-6 bg-slate-100 rounded-md">
        <p>The String Field have been Overriden by the plugin.</p>
        <select
          name={ctx.fieldPath}
          id={ctx.fieldPath}
          className="w-full p-2 border border-gray-300 rounded-md"
          value={ctx.formValues[ctx.fieldPath] as string}
          onChange={(e) => {
            ctx.setFieldValue(ctx.fieldPath, e.target.value);
          }}
        >
          {options.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </Canvas>
  );
}
