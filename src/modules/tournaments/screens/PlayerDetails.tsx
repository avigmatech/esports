import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, Image } from "react-native";
import { Block, Text } from "../../../components";
import { BasicDetails } from "../components/players";
import { useAppDispatch, useAppSelector } from "../../../store";

import * as fromModels from "../models";
import { getPlayerDetails, loadPlayerDetails } from "../store";
import TextInput from "../../../components";

type Props = {
  navigation: fromModels.PlayersStackNavigatorProp;
  route: fromModels.PlayerDetailsRouteProp;
};

const PlayerDetails = ({ navigation, route }: Props) => {
  const {
    params: { playerName, playerId },
  } = route;
  const dispatch = useAppDispatch();
  const playerDetails: fromModels.Player | undefined = useAppSelector(
    getPlayerDetails,
  );

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        navigation.setOptions({
          headerTitle: playerName,
        });
        dispatch(loadPlayerDetails(playerId));
      }

      return () => {
        mounted = false;
      };
    }, [playerId, playerName]),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Block>
          {playerDetails && <BasicDetails details={playerDetails} />}
        </Block>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayerDetails;
