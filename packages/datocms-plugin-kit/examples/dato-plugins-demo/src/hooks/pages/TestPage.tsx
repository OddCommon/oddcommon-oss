import { type RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderPageCtx;
};

export function TestPage({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <div className="p-12">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">Test Page</h1>
          <p>
            Lorem ipsum dolor sit amet hac nibh consectetur erat cursus ut. Mattis massa faucibus
            imperdiet tellus mollis elit habitasse velit congue nunc suspendisse molestie leo.
            Tempus semper morbi nisi vitae ornare sed facilisis porttitor rhoncus. Lectus fusce a
            quisque purus aliqua etiam non quam nec luctus molestie. Quis leo suspendisse vestibulum
            venenatis magna pellentesque nunc sed scelerisque eros sed.
          </p>
        </div>
      </div>
    </Canvas>
  );
}
