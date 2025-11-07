# Sidebars and split views

# Resizable, left primary panel

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <div style={{ height: 500, position: 'relative' }}>
    <VerticalSplit primaryPane="left" size="25%" minSize={220}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar>
          <ToolbarStack stackSize="l">
            <ToolbarTitle>Primary</ToolbarTitle>
          </ToolbarStack>
        </Toolbar>
        <div
          style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '150px',
          }}
        >
          Main content
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-color)' }}>
        <Toolbar>
          <ToolbarStack stackSize="l">
            <ToolbarTitle>Secondary</ToolbarTitle>
          </ToolbarStack>
        </Toolbar>
        <div
          style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '150px',
          }}
        >
          Sidebar
        </div>
      </div>
    </VerticalSplit>
  </div>
</Canvas>
```

# Resizable, right primary panel

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <div style={{ height: 500, position: 'relative' }}>
    <VerticalSplit primaryPane="right" size="25%" minSize={220}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar>
          <ToolbarStack stackSize="l">
            <ToolbarTitle>Secondary</ToolbarTitle>
          </ToolbarStack>
        </Toolbar>
        <div
          style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '150px',
          }}
        >
          Sidebar
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-color)' }}>
        <Toolbar>
          <ToolbarStack stackSize="l">
            <ToolbarTitle>Primary</ToolbarTitle>
          </ToolbarStack>
        </Toolbar>
        <div
          style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '150px',
          }}
        >
          Main content
        </div>
      </div>
    </VerticalSplit>
  </div>
</Canvas>
```

# Collapsible

###### Preview

###### Code

```js
  <Canvas ctx={ctx}>
   <div style={{ height: 500, position: 'relative' }}>
     <StateManager initial={true}>
       {(isCollapsed, setCollapsed) => (
         <VerticalSplit
           primaryPane="left"
           size="25%"
           minSize={220}
           isSecondaryCollapsed={isCollapsed}
           onSecondaryToggle={setCollapsed}
         >
           <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
             <Toolbar>
               <ToolbarStack stackSize="l">
                 <ToolbarTitle>Primary</ToolbarTitle>
               </ToolbarStack>
             </Toolbar>
             <div
               style={{
                 flex: '1',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: '150px',
               }}
             >
               Main content
             </div>
           </div>
           <div
             style={{
               display: 'flex',
               flexDirection: 'column',
               height: '100%',
               borderLeft: '1px solid var(--border-color)',
             }}
           >
             <Toolbar>
               <ToolbarStack stackSize="l">
                 <ToolbarTitle>Secondary</ToolbarTitle>
               </ToolbarStack>
             </Toolbar>
             <div
               style={{
                 flex: '1',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: '150px',
               }}
             >
               Sidebar
             </div>
           </div>
         </VerticalSplit>
       )}
     </StateManager>
   </div>
 </Canvas>
```

# Overlay mode

###### Preview

###### Code

```js
  <Canvas ctx={ctx}>
   <div style={{ height: 500, position: 'relative' }}>
     <StateManager initial={true}>
       {(isCollapsed, setCollapsed) => (
         <VerticalSplit
           mode="overlay"
           primaryPane="left"
           size="25%"
           minSize={220}
           isSecondaryCollapsed={isCollapsed}
           onSecondaryToggle={setCollapsed}
         >
           <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
             <Toolbar>
               <ToolbarStack stackSize="l">
                 <ToolbarTitle>Primary</ToolbarTitle>
               </ToolbarStack>
             </Toolbar>
             <div
               style={{
                 flex: '1',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: '150px',
               }}
             >
               Main content
             </div>
           </div>
           <div
             style={{
               display: 'flex',
               flexDirection: 'column',
               height: '100%',
               borderLeft: '1px solid var(--border-color)',
             }}
           >
             <Toolbar>
               <ToolbarStack stackSize="l">
                 <ToolbarTitle>Secondary</ToolbarTitle>
               </ToolbarStack>
             </Toolbar>
             <div
               style={{
                 flex: '1',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: '150px',
               }}
             >
               Sidebar
             </div>
           </div>
         </VerticalSplit>
       )}
     </StateManager>
   </div>
 </Canvas>
```

## Related content in "Plugin SDK"

- [Introduction to the DatoCMS Plugin SDK](introduction.md)

- [Build your first DatoCMS plugin](build-your-first-plugin.md)
- [Real-world examples](real-world-examples.md)

- [What hooks are](what-hooks-are.md)
- [Config screen](config-screen.md)

- [Custom pages](custom-pages.md)
- [Sidebars and sidebar panels](sidebar-panels.md)

- [Outlets](form-outlets.md)
- [Field extensions](field-extensions.md)

- [Manual field extensions](manual-field-extensions.md)
- [Dropdown actions](dropdown-actions.md)

- [Structured Text customizations](structured-text-customizations.md)
- [Asset sources](asset-sources.md)

- [Opening modals](modals.md)
- [Event hooks](event-hooks.md)

- [Customize record presentation](customize-presentation.md)
- [React UI Components](react-datocms-ui.md)

- [Button](button.md)
- [Button group](button-group.md)

- [Dropdown](dropdown.md)
- [Form](form.md)

- [Section](section.md)
- [Sidebar panel](sidebar-panel.md)

- [Spinner](spinner.md)
- [Toolbar](toolbar.md)

- [Sidebars and split views](sidebars-and-split-views.md)
- [Additional permissions](additional-permissions.md)

- [Working with form values](working-with-form-values.md)
- [Publishing to Marketplace](publishing-to-marketplace.md)

- [Releasing new plugin versions](releasing-new-plugin-versions.md)
- [Migrating from legacy plugins](migrating-from-legacy-plugins.md)