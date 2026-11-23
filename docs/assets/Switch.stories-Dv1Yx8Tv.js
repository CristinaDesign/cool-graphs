import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,p as n}from"./iframe-T601I_yR.js";import{n as r,t as i}from"./Switch-D31lSWPt.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{a=n(),r(),o=t(),s={title:`Components/Switch`,component:i,tags:[`autodocs`],args:{label:`Dark mode`,checked:!1,onChange:()=>{},iconOff:(0,o.jsxs)(`svg`,{viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,children:[(0,o.jsx)(`circle`,{cx:`12`,cy:`12`,r:`4`}),(0,o.jsx)(`path`,{d:`M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2`})]}),iconOn:(0,o.jsx)(`svg`,{viewBox:`0 0 24 24`,fill:`currentColor`,children:(0,o.jsx)(`path`,{d:`M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z`})})}},c={},l={args:{checked:!0}},u={args:{disabled:!0}},d={render:e=>{let[t,n]=(0,a.useState)(!1);return(0,o.jsx)(i,{...e,checked:t,onChange:n})}},f=[`Off`,`On`,`Disabled`,`Interactive`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onChange={setOn} />;
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Disabled,d as Interactive,c as Off,l as On,f as __namedExportsOrder,s as default};