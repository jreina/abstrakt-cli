
export default (
  mappings: { [key: string]: (...args: any[]) => void },
  subject: { [key: string]: boolean },
  def: () => void
) => {
  const activeKey = Object.keys(mappings).find(key => subject[key]);
  // @ts-ignore
  if (activeKey) mappings[activeKey](subject[activeKey], ...subject.args);
  else def();
};
