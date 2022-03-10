import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/core";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import {
  Card,
  Button,
  Portal,
  Dialog,
  Paragraph,
  Text,
  HelperText,
} from "react-native-paper";
import { EmptyBlockMessage, TextInput, Block } from "../../../components";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getTeams, loadMyTeams } from "../../settings/store";
import * as fromModels from "../models";
import { theme as coreTheme } from "../../../core/theme";
import {
  createATeam,
  getActiveLeague,
  getActiveLeagueRegionIDsMap,
  getActiveLeagueTeams,
  getLeagueRegions,
  loadRegionsByLeague,
} from "../store";
import { useToast } from "react-native-paper-toast";

const CreateTeam = () => {
  const dispatch = useAppDispatch();
  const toaster = useToast();

  const regionIDs = useAppSelector(getActiveLeagueRegionIDsMap);
  const activeLeague = useAppSelector(getActiveLeague)!;
  const regions = useAppSelector(getLeagueRegions);
  const [visible, setVisible] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        dispatch(loadMyTeams());
        dispatch(loadRegionsByLeague(activeLeague.key));
      }

      return () => {
        mounted = false;
      };
    }, [activeLeague.key]),
  );

  const isRegistered = (region: fromModels.Region) => {
    return regionIDs.includes(region.id);
  };

  const handleRegister = async () => {
    if (selectedRegion && teamName.trim()) {
      setLoading(true);
      try {
        await dispatch(
          createATeam({
            name: teamName,
            region: selectedRegion,
          }),
        );
        dispatch(loadMyTeams());
        dispatch(loadRegionsByLeague(activeLeague.key));
        setLoading(false);
        hideDialog();
      } catch (error) {
        setLoading(false);
        toaster.show({
          message: "An error occurred while processing your request.",
          type: "error",
        });
      }
    } else {
      toaster.show({
        message: "Please enter team name",
        type: "info",
      });
    }
  };

  const showDialog = (item: fromModels.Region) => {
    setSelectedRegion(item.id);
    setVisible(true);
  };

  const hideDialog = () => {
    setTeamName("");
    setSelectedRegion(null);
    setVisible(false);
  };

  const renderItem = (item: fromModels.Region) => {
    console.log(item, "itemmmmmm");

    return (
      <Card style={{ marginBottom: 10 }}>
        <Card.Title
          title={item.name}
          right={() =>
            regionIDs.length > 0 ? (
              !isRegistered(item) ? null : (
                <Block marginRight={15} center middle>
                  <Text>Registered</Text>
                </Block>
              )
            ) : (
              <Button onPress={() => showDialog(item)}>Register</Button>
            )
          }
        />
      </Card>
    );
  };
  const renderInputModal = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Team Name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder="Your Team Name"
              returnKeyType="next"
              value={teamName}
              onChangeText={value => setTeamName(value)}
              inputStyle={styles.textInput}
              placeholderTextColor="#adadad"
              containerStyle={styles.textInputContainer}
              autoCapitalize="none"
            />
            <HelperText type="info" style={{ paddingHorizontal: 0 }}>
              Note: Your team will be greyed-out by default. When you have
              enough players, you'll be able to activate it in your Teams page
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              loading={loading}
              disabled={loading}
              onPress={handleRegister}>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {renderInputModal()}
      <FlatList
        data={regions}
        keyExtractor={item => `region-item-${item.id}`}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={() => (
          <EmptyBlockMessage message={"No regions are available."} />
        )}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{
          margin: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default CreateTeam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
    paddingLeft: 10,
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
});
