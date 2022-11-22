import noop from "@atlaskit/ds-lib/noop";
import InfoIcon from "@atlaskit/icon/glyph/info";
import { N500 } from "@atlaskit/theme/colors";
import { token } from "@atlaskit/tokens";
import Flag from "@atlaskit/flag";

const FlagInformation = (props) => {
  const { resetPassword } = props;

  function newResetPassword() {
    resetPassword(null, true);
  }
  return (
    <Flag
      appearance="info"
      icon={
        <InfoIcon
          label="Info"
          secondaryColor={token("color.background.neutral.bold", N500)}
        />
      }
      id="info"
      key="info"
      title="Your Password will expire in 12 days"
      description="Reset your password using strong password requirements."
      actions={[
        { content: "Reset Password", onClick: newResetPassword() },
        { content: "Close", onClick: noop },
      ]}
    />
  );
};

export default FlagInformation;
