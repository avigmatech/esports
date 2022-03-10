import React from "react";
import { Image } from "react-native";
import { Divider } from "react-native-paper";
import { Block, Text } from "../../../../components";
import { resolveImage } from "../../../../utils";
import * as fromModels from "../../models";

// type Props = {
//   details: fromModels.Substitute;
// };

const BasicSubstituteDetails = ({ Details }: Props) => {
  console.log(Details, "details");

  return (
    <React.Fragment>
      <Block noflex margin={10}>
        <Block noflex row>
          <Block noflex marginRight={20}>
            <Image
              source={{ uri: resolveImage(Details.userLogo) }}
              style={{ width: 100, height: 100 }}
            />
          </Block>
          <Block>
            <Block noflex row middle space="between" marginBottom={5}>
              <Text title primary>
                {Details.userName}
              </Text>
            </Block>
            <Block noflex row marginBottom={5}>
              <Text subtitle primary marginRight={10}>
                Region Name:
              </Text>
              <Text subtitle gray>
                {Details.regionName}
              </Text>
            </Block>
            <Block noflex row marginBottom={5}>
              <Text subtitle primary marginRight={10}>
                Date Joined:
              </Text>
              <Text subtitle gray>
                {Details.dateJoinedUTC}
              </Text>
            </Block>
            <Block noflex row marginBottom={5}>
              <Text subtitle primary marginRight={10}>
                MMR:
              </Text>
              <Text subtitle gray>
                {Details.mmr}
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
      <Divider />
    </React.Fragment>
  );
};

export default BasicSubstituteDetails;
