import React, { useState } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { Avatar, Divider, List, useTheme } from "react-native-paper";
import { Block, TextInput } from "../../../../components";
import { resolveImage } from "../../../../utils";
import * as fromModels from "../../models";
import Icon from "react-native-vector-icons/Feather";
import { theme as coreTheme, theme } from "../../../../core/theme";

type Props = {
  teams: fromModels.TeamDetPlayers[];
  handlePlayerDetails: (team: fromModels.Player) => void;
  refreshData?: () => void;
  loading?: boolean;
};

const Players = ({
  teams,
  handlePlayerDetails,
  refreshData,
  loading = false,
}: Props) => {
  const theme = useTheme();
  var playersnames = [];
  teams.map(playername =>
    playername.players.filter(name => playersnames.push(name)),
  );
  const SortedPlayers = playersnames.sort((a, b) => {
    if (a.routes) return -1; // new check
    if (b.routes) return 1; // new check
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });

  const ref = React.useRef<ScrollView>(null);
  const [searchtext, setSearchtext] = useState(playersnames);
  const [search, setSearch] = useState(false);
  const onRefresh = React.useCallback(() => {
    refreshData && refreshData();
  }, []);

  const handleSearch = e => {
    setSearch(true);
    setSearchtext(
      playersnames.filter(i => i.name.toLowerCase().includes(e.toLowerCase())),
    );
    // setSearchtext(
    //   teams.filter(i => i.players[0]['name'].toLowerCase().includes(e.toLowerCase())),
    // );
    // teams.filter(i =>(i.players.filter(name =>console.log(name['name']) ))
    //  )
  };
  return (
    <React.Fragment>
      <Block noflex>
        <TextInput
          placeholder="Search for a Player"
          returnKeyType="next"
          onChangeText={e => handleSearch(e)}
          autoCapitalize="none"
          placeholderTextColor="#adadad"
          inputStyle={styles.textInput}
          placeholderTextColor="#adadad"
          containerStyle={styles.textInputContainer}
        />
        <Icon name="search" color="#ffffff" size={25} style={styles.search} />
      </Block>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary, theme.colors.text]}
          />
        }>
        {teams ? (
          <List.Section>
            {/* {teams.map(team => (
              <Block key={`team-${team.id}`}> */}
            {/* <List.Accordion
                  title={team.name}
                  left={props => (
                    <Avatar.Image
                      source={{ uri: resolveImage(team.logo) }}
                      size={40}
                    />
                  )}> */}
            {search === true
              ? searchtext.map(player => (
                  <Block noflex key={`player-${player.id}`}>
                    <List.Item
                      title={player.name}
                      left={props => (
                        <Avatar.Image
                          source={{ uri: resolveImage(player.logo) }}
                          size={30}
                        />
                      )}
                      style={{
                        flex: 1,
                        paddingLeft: 0,
                        marginLeft: 0,
                      }}
                      onPress={() => handlePlayerDetails(player)}
                    />
                    <Divider />
                  </Block>
                ))
              : playersnames.map(player => (
                  <Block noflex key={`player-${player.id}`}>
                    <List.Item
                      title={player.name}
                      left={props => (
                        <Avatar.Image
                          source={{ uri: resolveImage(player.logo) }}
                          size={30}
                        />
                      )}
                      style={{
                        flex: 1,
                        paddingLeft: 0,
                        marginLeft: 0,
                      }}
                      onPress={() => handlePlayerDetails(player)}
                    />
                    <Divider />
                  </Block>
                ))}
            {/* </List.Accordion> */}
            <Divider />
            {/* </Block>
            ))} */}
          </List.Section>
        ) : null}
      </ScrollView>
    </React.Fragment>
  );
};

export default Players;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
    paddingLeft: 10,
    // borderBottomColor: "transparent",
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
  search: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
