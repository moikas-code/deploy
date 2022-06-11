import React from "react";
const allTabs = [
  'explore',
  'wallet',
  'mint',
  //'sell', 'fill'
] as const;
type Tab = typeof allTabs[number];
export default function TabButton({
  tab,
  selected,
  selectTab,
}: {
  tab: Tab;
  selected: boolean;
  selectTab: React.Dispatch<React.SetStateAction<Tab>>;
}) {
  
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      selectTab(tab);
    },
    [selectTab, tab]
  );
  return (
    <button
      className={`btn btn-outline-light border-bottom`}
      onClick={onClick}
      style={{width: 100}}
      disabled={selected}>
      {tab}
    </button>
  );
}