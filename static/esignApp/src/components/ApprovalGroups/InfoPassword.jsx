import React, { useRef, useEffect } from "react";

import ButtonGroup from "@atlaskit/button/button-group";
import Button from "@atlaskit/button/standard-button";
import noop from "@atlaskit/ds-lib/noop";
import Info from "@atlaskit/icon/glyph/info";
import { P300 } from "@atlaskit/theme/colors";
import { token } from "@atlaskit/tokens";

import { FlagsProvider, useFlags } from "@atlaskit/flag";

const actions = [
  {
    content: "Click here to reset",
    onClick: ResetPassword,
  },
];

const FlagGroupExample = () => {
  const flagCount = useRef(1);

  const { showFlag } = useFlags();
  useEffect(() => {
    (async () => {
      addFlag();
    })();
    return () => {};
  }, []);
  const addFlag = () => {
    const id = flagCount.current++;
    showFlag({
      actions,
      description: "Reset you password soon.",
      icon: (
        <Info label="Info" primaryColor={token("color.icon.discovery", P300)} />
      ),
      id: id,
      title: `Your esign password will expire in 12 days`,
    });
  };

  const addFlagNoId = () => {
    showFlag({
      actions,
      description: "I was not given an id.",
      icon: (
        <Info label="Info" primaryColor={token("color.icon.discovery", P300)} />
      ),
      title: `${flagCount.current++}: Whoa a new flag!`,
    });
  };

  const addAutoDismissFlag = () => {
    showFlag({
      actions,
      description: "I will automatically dismiss after 8 seconds.",
      icon: (
        <Info label="Info" primaryColor={token("color.icon.discovery", P300)} />
      ),
      title: `${flagCount.current++}: Whoa a new flag!`,
      isAutoDismiss: true,
    });
  };

  return <ButtonGroup></ButtonGroup>;
};

export default () => (
  <FlagsProvider>
    <FlagGroupExample />
  </FlagsProvider>
);
