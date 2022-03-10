import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, Image } from "react-native";
import { Block, Text } from "../../../components";
import { BasicSubstituteDetails } from "../components/players";
import { useAppDispatch, useAppSelector } from "../../../store";

import * as fromModels from "../models";
import { getPlayerDetails, loadPlayerDetails } from "../store";
import TextInput from "../../../components";

type Props = {
  navigation: fromModels.PlayersStackNavigatorProp;
  route: fromModels.PlayerDetailsRouteProp;
};

const SubstituteDetails = ({ navigation, route }: Props) => {
  const {
    params: { substitute, substituteName, substituteId },
  } = route;
  const Details: fromModels.Substitute | undefined = substitute;

  console.log(Details, "substituteDetails");

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        navigation.setOptions({
          headerTitle: substituteName,
        });
      }

      return () => {
        mounted = false;
      };
    }, [substituteId, substituteName, substitute]),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Block>{Details && <BasicSubstituteDetails Details={Details} />}</Block>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubstituteDetails;
