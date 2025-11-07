import type { RenderItemFormOutletCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type TestFormOutletProps = {
  ctx: RenderItemFormOutletCtx;
};

export function TestFormOutlet({ ctx }: TestFormOutletProps) {
  // Get the current field values

  return (
    <Canvas ctx={ctx}>
      <div className="flex flex-col gap-2 p-6 bg-slate-100 rounded-md">
        <h2 className="text-2xl font-bold">This is an Outlet</h2>
        <div className="min-h-[8rem] rounded-lg bg-linear-to-t from-[#FEFFE2] to-white to-75% p-4 shadow-md relative">
          <div className="pointer-events-none absolute inset-0 z-0 flex w-full items-end justify-end p-4 opacity-50">
            context
          </div>
          <pre className="max-h-[400px] overflow-y-scroll">{JSON.stringify(ctx, undefined, 2)}</pre>
        </div>
      </div>
    </Canvas>
  );
}
